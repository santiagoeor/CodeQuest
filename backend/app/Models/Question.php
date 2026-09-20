<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'category',
        'type',
        'order',
    ];

    /**
     * The options available for this question.
     */
    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }

    /**
     * Scope to order questions by their display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
