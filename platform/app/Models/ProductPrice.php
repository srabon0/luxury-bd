<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ProductPrice extends Model {
    protected $fillable = ['amount', 'currency'];
    protected function casts(): array { return ['amount'=>'decimal:2']; }
}
