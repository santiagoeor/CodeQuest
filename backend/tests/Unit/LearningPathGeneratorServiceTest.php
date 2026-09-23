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
}
