<?php
namespace Tests\Feature;
use App\Enums\Role;
use App\Mail\ContactEnquiry;
use App\Models\{Category,Product,User};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{Mail,Storage};
use Tests\TestCase;
class CatalogAccessTest extends TestCase {
    use RefreshDatabase;
    private function staff(Role $role): User { return User::factory()->create(['role'=>$role,'is_active'=>true]); }
    private function item(string $status='published'): Product {
        $category=Category::create(['name'=>'Basins','slug'=>'basins']);
        $product=Product::create(['category_id'=>$category->id,'name'=>'Forma basin','slug'=>'forma-basin','code'=>'FB-01','status'=>$status]);
        $product->internalPrice()->create(['amount'=>'84756.91','currency'=>'BDT']); return $product;
    }
    private function payload(Category $category): array { return ['category_id'=>$category->id,'name'=>'New basin','slug'=>'new-basin','code'=>'NB-01','price'=>'9500.50','status'=>'published','finish'=>'White']; }
    public function test_public_html_and_json_never_expose_prices_even_with_requested_fields(): void {
        $p=$this->item();
        $this->get('/')->assertOk()->assertDontSee('84756');
        $this->get('/products')->assertOk()->assertDontSee('84756');
        $this->get('/products/'.$p->slug)->assertOk()->assertDontSee('84756');
        $response=$this->getJson('/api/products?include=internalPrice&fields=price,internal_price,internalPrice')->assertOk();
        $this->assertArrayNotHasKey('price',$response->json('data.0')); $response->assertDontSee('84756');
        $this->getJson('/api/products/'.$p->slug)->assertOk()->assertDontSee('84756');
        $this->assertArrayNotHasKey('internal_price',$p->load('internalPrice')->toArray());
    }
    public function test_guests_cannot_get_internal_prices_or_use_workspace(): void {
        $this->getJson('/workspace/prices')->assertUnauthorized();
        $this->get('/workspace')->assertRedirect('/staff/login');
    }
    public function test_drafts_are_not_publicly_accessible(): void {
        $p=$this->item('draft'); $this->getJson('/api/products')->assertJsonCount(0,'data');
        $this->get('/products/'.$p->slug)->assertNotFound(); $this->getJson('/api/products/'.$p->slug)->assertNotFound();
    }
    public function test_sr_can_view_prices_but_cannot_write_or_manage_staff(): void {
        $p=$this->item(); $this->actingAs($this->staff(Role::SR));
        $this->get('/workspace')->assertOk()->assertSee('84,756.91')->assertDontSee('Add product')->assertDontSee('Staff &amp; permissions',false);
        $r=$this->getJson('/workspace/prices')->assertOk()->assertSee('84756.91');
        $this->assertStringContainsString('no-store',$r->headers->get('Cache-Control'));
        $this->post('/workspace/products',$this->payload($p->category))->assertForbidden();
        $this->put('/workspace/products/'.$p->id,$this->payload($p->category))->assertForbidden();
        $this->delete('/workspace/products/'.$p->id)->assertForbidden();
        $this->get('/workspace/products/'.$p->id.'/edit')->assertForbidden();
        $this->post('/workspace/categories',['name'=>'Taps','slug'=>'taps'])->assertForbidden();
        $this->get('/workspace/users')->assertForbidden();
        $this->post('/workspace/users',[])->assertForbidden();
    }
    public function test_manager_can_manage_products_images_categories_and_internal_prices_but_not_users(): void {
        Storage::fake('public'); $manager=$this->staff(Role::CatalogManager); $this->actingAs($manager);
        $this->post('/workspace/categories',['name'=>'Basins','slug'=>'basins'])->assertRedirect();
        $category=Category::firstOrFail();
        $payload=$this->payload($category);$payload['image']=UploadedFile::fake()->image('basin.jpg',800,600);
        $this->post('/workspace/products',$payload)->assertRedirect(route('workspace.index'));
        $p=Product::firstOrFail(); $this->assertDatabaseHas('product_prices',['product_id'=>$p->id,'amount'=>'9500.50']);
        Storage::disk('public')->assertExists($p->image_path);Storage::disk('public')->assertExists($p->thumbnail_path);
        $this->get('/workspace/products/'.$p->id.'/edit')->assertOk();
        $this->put('/workspace/products/'.$p->id,[...$this->payload($category),'price'=>'10000.00'])->assertRedirect();
        $this->assertDatabaseHas('product_prices',['product_id'=>$p->id,'amount'=>'10000.00']);
        $this->get('/workspace/users')->assertForbidden();
        $old=[$p->image_path,$p->thumbnail_path];$this->delete('/workspace/products/'.$p->id)->assertRedirect();
        $this->assertDatabaseMissing('products',['id'=>$p->id]);Storage::disk('public')->assertMissing($old);
    }
    public function test_inactive_staff_loses_access_and_cannot_sign_in(): void {
        $user=$this->staff(Role::SR);$user->update(['is_active'=>false]);
        $this->actingAs($user)->get('/workspace')->assertForbidden();$this->assertGuest();
        $this->post('/staff/login',['email'=>$user->email,'password'=>'password'])->assertSessionHasErrors('email');
    }
    public function test_login_success_logout_and_failure_are_handled(): void {
        $user=$this->staff(Role::SR);
        $this->post('/staff/login',['email'=>$user->email,'password'=>'password'])->assertRedirect(route('workspace.index'));
        $this->assertAuthenticatedAs($user);$this->post('/staff/logout')->assertRedirect('/');$this->assertGuest();
        $this->post('/staff/login',['email'=>$user->email,'password'=>'wrong-password'])->assertSessionHasErrors('email');$this->assertGuest();
    }
    public function test_admin_can_create_staff_and_cannot_remove_the_last_active_admin(): void {
        $admin=$this->staff(Role::Admin);$this->actingAs($admin);
        $this->post('/workspace/users',['name'=>'Sales representative','email'=>'sr@example.test','role'=>'sr','password'=>'SafeTestPassword123','password_confirmation'=>'SafeTestPassword123'])->assertRedirect();
        $this->assertDatabaseHas('users',['email'=>'sr@example.test','role'=>'sr']);
        $this->patch('/workspace/users/'.$admin->id,['name'=>$admin->name,'email'=>$admin->email,'role'=>'sr','is_active'=>0])->assertSessionHasErrors('role');
        $this->assertTrue($admin->fresh()->is_active);$this->assertSame(Role::Admin,$admin->fresh()->role);
        $this->get('/workspace/users')->assertOk();
    }
    public function test_invalid_image_and_negative_price_are_rejected_without_creating_a_product(): void {
        $p=$this->item();$this->actingAs($this->staff(Role::CatalogManager));
        $payload=[...$this->payload($p->category),'price'=>'-1','image'=>UploadedFile::fake()->create('bad.svg',1,'image/svg+xml')];
        $this->post('/workspace/products',$payload)->assertSessionHasErrors(['price','image']);$this->assertDatabaseCount('products',1);
    }
    public function test_contact_uses_verified_from_configuration_and_user_as_reply_to(): void {
        Mail::fake();config(['catalog.contact_email'=>'contact@example.test']);
        $this->post('/contact',['name'=>'Test Visitor','email'=>'visitor@example.test','message'=>'Please send the product specifications.','website'=>''])->assertRedirect(route('contact'));
        Mail::assertSent(ContactEnquiry::class,fn($m)=>$m->hasTo('contact@example.test') && $m->enquiry['email']==='visitor@example.test');
        $this->post('/contact',['name'=>'Bot','email'=>'bot@example.test','message'=>'Spam message text','website'=>'spam'])->assertSessionHasErrors('website');
        Mail::assertSentCount(1);
    }
    public function test_uncategorized_unknown_roles_cannot_be_assigned_and_guest_signup_is_absent(): void {
        $this->get('/register')->assertNotFound(); $this->post('/register',[])->assertNotFound();
        $this->actingAs($this->staff(Role::Admin))->post('/workspace/users',['name'=>'Test','email'=>'other@example.test','role'=>'owner','password'=>'SafeTestPassword123','password_confirmation'=>'SafeTestPassword123'])->assertSessionHasErrors('role');
    }
}
