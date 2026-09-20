<?php

namespace Tests\Feature;

use App\Models\QuestionOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecommendationTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_can_generate_recommendation_via_api(): void
    {
        $response = $this->postJson('/api/recommendations/generate', [
            'options' => ['beginner', 'frontend', 'first_job'],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
            ])
            ->assertJsonStructure([
                'status',
                'data' => [
                    'title',
                    'description',
                    'level',
                    'estimated_duration',
                    'total_courses',
                    'target_areas',
                    'courses' => [
                        '*' => [
                            'step',
                            'id',
                            'title',
                            'slug',
                            'description',
                            'level',
                            'duration',
                            'url',
                            'image_url',
                            'tags',
                            'reason',
                        ],
                    ],
                ],
            ]);

        $courses = $response->json('data.courses');
        $this->assertGreaterThanOrEqual(3, count($courses));
        $this->assertLessThanOrEqual(6, count($courses));
    }

    public function test_can_generate_recommendation_using_numeric_option_ids(): void
    {
        $optionIds = QuestionOption::take(3)->pluck('id')->toArray();

        $response = $this->postJson('/api/recommendations/generate', [
            'options' => $optionIds,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok');

        $this->assertNotEmpty($response->json('data.courses'));
    }

    public function test_fails_validation_with_empty_payload(): void
    {
        $response = $this->postJson('/api/recommendations/generate', []);

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error');
    }

    public function test_response_time_is_under_300ms(): void
    {
        $start = microtime(true);

        $response = $this->postJson('/api/recommendations/generate', [
            'options' => ['intermediate', 'backend', 'fullstack'],
        ]);

        $durationMs = (microtime(true) - $start) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(300, $durationMs, "Response time was {$durationMs}ms, expected under 300ms (AC-4)");
    }
}
