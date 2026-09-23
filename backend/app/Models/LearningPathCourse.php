<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningPathCourse extends Model
{
    use HasFactory;

    protected $table = 'learning_path_course';

    protected $fillable = [
        'learning_path_id',
        'course_id',
        'order',
        'status',
    ];

    /**
     * The learning path this step belongs to.
     */
    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    /**
     * The course associated with this step.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
