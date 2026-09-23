<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseProgress extends Model
{
    use HasFactory;

    protected $table = 'course_progress';

    protected $fillable = [
        'user_id',
        'course_id',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * The user associated with this course progress.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The course associated with this progress.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
