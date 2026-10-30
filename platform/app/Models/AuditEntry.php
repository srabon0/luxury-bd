<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AuditEntry extends Model {
    public const UPDATED_AT = null;
    public const EVENTS = ['product.created','product.updated','product.deleted','category.created','category.updated','category.deleted','staff.created','staff.updated','staff.password_reset','settings.updated'];
    protected $fillable = ['actor_id','actor_name','actor_role','event','subject_type','subject_id','subject_label','changed_fields'];
    protected function casts(): array { return ['changed_fields'=>'array','created_at'=>'datetime']; }
}
