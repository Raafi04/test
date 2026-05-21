<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TimelineTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_timelines_requires_authentication(): void
    {
        $this->getJson('/api/timelines')->assertStatus(401);
    }

    public function test_create_timeline_validates_input(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/timelines', [
            'title' => '',
            'description' => '',
            'year' => 1800,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'year']);
    }

    public function test_create_update_and_delete_timeline(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $created = $this->postJson('/api/timelines', [
            'title' => 'Internship',
            'description' => '6-month internship',
            'year' => 2025,
        ])->assertStatus(201)->json();

        $this->putJson('/api/timelines/'.$created['id'], [
            'title' => 'Internship Updated',
            'description' => 'Updated description',
            'year' => 2026,
        ])->assertOk()->assertJson([
            'title' => 'Internship Updated',
            'year' => 2026,
        ]);

        $this->deleteJson('/api/timelines/'.$created['id'])
            ->assertOk()
            ->assertJson(['message' => 'Deleted']);
    }
}
