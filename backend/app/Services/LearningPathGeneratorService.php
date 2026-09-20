<?php

namespace App\Services;

use App\Models\Course;
use App\Models\QuestionOption;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class LearningPathGeneratorService
{
    /**
     * Foundational tags that should appear earlier within the same level.
     */
    protected const FOUNDATION_TAGS = [
        'Programación',
        'Buenas Prácticas',
        'Clean Code',
        'SOLID',
        'Git',
        'GitHub',
        'Herramientas',
        'JavaScript',
        'TypeScript',
        'Dart',
    ];

    /**
     * Intermediate infrastructure tags.
     */
    protected const MID_FOUNDATION_TAGS = [
        'SQL',
        'PostgreSQL',
        'Database',
        'Docker',
        'Contenedores',
    ];

    /**
     * Area display labels for title and description generation.
     */
    protected const AREA_LABELS = [
        'frontend' => 'Frontend Web Moderno',
        'backend' => 'Backend y Arquitectura de APIs',
        'mobile' => 'Desarrollo Mobile Multiplataforma',
        'devops' => 'DevOps, Cloud y Contenedores',
        'fullstack' => 'Desarrollo Fullstack Profesional',
    ];

    /**
     * Level display labels.
     */
    protected const LEVEL_LABELS = [
        'beginner' => 'Principiante a Intermedio',
        'intermediate' => 'Intermedio a Avanzado',
        'advanced' => 'Especialización Avanzada',
    ];

    /**
     * Generate a personalized learning path recommendation based on questionnaire answers.
     *
     * @param array $inputs Array of option IDs, option values, or associative answer maps
     * @return array
     */
    public function generate(array $inputs): array
    {
        $selectedOptions = $this->resolveOptions($inputs);
        
        $userLevel = 'beginner';
        $interestAreas = [];
        $goal = 'first_job';
        $tagScores = [];

        foreach ($selectedOptions as $option) {
            $category = $option->question?->category;

            if ($category === 'skill_level') {
                $userLevel = $option->value;
            } elseif ($category === 'interest_area') {
                $interestAreas[] = $option->value;
            } elseif ($category === 'goals') {
                $goal = $option->value;
            }

            if (is_array($option->weight)) {
                foreach ($option->weight as $tag => $weight) {
                    $tagScores[$tag] = ($tagScores[$tag] ?? 0) + (int) $weight;
                }
            }
        }

        // Fallback default interests if none provided
        if (empty($interestAreas)) {
            $interestAreas = ['fullstack'];
        }

        // If no weights were extracted, create baseline tag scores based on interests
        if (empty($tagScores)) {
            $tagScores = $this->getBaselineTagScores($interestAreas);
        }

        // Retrieve catalog of courses with their associated tags
        $allCourses = Course::with('tags')->get();

        if ($allCourses->isEmpty()) {
            return $this->buildEmptyResponse($userLevel, $interestAreas);
        }

        // Score and rank all courses
        $scoredCourses = $this->scoreCourses($allCourses, $tagScores, $userLevel);

        // Filter and pick top relevant courses (min 3, max 6)
        $selectedCourses = $this->selectTopCourses($scoredCourses, $userLevel);

        // Sort selected courses in pedagogical order
        $orderedCourses = $this->orderPedagogically($selectedCourses);

        // Format courses with sequence metadata
        $totalHours = 0;
        $formattedCourses = [];
        $step = 1;

        foreach ($orderedCourses as $item) {
            /** @var Course $course */
            $course = $item['course'];
            $hours = $this->extractHours($course->duration);
            $totalHours += $hours;

            $formattedCourses[] = [
                'step' => $step,
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'level' => $course->level,
                'duration' => $course->duration,
                'url' => $course->url,
                'image_url' => $course->image_url,
                'tags' => $course->tags->pluck('name')->values()->toArray(),
                'reason' => $this->generateCourseReason($step, count($orderedCourses), $course->level, $item['matched_tags']),
            ];
            $step++;
        }

        $title = $this->generateTitle($interestAreas, $userLevel);
        $description = $this->generateDescription($interestAreas, $userLevel, $goal, count($formattedCourses));

        return [
            'title' => $title,
            'description' => $description,
            'level' => $userLevel,
            'estimated_duration' => "{$totalHours} horas",
            'total_courses' => count($formattedCourses),
            'target_areas' => array_values(array_map(fn($a) => self::AREA_LABELS[$a] ?? ucfirst($a), $interestAreas)),
            'courses' => $formattedCourses,
        ];
    }

    /**
     * Resolve option inputs into QuestionOption models.
     */
    protected function resolveOptions(array $inputs): Collection
    {
        $rawItems = [];

        // Support formats: ["beginner", "frontend"] or [1, 2] or {"options": [...]} or {"answers": [...]}
        if (isset($inputs['options']) && is_array($inputs['options'])) {
            $rawItems = $inputs['options'];
        } elseif (isset($inputs['answers']) && is_array($inputs['answers'])) {
            $rawItems = $inputs['answers'];
        } else {
            $rawItems = $inputs;
        }

        // Flatten any nested structure
        $flattened = [];
        array_walk_recursive($rawItems, function ($val) use (&$flattened) {
            if ($val !== null && $val !== '') {
                $flattened[] = $val;
            }
        });

        $ids = array_filter($flattened, fn($v) => is_numeric($v));
        $values = array_filter($flattened, fn($v) => is_string($v) && !is_numeric($v));

        return QuestionOption::with('question')
            ->where(function ($query) use ($ids, $values) {
                if (!empty($ids)) {
                    $query->orWhereIn('id', $ids);
                }
                if (!empty($values)) {
                    $query->orWhereIn('value', $values);
                }
            })
            ->get();
    }

    /**
     * Fallback baseline tag scores when no option weights are available.
     */
    protected function getBaselineTagScores(array $interestAreas): array
    {
        $scores = ['JavaScript' => 2, 'Git' => 2, 'Clean Code' => 1];
        foreach ($interestAreas as $area) {
            switch ($area) {
                case 'frontend':
                    $scores['Frontend'] = 4;
                    $scores['React'] = 3;
                    $scores['Angular'] = 3;
                    $scores['TypeScript'] = 2;
                    break;
                case 'backend':
                    $scores['Backend'] = 4;
                    $scores['Node.js'] = 3;
                    $scores['Laravel'] = 3;
                    $scores['APIs'] = 2;
                    break;
                case 'mobile':
                    $scores['Mobile'] = 4;
                    $scores['Flutter'] = 3;
                    $scores['Dart'] = 2;
                    break;
                case 'devops':
                    $scores['DevOps'] = 4;
                    $scores['Docker'] = 3;
                    $scores['Kubernetes'] = 3;
                    break;
                case 'fullstack':
                default:
                    $scores['Fullstack'] = 4;
                    $scores['Frontend'] = 3;
                    $scores['Backend'] = 3;
                    $scores['React'] = 2;
                    $scores['Node.js'] = 2;
                    break;
            }
        }
        return $scores;
    }

    /**
     * Score courses based on tag affinities and user level.
     */
    protected function scoreCourses(EloquentCollection $courses, array $tagScores, string $userLevel): array
    {
        $scored = [];

        foreach ($courses as $course) {
            $tagNames = $course->tags->pluck('name')->toArray();
            $affinityScore = 0;
            $matchedTags = [];

            foreach ($tagNames as $tagName) {
                if (isset($tagScores[$tagName])) {
                    $weight = $tagScores[$tagName];
                    $affinityScore += $weight;
                    if ($weight > 0) {
                        $matchedTags[] = $tagName;
                    }
                }
            }

            // Level modifier to promote courses aligned with the user's current knowledge
            $levelModifier = match ($userLevel) {
                'beginner' => match ($course->level) {
                    'beginner' => 15,
                    'intermediate' => 6,
                    'advanced' => -15,
                    default => 0,
                },
                'intermediate' => match ($course->level) {
                    'intermediate' => 15,
                    'advanced' => 8,
                    'beginner' => 3,
                    default => 0,
                },
                'advanced' => match ($course->level) {
                    'advanced' => 20,
                    'intermediate' => 8,
                    'beginner' => -20,
                    default => 0,
                },
                default => 0,
            };

            $totalScore = $affinityScore + $levelModifier;

            $scored[] = [
                'course' => $course,
                'total_score' => $totalScore,
                'affinity_score' => $affinityScore,
                'matched_tags' => $matchedTags,
                'level' => $course->level,
            ];
        }

        // Sort descending by total score
        usort($scored, fn($a, $b) => $b['total_score'] <=> $a['total_score']);

        return $scored;
    }

    /**
     * Select the top relevant courses (minimum 3, maximum 6).
     */
    protected function selectTopCourses(array $scoredCourses, string $userLevel): array
    {
        // Filter courses with positive affinity/score
        $qualified = array_filter($scoredCourses, fn($item) => $item['total_score'] > 0);

        // Ensure at least 3 courses if catalog allows
        if (count($qualified) < 3) {
            $qualified = array_slice($scoredCourses, 0, min(3, count($scoredCourses)));
        } else {
            $qualified = array_slice($qualified, 0, 6);
        }

        return array_values($qualified);
    }

    /**
     * Order courses pedagogically:
     * 1. Level order: beginner -> intermediate -> advanced
     * 2. Within same level: foundational concepts -> frameworks -> architectures
     */
    protected function orderPedagogically(array $courses): array
    {
        $levelWeights = [
            'beginner' => 1,
            'intermediate' => 2,
            'advanced' => 3,
        ];

        usort($courses, function ($a, $b) use ($levelWeights) {
            $levelA = $levelWeights[$a['course']->level] ?? 2;
            $levelB = $levelWeights[$b['course']->level] ?? 2;

            if ($levelA !== $levelB) {
                return $levelA <=> $levelB;
            }

            // Within same level, evaluate prerequisite/foundation priority
            $foundationalRankA = $this->getFoundationalRank($a['course']);
            $foundationalRankB = $this->getFoundationalRank($b['course']);

            if ($foundationalRankA !== $foundationalRankB) {
                return $foundationalRankA <=> $foundationalRankB;
            }

            // Fallback to highest total score first
            return $b['total_score'] <=> $a['total_score'];
        });

        return $courses;
    }

    /**
     * Calculate foundational rank for a course.
     * Lower number means earlier in the path.
     */
    protected function getFoundationalRank(Course $course): int
    {
        $tags = $course->tags->pluck('name')->toArray();

        foreach ($tags as $tag) {
            if (in_array($tag, self::FOUNDATION_TAGS, true)) {
                return 1;
            }
        }

        foreach ($tags as $tag) {
            if (in_array($tag, self::MID_FOUNDATION_TAGS, true)) {
                return 2;
            }
        }

        return 3;
    }

    /**
     * Extract integer hours from duration string (e.g. '42 horas' -> 42).
     */
    protected function extractHours(string $duration): int
    {
        preg_match('/\d+/', $duration, $matches);
        return isset($matches[0]) ? (int) $matches[0] : 10;
    }

    /**
     * Generate dynamic contextual title for the path.
     */
    protected function generateTitle(array $interestAreas, string $userLevel): string
    {
        $primaryAreaKey = $interestAreas[0] ?? 'fullstack';
        $primaryArea = self::AREA_LABELS[$primaryAreaKey] ?? 'Desarrollo de Software';

        return match ($userLevel) {
            'beginner' => "Ruta Fundacional: {$primaryArea}",
            'advanced' => "Ruta Avanzada y Especialización: {$primaryArea}",
            default => "Ruta Profesional: {$primaryArea}",
        };
    }

    /**
     * Generate pedagogical description justifying the sequence.
     */
    protected function generateDescription(array $interestAreas, string $userLevel, string $goal, int $count): string
    {
        $areaNames = implode(', ', array_map(fn($k) => self::AREA_LABELS[$k] ?? ucfirst($k), $interestAreas));
        $levelLabel = self::LEVEL_LABELS[$userLevel] ?? 'Personalizado';

        $goalText = match ($goal) {
            'first_job' => 'diseñado para prepararte de cara a tus primeras oportunidades laborales con bases sólidas.',
            'switch_area' => 'orientado a facilitar tu transición técnica hacia un nuevo stack de alta demanda.',
            'specialize' => 'estructurado para profundizar en patrones de arquitectura, buenas prácticas y nivel de producción.',
            'portfolio' => 'enfocado en entregarte el dominio necesario para construir proyectos de gran impacto visual y técnico.',
            default => 'adaptado a tus metas de aprendizaje profesional.',
        };

        return "Itinerario de {$count} cursos curados para nivel {$levelLabel}, centrado en {$areaNames}. Este programa está {$goalText} La secuencia sigue una progresión pedagógica que va desde fundamentos indispensables hasta especializaciones avanzadas.";
    }

    /**
     * Generate individual pedagogical reason for a course step.
     */
    protected function generateCourseReason(int $step, int $totalSteps, string $level, array $matchedTags): string
    {
        $tagsContext = !empty($matchedTags) ? ' ' . implode(' y ', array_slice($matchedTags, 0, 2)) : '';

        if ($step === 1) {
            return "Paso inicial fundamental para consolidar las bases de{$tagsContext} antes de abordar arquitecturas más complejas.";
        }

        if ($step === $totalSteps) {
            return "Módulo culminante de especialización para dominar estándares de nivel productivo y proyectos avanzados.";
        }

        return "Profundiza en el dominio práctico de{$tagsContext}, conectando con los conceptos previos y preparando los módulos siguientes.";
    }

    /**
     * Build fallback response if no courses exist in catalog.
     */
    protected function buildEmptyResponse(string $userLevel, array $interestAreas): array
    {
        return [
            'title' => $this->generateTitle($interestAreas, $userLevel),
            'description' => 'No se encontraron cursos disponibles en el catálogo para los criterios seleccionados.',
            'level' => $userLevel,
            'estimated_duration' => '0 horas',
            'total_courses' => 0,
            'target_areas' => [],
            'courses' => [],
        ];
    }
}
