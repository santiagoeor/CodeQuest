<?php

namespace Tests\Unit;

use App\Models\Course;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Tag;
use App\Services\LearningPathGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningPathGeneratorServiceTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;
    protected LearningPathGeneratorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new LearningPathGeneratorService();
    }

    public function test_generates_pedagogical_frontend_path_for_beginner(): void
    {
        $result = $this->service->generate([
            'options' => ['beginner', 'frontend', 'first_job'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $this->assertGreaterThanOrEqual(3, count($result['courses']));
        $this->assertLessThanOrEqual(6, count($result['courses']));

        // Check level and titles
        $this->assertEquals('beginner', $result['level']);
        $this->assertStringContainsString('Frontend', $result['title']);
        $this->assertNotEmpty($result['description']);
        $this->assertMatchesRegularExpression('/\d+ horas/', $result['estimated_duration']);

        // Check pedagogical ordering: beginner level courses should appear before intermediate
        $courses = $result['courses'];
        $firstCourse = $courses[0];

        $this->assertEquals('beginner', $firstCourse['level'], 'First course for beginner should be beginner level');

        // Check steps are 1, 2, 3...
        foreach ($courses as $index => $c) {
            $this->assertEquals($index + 1, $c['step']);
            $this->assertNotEmpty($c['reason']);
        }
    }

    public function test_generates_devops_path_with_proper_tags(): void
    {
        $result = $this->service->generate([
            'options' => ['intermediate', 'devops', 'specialize'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $this->assertEquals('intermediate', $result['level']);
        $this->assertStringContainsString('DevOps', $result['title']);

        // Must contain Docker or Kubernetes course
        $titles = array_column($result['courses'], 'title');
        $hasDevOpsCourse = false;
        foreach ($titles as $title) {
            if (str_contains($title, 'Docker') || str_contains($title, 'Kubernetes')) {
                $hasDevOpsCourse = true;
                break;
            }
        }

        $this->assertTrue($hasDevOpsCourse, 'DevOps path should contain Docker or Kubernetes');
    }

    public function test_fallback_generates_valid_path_with_arbitrary_inputs(): void
    {
        $result = $this->service->generate([
            'options' => ['non_existent_option_xyz'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $this->assertGreaterThanOrEqual(3, count($result['courses']));
        $this->assertArrayHasKey('title', $result);
        $this->assertArrayHasKey('estimated_duration', $result);
    }

    public function test_multi_area_selection_backend_and_devops_includes_both_and_excludes_react(): void
    {
        $result = $this->service->generate([
            'options' => ['intermediate', 'backend', 'devops', 'first_job'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $this->assertStringContainsString('Backend', $result['title']);
        $this->assertStringContainsString('DevOps', $result['title']);

        $titles = array_column($result['courses'], 'title');

        // Should include courses from both areas
        $hasBackend = false;
        $hasDevOps = false;
        foreach ($result['courses'] as $course) {
            $tags = $course['tags'] ?? [];
            if (array_intersect($tags, ['Backend', 'Node.js', 'Laravel', 'NestJS', 'Go', 'PHP', 'SQL'])) {
                $hasBackend = true;
            }
            if (array_intersect($tags, ['DevOps', 'Docker', 'Kubernetes', 'Cloud', 'Contenedores'])) {
                $hasDevOps = true;
            }
        }

        $this->assertTrue($hasBackend, 'Should contain courses matching Backend interest');
        $this->assertTrue($hasDevOps, 'Should contain courses matching DevOps interest');

        // Must NOT contain React or Angular when user chose Backend & DevOps
        $this->assertFalse(
            in_array('React: De cero a experto (Hooks y MERN)', $titles, true),
            'Should not recommend React web course for Backend + DevOps'
        );
        $this->assertFalse(
            in_array('Angular: De cero a experto', $titles, true),
            'Should not recommend Angular course for Backend + DevOps'
        );
    }

    public function test_mobile_selection_excludes_react_web_and_angular(): void
    {
        $result = $this->service->generate([
            'options' => ['intermediate', 'mobile', 'specialize'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $this->assertStringContainsString('Mobile', $result['title']);

        $titles = array_column($result['courses'], 'title');

        $this->assertFalse(
            in_array('React: De cero a experto (Hooks y MERN)', $titles, true),
            'Should not recommend React web course when mobile is chosen'
        );
        $this->assertFalse(
            in_array('Angular: De cero a experto', $titles, true),
            'Should not recommend Angular course when mobile is chosen'
        );

        $hasMobileCourse = false;
        foreach ($result['courses'] as $course) {
            $tags = $course['tags'] ?? [];
            if (array_intersect($tags, ['Mobile', 'Flutter', 'Dart', 'SwiftUI', 'Riverpod'])) {
                $hasMobileCourse = true;
                break;
            }
        }
        $this->assertTrue($hasMobileCourse, 'Should contain at least one mobile course');
    }

    public function test_fullstack_with_angular_and_laravel_recommends_angular_and_laravel_and_excludes_react_and_node(): void
    {
        $result = $this->service->generate([
            'options' => ['intermediate', 'fullstack', 'angular', 'php_laravel', 'first_job'],
        ]);

        $this->assertNotEmpty($result['courses']);
        $titles = array_column($result['courses'], 'title');

        // Must recommend Angular and Laravel
        $this->assertTrue(
            in_array('Angular: De cero a experto', $titles, true),
            'Fullstack Angular+Laravel path should contain Angular'
        );
        $this->assertTrue(
            in_array('Laravel: Crea aplicaciones web profesionales con PHP', $titles, true),
            'Fullstack Angular+Laravel path should contain Laravel'
        );

        // Must NOT recommend React or Node
        $this->assertFalse(
            in_array('React: De cero a experto (Hooks y MERN)', $titles, true),
            'Fullstack Angular+Laravel path must not contain React'
        );
        $this->assertFalse(
            in_array('Node: De cero a experto', $titles, true),
            'Fullstack Angular+Laravel path must not contain Node'
        );
    }
}
