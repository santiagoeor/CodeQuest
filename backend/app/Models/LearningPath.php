<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningPath extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'level',
        'status',
    ];

    /**
     * User that owns this learning path.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Courses in this learning path, ordered sequentially.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'learning_path_course')
            ->withPivot('order', 'status')
            ->withTimestamps()
            ->orderByPivot('order', 'asc');
    }

    /**
     * Intermediate pivot model records.
     */
    public function pathCourses(): HasMany
    {
        return $this->hasMany(LearningPathCourse::class)->orderBy('order', 'asc');
    }
}
