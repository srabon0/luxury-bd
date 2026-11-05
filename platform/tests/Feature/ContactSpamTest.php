<?php
namespace Tests\Feature;

use App\Mail\ContactEnquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactSpamTest extends TestCase {
    use RefreshDatabase;
    protected function setUp(): void {
        parent::setUp();
        Cache::flush();
        Mail::fake();
        config(['catalog.contact_email'=>'contact@example.test']);
    }
    private function payload(string $token = ''): array {
        return ['name'=>'A customer','email'=>'customer@example.test','message'=>'Please send specifications for your kitchen taps.','website'=>'','contact_token'=>$token];
    }
    private function token(): string {
        $response = $this->get('/contact')->assertOk();
        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        return $response->viewData('contactToken');
    }
    public function test_direct_posts_and_modified_tokens_do_not_send_mail(): void {
        $this->post('/contact', $this->payload())->assertSessionHasErrors('contact_token');
        $this->token();
        $this->travel(4)->seconds();
        $this->post('/contact', $this->payload(str_repeat('x',64)))->assertSessionHasErrors('message');
        Mail::assertNothingSent();
    }
    public function test_immediate_and_expired_submissions_do_not_send_mail(): void {
        $token = $this->token();
        $this->post('/contact', $this->payload($token))->assertSessionHasErrors('message');
        $this->travel(3)->hours();
        $this->post('/contact', $this->payload($token))->assertSessionHasErrors('message');
        Mail::assertNothingSent();
    }
    public function test_legitimate_enquiry_with_a_link_is_sent_and_token_cannot_be_replayed(): void {
        $token = $this->token();
        $this->travel(4)->seconds();
        $payload = [...$this->payload($token), 'message'=>'Can you supply a tap like https://example.test/tap for my kitchen?'];
        $this->post('/contact', $payload)->assertRedirect(route('contact'));
        $this->post('/contact', $payload)->assertSessionHasErrors('message');
        Mail::assertSentCount(1);
    }
    public function test_same_enquiry_from_a_fresh_form_is_not_emailed_twice(): void {
        $token = $this->token();
        $this->travel(4)->seconds();
        $this->post('/contact', $this->payload($token))->assertRedirect(route('contact'));
        $token = $this->token();
        $this->travel(4)->seconds();
        $this->post('/contact', $this->payload($token))->assertRedirect(route('contact'));
        Mail::assertSentCount(1);
    }
    public function test_email_limit_applies_even_when_the_sender_changes_ip(): void {
        for ($i=1; $i<=3; $i++) {
            $token = $this->token();
            $this->travel(4)->seconds();
            $this->withServerVariables(['REMOTE_ADDR'=>'192.0.2.'.$i])
                ->post('/contact', [...$this->payload($token), 'message'=>'Please send specifications for kitchen tap number '.$i])
                ->assertRedirect(route('contact'));
        }
        $token = $this->token();
        $this->travel(4)->seconds();
        $this->withServerVariables(['REMOTE_ADDR'=>'192.0.2.4'])
            ->post('/contact', $this->payload($token))->assertStatus(429);
        Mail::assertSentCount(3);
    }
    public function test_customer_can_retry_after_a_mail_service_failure(): void {
        Mail::shouldReceive('to')->once()->andThrow(new \RuntimeException('Mail transport unavailable'));
        $token = $this->token();
        $this->travel(4)->seconds();
        $this->from('/contact')->post('/contact', $this->payload($token))->assertSessionHasErrors('message');
        Mail::fake();
        $token = $this->token();
        $this->travel(4)->seconds();
        $this->post('/contact', $this->payload($token))->assertRedirect(route('contact'));
        Mail::assertSent(ContactEnquiry::class);
    }
}
