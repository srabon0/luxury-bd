<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
class Product extends Model {
    protected $fillable = ['category_id','name','slug','code','description','finish','dimensions','material','status','image_path','thumbnail_path'];
    // Defense in depth: public serializers must never expose a loaded price relation.
    protected $hidden = ['internalPrice', 'internal_price'];
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function internalPrice(): HasOne { return $this->hasOne(ProductPrice::class); }
}
