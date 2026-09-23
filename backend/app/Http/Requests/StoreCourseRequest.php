<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     * Auto-generate slug from title if not explicitly provided.
     */
    protected function prepareForValidation(): void
    {
        if (empty($this->slug) && !empty($this->title)) {
            $this->merge([
                'slug' => Str::slug($this->title),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:courses,slug',
            'description' => 'required|string',
            'level' => 'required|string|in:beginner,intermediate,advanced',
            'url' => 'required|url|max:255',
            'duration' => 'required|string|max:100',
            'image_url' => 'nullable|url|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable',
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título del curso es obligatorio.',
            'slug.required' => 'El slug es obligatorio.',
            'slug.unique' => 'Ya existe un curso con este slug.',
            'description.required' => 'La descripción del curso es obligatoria.',
            'level.required' => 'El nivel del curso es obligatorio.',
            'level.in' => 'El nivel debe ser uno de: beginner, intermediate o advanced.',
            'url.required' => 'La URL del curso es obligatoria.',
            'url.url' => 'La URL debe tener un formato válido (http/https).',
            'duration.required' => 'La duración del curso es obligatoria.',
        ];
    }
}
