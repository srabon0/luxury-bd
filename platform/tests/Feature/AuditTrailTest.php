<?php
namespace Tests\Feature;
use App\Enums\Role;
use App\Models\{AuditEntry,Category,Product,User};
use App\Services\AuditTrail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class AuditTrailTest extends TestCase {
    use RefreshDatabase;
    private function staff(Role $role): User { return User::factory()->create(['role'=>$role,'is_active'=>true]); }
    private function payload(Category $category): array { return ['category_id'=>$category->id,'name'=>'Audited basin','slug'=>'audited-basin','code'=>'AUD-01','status'=>'published','price'=>'12345.67','description'=>'Private draft wording']; }
    public function test_product_changes_and_deleted_records_retain_actor_and_field_names_only(): void {
        $manager=$this->staff(Role::CatalogManager); $this->actingAs($manager);
        $category=Category::create(['name'=>'Basins','slug'=>'basins']);
        $this->post('/workspace/products',$this->payload($category))->assertRedirect();
        $product=Product::firstOrFail();
        $this->put('/workspace/products/'.$product->id,[...$this->payload($category),'price'=>'98765.43','status'=>'draft'])->assertRedirect();
        $this->delete('/workspace/products/'.$product->id)->assertRedirect();
        $entries=AuditEntry::orderBy('id')->get();
        $this->assertSame(['product.created','product.updated','product.deleted'],$entries->pluck('event')->all());
        $this->assertSame($manager->id,$entries[0]->actor_id);
        $this->assertSame('catalog_manager',$entries[0]->actor_role);
        $this->assertContains('internal_price',$entries[1]->changed_fields);
        $this->assertContains('status',$entries[1]->changed_fields);
        $this->assertSame($product->id,$entries[2]->subject_id);
        foreach (['12345.67','98765.43','Private draft wording'] as $value) $this->assertStringNotContainsString($value,$entries->toJson());
        $this->assertDatabaseMissing('products',['id'=>$product->id]);
    }
    public function test_only_active_administrators_can_view_or_filter_audit_entries(): void {
        $this->get('/workspace/activity')->assertRedirect('/staff/login');
        foreach ([Role::SR,Role::CatalogManager] as $role) $this->actingAs($this->staff($role))->get('/workspace/activity')->assertForbidden();
        $admin=$this->staff(Role::Admin); $this->actingAs($admin);
        $category=Category::create(['name'=>'Private category record','slug'=>'private-category']);
        app(AuditTrail::class)->record('category.created',$category,['name','slug']);
        $response=$this->get('/workspace/activity?event=category.created')->assertOk()->assertSee('Private category record');
        $this->assertStringContainsString('no-store',$response->headers->get('Cache-Control'));
        $this->get('/workspace/activity?event=staff.updated')->assertOk()->assertDontSee('Private category record');
        $this->getJson('/workspace/activity?event=unknown')->assertUnprocessable();
        $admin->update(['is_active'=>false]); $this->get('/workspace/activity')->assertForbidden();
    }
    public function test_staff_changes_do_not_copy_passwords_hashes_or_email_values(): void {
        $this->actingAs($this->staff(Role::Admin));
        $password='DoNotLogThisPassword123';
        $this->post('/workspace/users',['name'=>'New colleague','email'=>'private-mail@example.test','role'=>'sr','password'=>$password,'password_confirmation'=>$password])->assertRedirect();
        $user=User::where('email','private-mail@example.test')->firstOrFail();
        $this->patch('/workspace/users/'.$user->id,['name'=>'Updated colleague','email'=>$user->email,'role'=>'catalog_manager','is_active'=>true,'password'=>'AnotherSecretPassword123','password_confirmation'=>'AnotherSecretPassword123'])->assertRedirect();
        $entries=AuditEntry::orderBy('id')->get();
        $this->assertSame(['staff.created','staff.updated'],$entries->pluck('event')->all());
        $this->assertContains('role',$entries[1]->changed_fields);
        $this->assertContains('password',$entries[1]->changed_fields);
        foreach ([$password,'AnotherSecretPassword123',$user->password,$user->email] as $value) $this->assertStringNotContainsString($value,$entries->toJson());
        $this->patch('/workspace/users/'.$user->id,['name'=>'Updated colleague','email'=>$user->email,'role'=>'owner','is_active'=>true])->assertSessionHasErrors();
        $this->assertDatabaseCount('audit_entries',2);
    }
    public function test_category_changes_are_logged_and_rejected_writes_are_not(): void {
        $this->actingAs($this->staff(Role::CatalogManager));
        $this->post('/workspace/categories',['name'=>'Showers','slug'=>'showers'])->assertRedirect();
        $category=Category::firstOrFail();
        $this->patch('/workspace/categories/'.$category->id,['name'=>'Shower systems','slug'=>'showers'])->assertRedirect();
        $this->delete('/workspace/categories/'.$category->id)->assertRedirect();
        $this->assertSame(['category.created','category.updated','category.deleted'],AuditEntry::orderBy('id')->pluck('event')->all());
        $this->actingAs($this->staff(Role::SR))->post('/workspace/categories',['name'=>'Forbidden','slug'=>'forbidden'])->assertForbidden();
        $this->assertDatabaseCount('audit_entries',3);
    }
    public function test_audit_failure_rolls_back_a_product_and_its_private_price(): void {
        $this->actingAs($this->staff(Role::CatalogManager));
        $category=Category::create(['name'=>'Basins','slug'=>'basins']);
        $this->mock(AuditTrail::class)->shouldReceive('record')->once()->andThrow(new \RuntimeException('Audit unavailable'));
        $this->post('/workspace/products',$this->payload($category))->assertStatus(500);
        $this->assertDatabaseCount('products',0); $this->assertDatabaseCount('product_prices',0);
    }
    public function test_log_has_no_http_write_routes_and_never_appears_in_public_responses(): void {
        $this->actingAs($this->staff(Role::Admin));
        $category=Category::create(['name'=>'Confidential audit fixture','slug'=>'audit-fixture']);
        $entry=app(AuditTrail::class)->record('category.created',$category,['name']);
        $this->delete('/workspace/activity/'.$entry->id)->assertNotFound();
        $this->patch('/workspace/activity/'.$entry->id,[])->assertNotFound();
        $this->post('/workspace/activity',[])->assertStatus(405);
        $this->get('/')->assertOk()->assertDontSee('Confidential audit fixture');
        $this->getJson('/api/products')->assertOk()->assertDontSee('Confidential audit fixture');
    }
}
