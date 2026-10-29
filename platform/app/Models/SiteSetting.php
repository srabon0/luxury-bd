<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class SiteSetting extends Model {
    protected $fillable=['name','public_data','contact_recipient'];
    protected $hidden=['contact_recipient'];
    protected function casts(): array { return ['public_data'=>'array']; }
}
