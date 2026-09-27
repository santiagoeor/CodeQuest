<?php

namespace App\Http\Requests;

use App\Services\CourseMetadataExtractorService;
use Illuminate\Foundation\Http\FormRequest;

class ExtractCourseMetadataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'url' => [
                'required',
                'string',
                'url',
                'max:500',
                function ($attribute, $value, $fail) {
                    $extractor = app(CourseMetadataExtractorService::class);
                    if (!$extractor->isDomainAllowed($value)) {
                        $fail('El dominio de la URL no está permitido. Solo se aceptan URLs de DevTalles o plataformas asociadas.');
                    }
                },
            ],
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
            'url.required' => 'La URL del curso es obligatoria.',
            'url.url' => 'La URL debe tener un formato válido con protocolo http o https.',
        ];
    }
}
