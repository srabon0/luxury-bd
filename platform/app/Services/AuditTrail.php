<?php
namespace App\Services;
use App\Models\{AuditEntry,Category,Product,User,SiteSetting};
use Illuminate\Database\Eloquent\Model;
class AuditTrail {
    // Record field names only. Never copy submitted values, prices, passwords or tokens.
    private const FIELDS = ['name','email','password','role','is_active','category_id','slug','code','description','finish','dimensions','material','status','image_path','thumbnail_path','internal_price','homepage','contact_details','contact_recipient'];
    public function record(string $event, Model $subject, array $fields = []): AuditEntry {
        if (!in_array($event,AuditEntry::EVENTS,true)) throw new \InvalidArgumentException('Unknown audit event.');
        $type=match ($subject::class) { Product::class=>'product',Category::class=>'category',User::class=>'staff',SiteSetting::class=>'settings',default=>throw new \InvalidArgumentException('Unsupported audit subject.') };
        if (!str_starts_with($event,$type.'.') || !$subject->getKey()) throw new \InvalidArgumentException('Invalid audit subject.');
        $actor=$event==='staff.password_reset' ? $subject : auth()->user();
        $fields=array_values(array_intersect(self::FIELDS,$fields));
        sort($fields);
        return AuditEntry::create([
            'actor_id'=>$actor?->id,'actor_name'=>$actor?->name ?? 'System / command line',
            'actor_role'=>$actor?->role?->value,'event'=>$event,'subject_type'=>$type,
            'subject_id'=>$subject->getKey(),'subject_label'=>mb_substr((string)$subject->name,0,160),
            'changed_fields'=>$fields,
        ]);
    }
}
