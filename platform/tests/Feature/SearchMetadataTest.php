<?php
namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchMetadataTest extends TestCase {
    use RefreshDatabase;
    protected function setUp(): void {
        parent::setUp();
        config(['app.url'=>'https://example.com']);
    }
    private function product(string $status='published', string $name='Kitchen mixer'): Product {
        $category = Category::firstOrCreate(['slug'=>'kitchen-taps'],['name'=>'Kitchen taps']);
        return Product::create(['category_id'=>$category->id,'name'=>$name,'slug'=>$status.'-mixer','code'=>$status.'-KT01','status'=>$status,'description'=>'Chrome tap for everyday kitchen use.','material'=>'Brass','finish'=>'Chrome','image_path'=>'products/example.webp']);
    }
    private function schema(string $html): array {
        preg_match('~<script type="application/ld\\+json">(.*?)</script>~s', $html, $matches);
        return json_decode($matches[1],true,512,JSON_THROW_ON_ERROR)['@graph'];
    }
    public function test_home_has_search_metadata_and_organization_without_invented_reviews(): void {
        $response=$this->get('https://example.com/')->assertOk();
        $response->assertSee('Sanitaryware &amp; Kitchenware in Bangladesh',false)
            ->assertSee('rel="canonical" href="https://example.com/"',false)
            ->assertSee('property="og:title"',false)
            ->assertDontSee('name="keywords"',false);
        $graph=$this->schema($response->getContent());
        $this->assertSame(['Organization','WebSite'],array_column($graph,'@type'));
        $this->assertArrayNotHasKey('address',$graph[0]);
        $this->assertArrayNotHasKey('aggregateRating',$graph[0]);
    }
    public function test_product_has_specific_metadata_and_breadcrumbs_but_no_private_prices(): void {
        $product=$this->product();
        $product->internalPrice()->create(['amount'=>'84756.00','currency'=>'BDT']);
        $response=$this->get('https://example.com/products/'.$product->slug)->assertOk()->assertDontSee('84756');
        $graph=$this->schema($response->getContent());
        $this->assertSame('Product',$graph[0]['@type']);
        $this->assertSame($product->code,$graph[0]['sku']);
        $this->assertSame('BreadcrumbList',$graph[1]['@type']);
        $this->assertStringContainsString('/categories/kitchen-taps',$graph[1]['itemListElement'][1]['item']);
        $this->assertArrayNotHasKey('offers',$graph[0]);
        $this->assertArrayNotHasKey('aggregateRating',$graph[0]);
        $response->assertSee('name="description" content="Kitchen mixer',false);
    }
    public function test_json_ld_escapes_product_text_that_contains_script_tags(): void {
        $product=$this->product('published','Mixer </script><script>alert(1)</script>');
        $response=$this->get('https://example.com/products/'.$product->slug)->assertOk();
        $response->assertDontSee('<script>alert(1)</script>',false);
        $this->assertSame($product->name,$this->schema($response->getContent())[0]['name']);
    }
    public function test_sitemap_contains_published_urls_images_and_active_categories_only(): void {
        $published=$this->product();
        $draft=$this->product('draft');
        Category::create(['slug'=>'empty','name'=>'Empty']);
        $response=$this->get('https://example.com/sitemap.xml')->assertOk()
            ->assertSee('https://example.com/products/'.$published->slug,false)
            ->assertSee('https://example.com/categories/kitchen-taps',false)
            ->assertSee('products/example.webp',false)
            ->assertDontSee($draft->slug)
            ->assertDontSee('/categories/empty',false)
            ->assertDontSee('/staff/',false)
            ->assertDontSee('/workspace/',false);
        $this->assertStringContainsString('application/xml',$response->headers->get('Content-Type'));
        $this->assertNotFalse(simplexml_load_string($response->getContent()));
        $published->update(['status'=>'draft']);
        $this->get('https://example.com/sitemap.xml')->assertOk()->assertDontSee('/products/published-mixer',false)->assertDontSee('/categories/kitchen-taps',false);
    }
    public function test_category_is_linked_and_has_unique_canonical_and_page_two(): void {
        $product=$this->product();
        for($i=0;$i<12;$i++) {
            Product::create(['category_id'=>$product->category_id,'name'=>'Mixer '.$i,'slug'=>'mixer-'.$i,'code'=>'KT'.$i,'status'=>'published']);
        }
        $this->get('https://example.com/products')->assertOk()->assertSee('href="https://example.com/categories/kitchen-taps"',false);
        $this->get('https://example.com/categories/kitchen-taps')->assertOk()->assertSee('Kitchen taps in Bangladesh',false)
            ->assertSee('rel="canonical" href="https://example.com/categories/kitchen-taps"',false);
        $this->get('https://example.com/categories/kitchen-taps?page=2')->assertOk()
            ->assertSee('rel="canonical" href="https://example.com/categories/kitchen-taps?page=2"',false);
        $this->get('https://example.com/products?category=kitchen-taps&sort=name')->assertOk()
            ->assertSee('rel="canonical" href="https://example.com/categories/kitchen-taps"',false);
        $this->get('https://example.com/sitemap.xml')->assertSee('https://example.com/categories/kitchen-taps?page=2',false);
        $this->get('https://example.com/categories/missing')->assertNotFound();
    }
    public function test_search_compare_api_and_staff_pages_have_noindex_headers(): void {
        $this->product();
        foreach(['/products?search=mixer','/compare','/staff/login','/api/products'] as $path) {
            $this->get('https://example.com'.$path)->assertOk()->assertHeader('X-Robots-Tag','noindex, follow');
        }
        $this->get('https://example.com/products')->assertOk()->assertHeaderMissing('X-Robots-Tag');
    }
    public function test_tracking_parameters_are_not_canonical_and_www_redirects_to_configured_origin(): void {
        $this->get('https://example.com/?utm_source=example')->assertOk()
            ->assertSee('rel="canonical" href="https://example.com/"',false);
        $this->get('https://www.example.com/products?page=2')->assertStatus(301)
            ->assertRedirect('https://example.com/products?page=2');
    }
    public function test_staging_is_not_indexable_and_does_not_publish_a_sitemap(): void {
        config(['app.url'=>'https://staging.example.com']);
        $this->get('https://staging.example.com/')->assertOk()->assertHeader('X-Robots-Tag','noindex, follow')
            ->assertSee('content="noindex, follow"',false);
        $this->get('https://staging.example.com/sitemap.xml')->assertNotFound();
    }
}
