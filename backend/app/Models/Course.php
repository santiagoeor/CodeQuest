<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'level',
        'url',
        'duration',
        'image_url',
    ];

    /**
     * The tags associated with this course.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Learning paths that include this course.
     */
    public function learningPaths(): BelongsToMany
    {
        return $this->belongsToMany(LearningPath::class, 'learning_path_course')
            ->withPivot('order', 'status')
            ->withTimestamps();
    }

    /**
     * User progress entries for this course.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }
}
