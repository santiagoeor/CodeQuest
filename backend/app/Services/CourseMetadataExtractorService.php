<?php

namespace App\Services;

use App\Models\Tag;
use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class CourseMetadataExtractorService
{
    /**
     * Allowed domain patterns for course extraction.
     */
    protected array $allowedDomains = [
        'devtalles.com',
        'fernando-herrera.com',
        'udemy.com',
        'localhost',
        '127.0.0.1',
    ];

    /**
     * Common technologies for keyword tagging.
     */
    protected array $knownKeywords = [
        'react' => 'React',
        'angular' => 'Angular',
        'vue' => 'Vue.js',
        'laravel' => 'Laravel',
        'php' => 'PHP',
        'typescript' => 'TypeScript',
        'javascript' => 'JavaScript',
        'docker' => 'Docker',
        'flutter' => 'Flutter',
        'dart' => 'Dart',
        'node' => 'Node.js',
        'nestjs' => 'NestJS',
        'nextjs' => 'Next.js',
        'tailwind' => 'Tailwind CSS',
        'python' => 'Python',
        'sql' => 'SQL',
        'mysql' => 'MySQL',
        'postgresql' => 'PostgreSQL',
        'graphql' => 'GraphQL',
        'git' => 'Git',
        'kubernetes' => 'Kubernetes',
        'aws' => 'AWS',
        'c#' => 'C#',
        '.net' => '.NET',
        'clean architecture' => 'Clean Architecture',
        'solid' => 'Principios SOLID',
        'testing' => 'Testing',
        'rxjs' => 'RxJS',
        'pinia' => 'Pinia',
        'redux' => 'Redux',
        'microservicios' => 'Microservicios',
        'golang' => 'Go',
    ];

    /**
     * Validate whether the domain of the URL is permitted.
     */
    public function isDomainAllowed(string $url): bool
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        if (empty($host)) {
            return false;
        }

        foreach ($this->allowedDomains as $allowed) {
            if ($host === $allowed || str_ends_with($host, '.' . $allowed)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extract metadata from the given course URL.
     *
     * @param string $url
     * @return array
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function extract(string $url): array
    {
        $trimmedUrl = trim($url);

        if (!filter_var($trimmedUrl, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('La URL proporcionada no tiene un formato válido.');
        }

        if (!$this->isDomainAllowed($trimmedUrl)) {
            throw new InvalidArgumentException('El dominio de la URL no está permitido. Solo se aceptan URLs de DevTalles o plataformas asociadas.');
        }

        try {
            $response = Http::timeout(5)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (CodeQuest-Extractor/1.0)',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'es-ES,es;q=0.9,en;q=0.8',
                ])
                ->get($trimmedUrl);

            if ($response->successful()) {
                $html = $response->body();
                return $this->parseHtml($html, $trimmedUrl);
            }

            Log::warning('CourseMetadataExtractorService: Non-200 HTTP response', [
                'url' => $trimmedUrl,
                'status' => $response->status(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('CourseMetadataExtractorService: Request failed, attempting fallback', [
                'url' => $trimmedUrl,
                'error' => $e->getMessage(),
            ]);
        }

        // If HTTP fails or is mocked in offline environment, generate structured fallback from URL slug
        return $this->generateFallbackMetadata($trimmedUrl);
    }

    /**
     * Parse HTML and extract Open Graph / Semantic tags.
     */
    public function parseHtml(string $html, string $originalUrl): array
    {
        $previousState = libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        libxml_use_internal_errors($previousState);

        $xpath = new DOMXPath($dom);

        // 1. Title
        $title = $this->queryMeta($xpath, ['og:title', 'twitter:title']);
        if (empty($title)) {
            $titleNode = $xpath->query('//title')->item(0);
            $title = $titleNode ? trim($titleNode->textContent) : '';
        }
        if (empty($title)) {
            $h1 = $xpath->query('//h1')->item(0);
            $title = $h1 ? trim($h1->textContent) : '';
        }
        $title = $this->cleanTitle($title ?: $this->extractSlugFromUrl($originalUrl));

        // 2. Description
        $description = $this->queryMeta($xpath, ['og:description', 'twitter:description', 'description']);
        if (empty($description)) {
            $descNode = $xpath->query('//meta[@name="description"]/@content')->item(0);
            $description = $descNode ? trim($descNode->textContent) : '';
        }
        if (empty($description)) {
            $description = "Aprende y domina {$title} con el contenido oficial de DevTalles.";
        }

        // 3. Image
        $imageUrl = $this->queryMeta($xpath, ['og:image', 'twitter:image']);
        if (!empty($imageUrl) && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $parsedHost = parse_url($originalUrl, PHP_URL_SCHEME) . '://' . parse_url($originalUrl, PHP_URL_HOST);
            $imageUrl = rtrim($parsedHost, '/') . '/' . ltrim($imageUrl, '/');
        }

        // 4. Slug
        $slug = $this->extractSlugFromUrl($originalUrl) ?: Str::slug($title);

        // 5. Inferred Level
        $level = $this->inferLevel($title . ' ' . $description);

        // 6. Inferred Duration
        $duration = $this->inferDuration($html . ' ' . $description);

        // 7. Suggested Tags
        $tags = $this->extractSuggestedTags($title . ' ' . $description . ' ' . $slug);

        return [
            'url' => $originalUrl,
            'title' => $title,
            'slug' => $slug,
            'description' => $description,
            'image_url' => $imageUrl ?: null,
            'level' => $level,
            'duration' => $duration,
            'tags' => $tags,
        ];
    }

    /**
     * Query meta tags by property or name.
     */
    protected function queryMeta(DOMXPath $xpath, array $keys): ?string
    {
        foreach ($keys as $key) {
            $nodes = $xpath->query("//meta[@property='{$key}']/@content | //meta[@name='{$key}']/@content");
            if ($nodes && $nodes->length > 0) {
                $val = trim($nodes->item(0)->textContent);
                if (!empty($val)) {
                    return $val;
                }
            }
        }

        return null;
    }

    /**
     * Clean branding suffixes from title.
     */
    protected function cleanTitle(string $title): string
    {
        $patterns = [
            '/\s*\|\s*DevTalles.*$/i',
            '/\s*-\s*DevTalles.*$/i',
            '/\s*\|\s*Cursos DevTalles.*$/i',
            '/\s*\|\s*Fernando Herrera.*$/i',
            '/\s*-\s*Fernando Herrera.*$/i',
        ];

        return trim(preg_replace($patterns, '', $title));
    }

    /**
     * Extract slug from URL path (e.g. /courses/react-pro -> react-pro).
     */
    protected function extractSlugFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $segments = array_values(array_filter(explode('/', $path)));
        $lastSegment = end($segments);

        if ($lastSegment && $lastSegment !== 'courses' && $lastSegment !== 'curso') {
            return Str::slug(urldecode($lastSegment));
        }

        return '';
    }

    /**
     * Infer course difficulty level.
     */
    protected function inferLevel(string $text): string
    {
        $lower = mb_strtolower($text);

        if (preg_match('/\b(de cero|cero a|principiante|b[aá]sic[oa]|cero|introducci[oó]n|primeros pasos|fundamentos)\b/u', $lower)) {
            return 'beginner';
        }

        if (preg_match('/\b(avanzad[oa]|expert[oa]|pro|master|arquitectura)\b/u', $lower)) {
            return 'advanced';
        }

        return 'intermediate';
    }

    /**
     * Infer course duration.
     */
    protected function inferDuration(string $text): string
    {
        if (preg_match('/(\d{1,3})\s*(?:horas?|hrs?|h)\b/i', $text, $matches)) {
            return $matches[1] . ' horas';
        }

        return '20 horas';
    }

    /**
     * Extract suggested tags from content based on known keywords and existing tags.
     */
    protected function extractSuggestedTags(string $text): array
    {
        $lower = mb_strtolower($text);
        $tags = [];

        foreach ($this->knownKeywords as $keyword => $standardName) {
            if (str_contains($lower, mb_strtolower($keyword))) {
                $tags[] = $standardName;
            }
        }

        // Cross-reference with existing tags in database if table is available
        try {
            $dbTags = Tag::pluck('name', 'slug')->toArray();
            foreach ($dbTags as $slug => $name) {
                if (str_contains($lower, str_replace('-', ' ', $slug)) || str_contains($lower, mb_strtolower($name))) {
                    $tags[] = $name;
                }
            }
        } catch (\Throwable $e) {
            // Ignored if DB table not reachable
        }

        return array_values(array_unique($tags));
    }

    /**
     * Generate fallback metadata derived from URL when offline or external host is unreachable.
     */
    protected function generateFallbackMetadata(string $url): array
    {
        $slug = $this->extractSlugFromUrl($url);
        if (empty($slug)) {
            $slug = 'curso-devtalles';
        }

        $title = ucwords(str_replace('-', ' ', $slug));
        $tags = $this->extractSuggestedTags($slug);

        return [
            'url' => $url,
            'title' => $title,
            'slug' => $slug,
            'description' => "Curso de {$title} en DevTalles. Domina las mejores prácticas y herramientas de desarrollo.",
            'image_url' => 'https://cursos.devtalles.com/assets/default-cover.jpg',
            'level' => $this->inferLevel($slug),
            'duration' => $this->inferDuration($slug),
            'tags' => !empty($tags) ? $tags : ['DevTalles', 'Programación'],
        ];
    }
}
