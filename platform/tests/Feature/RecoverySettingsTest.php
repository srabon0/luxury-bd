<?php
namespace Tests\Feature;
use App\Enums\Role;
use App\Models\{AuditEntry,SiteSetting,User};
use App\Services\WebsiteContent;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{Hash,Notification,Password};
use Tests\TestCase;
class RecoverySettingsTest extends TestCase {
    use RefreshDatabase;
    private function staff(Role $role=Role::Admin): User { return User::factory()->create(['role'=>$role,'is_active'=>true]); }
    public function test_reset_request_is_generic_active_only_and_uses_trusted_application_url(): void {
        Notification::fake(); config(['app.url'=>'https://catalog.example.test']); $user=$this->staff();
        $active=$this->from('/staff/forgot-password')->withHeader('Host','untrusted.example.test')->post('/staff/forgot-password',['email'=>$user->email])->assertRedirect();
        $message=session('status');
        Notification::assertSentTo($user,ResetPassword::class,function ($notification) use ($user) { $this->assertStringStartsWith('https://catalog.example.test/staff/reset-password/',$notification->toMail($user)->actionUrl); return true; });
        $this->post('/staff/forgot-password',['email'=>'missing@example.test'])->assertSessionHas('status',$message);
        $inactive=$this->staff();$inactive->update(['is_active'=>false]);
        $this->post('/staff/forgot-password',['email'=>$inactive->email])->assertSessionHas('status',$message);
        Notification::assertNotSentTo($inactive,ResetPassword::class);
        $response=$this->get('/staff/forgot-password')->assertOk(); $this->assertStringContainsString('no-store',$response->headers->get('Cache-Control'));
    }
    public function test_reset_is_single_use_strong_audited_and_does_not_sign_user_in(): void {
        $user=$this->staff(Role::SR);$token=Password::createToken($user);
        $data=['email'=>$user->email,'token'=>$token,'password'=>'NewSecurePassword123','password_confirmation'=>'NewSecurePassword123'];
        $this->post('/staff/reset-password',$data)->assertRedirect('/staff/login'); $this->assertGuest();
        $this->assertTrue(Hash::check($data['password'],$user->fresh()->password));
        $entry=AuditEntry::where('event','staff.password_reset')->firstOrFail(); $this->assertSame($user->id,$entry->actor_id);
        $this->assertSame(['password'],$entry->changed_fields);$this->assertStringNotContainsString($token,$entry->toJson());$this->assertStringNotContainsString($data['password'],$entry->toJson());
        $this->post('/staff/reset-password',$data)->assertSessionHasErrors('email');
    }
    public function test_expired_inactive_and_weak_resets_are_rejected(): void {
        $user=$this->staff();$token=Password::createToken($user);
        $data=['email'=>$user->email,'token'=>$token,'password'=>'NewSecurePassword123','password_confirmation'=>'NewSecurePassword123'];
        $this->post('/staff/reset-password',[...$data,'password'=>'short','password_confirmation'=>'short'])->assertSessionHasErrors('password');
        $this->travel(61)->minutes(); $this->post('/staff/reset-password',$data)->assertSessionHasErrors('email');$this->travelBack();
        $token=Password::createToken($user);$user->update(['is_active'=>false]);
        $this->post('/staff/reset-password',[...$data,'token'=>$token])->assertSessionHasErrors('email');$this->assertDatabaseCount('audit_entries',0);
    }
    public function test_admin_updates_render_as_escaped_text_and_recipient_stays_private(): void {
        $this->actingAs($this->staff());
        $data=[...WebsiteContent::DEFAULTS,'hero_heading'=>'A considered home.','hero_description'=>'<script>alert(1)</script>','public_email'=>'hello@example.test','phone'=>'+880 123','address'=>"Example showroom\nDhaka",'contact_recipient'=>'private-destination@example.test'];
        $this->get('/workspace/settings')->assertOk();
        $this->put('/workspace/settings',$data)->assertRedirect();
        $this->get('/')->assertOk()->assertSee('A considered home.')->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;',false)->assertDontSee('<script>alert(1)</script>',false)->assertDontSee($data['contact_recipient']);
        $this->get('/contact')->assertOk()->assertSee('hello@example.test')->assertSee('Example showroom')->assertDontSee($data['contact_recipient']);
        $this->assertSame($data['contact_recipient'],app(WebsiteContent::class)->recipient());
        $this->assertDatabaseHas('audit_entries',['event'=>'settings.updated']);$this->assertStringNotContainsString($data['contact_recipient'],AuditEntry::firstOrFail()->toJson());
        $this->assertArrayNotHasKey('contact_recipient',SiteSetting::findOrFail(1)->toArray());
    }
    public function test_sr_manager_and_guests_cannot_manage_settings_and_invalid_mail_is_rejected(): void {
        $this->get('/workspace/settings')->assertRedirect('/staff/login');
        foreach ([Role::SR,Role::CatalogManager] as $role) { $this->actingAs($this->staff($role))->get('/workspace/settings')->assertForbidden(); $this->put('/workspace/settings',WebsiteContent::DEFAULTS)->assertForbidden(); }
        $this->actingAs($this->staff())->put('/workspace/settings',[...WebsiteContent::DEFAULTS,'contact_recipient'=>"victim@example.test\r\nBcc: other@example.test"])->assertSessionHasErrors('contact_recipient');
        $this->assertDatabaseCount('site_settings',0);
    }
}
