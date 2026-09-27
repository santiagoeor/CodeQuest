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
     * Framework tags that should not receive foundational priority ranking.
     */
    protected const FRAMEWORK_TAGS = [
        'React',
        'Angular',
        'Next.js',
        'NestJS',
        'Laravel',
        'Flutter',
        'React Native',
        'SwiftUI',
        'Riverpod',
        'PWA',
        'Kubernetes',
        'Node.js',
    ];

    /**
     * Mutually alternative technology tracks. If the user explicitly selects one technology in a track,
     * courses whose primary identity is an unselected alternative in the same track are excluded.
     */
    protected const TECH_TRACKS = [
        'frontend_framework' => [
            'react' => ['React', 'Next.js', 'MERN'],
            'angular' => ['Angular'],
        ],
        'backend_stack' => [
            'php_laravel' => ['Laravel', 'PHP', 'Eloquent'],
            'nodejs' => ['Node.js', 'Express', 'MongoDB'],
        ],
        'mobile_framework' => [
            'dart_flutter' => ['Flutter', 'Dart', 'Riverpod'],
            'react_native' => ['React Native'],
        ],
    ];

    /**
     * Mapping from interest areas to associated tags.
     */
    protected const AREA_TAG_MAP = [
        'frontend' => ['Frontend', 'React', 'Angular', 'Next.js', 'Web', 'PWA', 'JavaScript'],
        'backend' => ['Backend', 'Node.js', 'Laravel', 'NestJS', 'PHP', 'Express', 'APIs', 'SQL', 'PostgreSQL', 'Database', 'Go'],
        'mobile' => ['Mobile', 'Flutter', 'React Native', 'Dart', 'iOS', 'Android', 'SwiftUI', 'Riverpod'],
        'devops' => ['DevOps', 'Docker', 'Kubernetes', 'Cloud', 'Contenedores'],
        'fullstack' => ['Fullstack', 'Frontend', 'Backend'],
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
        $experienceTechs = [];
        $tagScores = [];

        foreach ($selectedOptions as $option) {
            $category = $option->question?->category;

            if ($category === 'skill_level') {
                $userLevel = $option->value;
            } elseif ($category === 'interest_area') {
                $interestAreas[] = $option->value;
            } elseif ($category === 'experience') {
                $experienceTechs[] = $option->value;
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
        $scoredCourses = $this->scoreCourses($allCourses, $tagScores, $userLevel, $experienceTechs);

        // Filter and pick top relevant courses (min 3, max 6)
        $selectedCourses = $this->selectTopCourses($scoredCourses, $userLevel, $interestAreas);

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
        $scores = [
            'Programación' => 2,
            'Git' => 2,
            'Clean Code' => 1,
            'Buenas Prácticas' => 1,
        ];

        foreach ($interestAreas as $area) {
            switch ($area) {
                case 'frontend':
                    $scores['Frontend'] = 5;
                    $scores['React'] = 4;
                    $scores['Angular'] = 4;
                    $scores['Next.js'] = 4;
                    $scores['JavaScript'] = 2;
                    $scores['TypeScript'] = 2;
                    $scores['Web'] = 3;
                    $scores['PWA'] = 3;
                    break;
                case 'backend':
                    $scores['Backend'] = 5;
                    $scores['Node.js'] = 4;
                    $scores['Laravel'] = 4;
                    $scores['NestJS'] = 4;
                    $scores['PHP'] = 3;
                    $scores['APIs'] = 3;
                    $scores['SQL'] = 3;
                    $scores['PostgreSQL'] = 3;
                    $scores['Go'] = 4;
                    $scores['Express'] = 2;
                    break;
                case 'mobile':
                    $scores['Mobile'] = 5;
                    $scores['Flutter'] = 5;
                    $scores['React Native'] = 4;
                    $scores['Dart'] = 3;
                    $scores['iOS'] = 3;
                    $scores['Android'] = 3;
                    $scores['SwiftUI'] = 4;
                    $scores['Riverpod'] = 3;
                    break;
                case 'devops':
                    $scores['DevOps'] = 5;
                    $scores['Docker'] = 5;
                    $scores['Kubernetes'] = 5;
                    $scores['Cloud'] = 4;
                    $scores['Contenedores'] = 4;
                    break;
                case 'fullstack':
                default:
                    $scores['Fullstack'] = 5;
                    $scores['Frontend'] = 3;
                    $scores['Backend'] = 3;
                    $scores['APIs'] = 2;
                    $scores['Database'] = 2;
                    $scores['SQL'] = 2;
                    break;
            }
        }
        return $scores;
    }

    /**
     * Score courses based on tag affinities, user level, and explicit technology track choices.
     */
    protected function scoreCourses(EloquentCollection $courses, array $tagScores, string $userLevel, array $experienceTechs = []): array
    {
        $scored = [];

        // Determine excluded tags from unselected alternatives in tracks where user made an explicit choice
        $excludedTags = [];
        foreach (self::TECH_TRACKS as $track) {
            $selectedKeys = array_intersect(array_keys($track), $experienceTechs);
            if (!empty($selectedKeys)) {
                foreach ($track as $key => $tags) {
                    if (!in_array($key, $selectedKeys, true)) {
                        $excludedTags = array_merge($excludedTags, $tags);
                    }
                }
            }
        }

        foreach ($courses as $course) {
            $tagNames = $course->tags->pluck('name')->toArray();

            // If user explicitly chose a competing framework/stack track and this course belongs to an unselected rival, exclude it
            if (!empty($excludedTags) && !empty(array_intersect($tagNames, $excludedTags))) {
                $scored[] = [
                    'course' => $course,
                    'total_score' => -100,
                    'affinity_score' => 0,
                    'matched_tags' => [],
                    'level' => $course->level,
                ];
                continue;
            }

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

            // Only apply positive level modifier if course has positive affinity with the user's selected preferences
            if ($affinityScore > 0) {
                $levelModifier = match ($userLevel) {
                    'beginner' => match ($course->level) {
                        'beginner' => 12,
                        'intermediate' => 5,
                        'advanced' => -10,
                        default => 0,
                    },
                    'intermediate' => match ($course->level) {
                        'intermediate' => 12,
                        'advanced' => 6,
                        'beginner' => 3,
                        default => 0,
                    },
                    'advanced' => match ($course->level) {
                        'advanced' => 15,
                        'intermediate' => 6,
                        'beginner' => -15,
                        default => 0,
                    },
                    default => 0,
                };

                $totalScore = $affinityScore + $levelModifier;
            } else {
                $totalScore = $affinityScore;
            }

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
    protected function selectTopCourses(array $scoredCourses, string $userLevel, array $interestAreas = []): array
    {
        // Filter courses with positive affinity and score
        $qualified = array_values(array_filter($scoredCourses, fn($item) => $item['total_score'] > 0 && $item['affinity_score'] > 0));

        // If fewer than 3 qualified courses, fallback to top scored courses in catalog
        if (count($qualified) < 3) {
            return array_slice($scoredCourses, 0, min(3, count($scoredCourses)));
        }

        // If multiple interest areas are selected, ensure representation from each area
        $validAreas = array_values(array_intersect($interestAreas, array_keys(self::AREA_TAG_MAP)));
        if (count($validAreas) > 1) {
            $selected = [];
            $selectedIds = [];

            // 1. Pick at least the top matching course for each selected area
            foreach ($validAreas as $area) {
                $areaTags = self::AREA_TAG_MAP[$area] ?? [];
                foreach ($qualified as $item) {
                    $courseId = $item['course']->id;
                    if (in_array($courseId, $selectedIds, true)) {
                        continue;
                    }

                    $courseTags = $item['course']->tags->pluck('name')->toArray();
                    if (!empty(array_intersect($courseTags, $areaTags))) {
                        $selected[] = $item;
                        $selectedIds[] = $courseId;
                        break;
                    }
                }
            }

            // 2. Pick a second course for each area if available and space allows (up to 6)
            if (count($selected) < 6) {
                foreach ($validAreas as $area) {
                    if (count($selected) >= 6) {
                        break;
                    }
                    $areaTags = self::AREA_TAG_MAP[$area] ?? [];
                    foreach ($qualified as $item) {
                        $courseId = $item['course']->id;
                        if (in_array($courseId, $selectedIds, true)) {
                            continue;
                        }

                        $courseTags = $item['course']->tags->pluck('name')->toArray();
                        if (!empty(array_intersect($courseTags, $areaTags))) {
                            $selected[] = $item;
                            $selectedIds[] = $courseId;
                            break;
                        }
                    }
                }
            }

            // 3. Fill remaining slots up to 6 with the highest scoring remaining qualified courses
            foreach ($qualified as $item) {
                if (count($selected) >= 6) {
                    break;
                }
                $courseId = $item['course']->id;
                if (!in_array($courseId, $selectedIds, true)) {
                    $selected[] = $item;
                    $selectedIds[] = $courseId;
                }
            }

            return $selected;
        }

        // Single area or fullstack: take top 6 qualified courses
        return array_slice($qualified, 0, 6);
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

        // If the course is a framework/application course, it should not be ranked as a pure foundation
        $isFramework = false;
        foreach ($tags as $tag) {
            if (in_array($tag, self::FRAMEWORK_TAGS, true)) {
                $isFramework = true;
                break;
            }
        }

        if (!$isFramework) {
            foreach ($tags as $tag) {
                if (in_array($tag, self::FOUNDATION_TAGS, true)) {
                    return 1;
                }
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
        $areaLabels = array_map(fn($a) => self::AREA_LABELS[$a] ?? ucfirst($a), $interestAreas);

        if (count($areaLabels) === 0) {
            $areasText = 'Desarrollo de Software';
        } elseif (count($areaLabels) === 1) {
            $areasText = $areaLabels[0];
        } elseif (count($areaLabels) === 2) {
            $areasText = "{$areaLabels[0]} & {$areaLabels[1]}";
        } else {
            $lastArea = array_pop($areaLabels);
            $areasText = implode(', ', $areaLabels) . " y {$lastArea}";
        }

        return match ($userLevel) {
            'beginner' => "Ruta Fundacional: {$areasText}",
            'advanced' => "Ruta Avanzada y Especialización: {$areasText}",
            default => "Ruta Profesional: {$areasText}",
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
