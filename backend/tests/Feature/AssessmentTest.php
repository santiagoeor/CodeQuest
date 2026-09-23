<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_can_list_all_assessment_questions(): void
    {
        $response = $this->getJson('/api/assessment/questions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'count',
                'data' => [
                    '*' => [
                        'id',
                        'text',
                        'category',
                        'type',
                        'order',
                        'options' => [
                            '*' => [
                                'id',
                                'question_id',
                                'text',
                                'value',
                                'weight',
                                'order',
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_questions_include_options_with_weights(): void
    {
        $response = $this->getJson('/api/assessment/questions');

        $response->assertStatus(200);

        $data = $response->json('data');

        foreach ($data as $question) {
            $this->assertNotEmpty($question['options'], "Question '{$question['text']}' has no options");

            foreach ($question['options'] as $option) {
                $this->assertArrayHasKey('value', $option, "Option missing 'value' field");
                $this->assertArrayHasKey('weight', $option, "Option missing 'weight' field");
            }
        }
    }

    public function test_questions_are_ordered(): void
    {
        $response = $this->getJson('/api/assessment/questions');

        $response->assertStatus(200);

        $data = $response->json('data');
        $orders = array_column($data, 'order');

        $sorted = $orders;
        sort($sorted);

        $this->assertEquals($sorted, $orders,
            'Questions are not returned in ascending order');
    }
}
