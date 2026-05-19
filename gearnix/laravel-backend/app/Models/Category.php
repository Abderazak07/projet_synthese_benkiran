<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['nom', 'image', 'description', 'is_featured'];

    protected $table = 'categories';

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function getImageAttribute($value)
    {
        if (!$value) return null;
        if (preg_match('/^https?:\/\//', $value)) return $value;
        return url($value);
    }
}
