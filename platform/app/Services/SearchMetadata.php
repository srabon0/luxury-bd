<?php
namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SearchMetadata {
    public function origin(): string {
        return rtrim((string) config('app.url'), '/');
    }
    public function url(string $route, array $parameters = []): string {
        return $this->origin().route($route, $parameters, false);
    }
    public function liveHost(Request $request): bool {
        $host = strtolower((string) parse_url($this->origin(), PHP_URL_HOST));
        return $host !== '' && !preg_match('/(^|[.-])(staging|localhost|test)([.-]|$)/i', $host)
            && $request->getHost() === $host;
    }
    public function indexable(Request $request): bool {
        return $this->liveHost($request)
            && $request->routeIs('home', 'catalog.index', 'catalog.category', 'catalog.show', 'contact')
            && !$request->filled('search');
    }
    public function category(Request $request): ?Category {
        $category = $request->route('category');
        if ($category instanceof Category) { return $category; }
        $slug = $request->query('category');
        return is_string($slug) && $slug !== '' ? Category::where('slug', $slug)->first() : null;
    }
    public function forRequest(Request $request): array {
        $title = 'Luxurry | Sanitaryware & Kitchenware in Bangladesh';
        $description = 'Explore sanitaryware and kitchenware from Luxurry, a Classic Group agency in Bangladesh. Browse products, compare specifications and enquire with our team.';
        $canonical = $this->url('home');
        $image = asset('assets/hero-poster.jpg');
        $graph = [];
        if ($request->routeIs('catalog.index', 'catalog.category')) {
            $category = $this->category($request);
            $title = $category ? $category->name.' in Bangladesh | Luxurry' : 'Sanitaryware & Kitchenware Collection | Luxurry Bangladesh';
            $description = $category
                ? 'Explore '.$category->name.' from Luxurry in Bangladesh. Compare product specifications, finishes and materials, and ask our team about your project.'
                : 'Browse the Luxurry sanitaryware and kitchenware collection in Bangladesh. Find products by category, compare specifications and enquire with Classic Group.';
            $route = $category ? 'catalog.category' : 'catalog.index';
            $parameters = $category ? ['category'=>$category->slug] : [];
            $page = (int) $request->query('page', 1);
            if ($page > 1) { $parameters['page'] = $page; $title = 'Page '.$page.' | '.$title; }
            $canonical = $this->url($route, $parameters);
        } elseif ($request->routeIs('catalog.show')) {
            $product = $request->route('product');
            if ($product instanceof Product && $product->status === 'published') {
                $canonical = $this->url('catalog.show', ['product'=>$product->slug]);
                $title = $product->name.' '.$product->code.' | Luxurry Bangladesh';
                $details = collect([$product->category?->name, $product->finish, $product->material, $product->dimensions])
                    ->filter()->implode(', ');
                $description = Str::limit(trim($product->name.' ('.$product->code.'). '.$details.'. '.strip_tags((string) $product->description)), 155);
                if ($product->image_path) { $image = Storage::disk('public')->url($product->image_path); }
                $node = [
                    '@type'=>'Product', '@id'=>$canonical.'#product', 'url'=>$canonical,
                    'name'=>$product->name, 'sku'=>$product->code, 'description'=>$description,
                    'category'=>$product->category?->name,
                ];
                if ($product->image_path) { $node['image'] = [$image]; }
                if ($product->material) { $node['material'] = $product->material; }
                $graph[] = array_filter($node, fn($value)=>$value !== null && $value !== '');
                $graph[] = ['@type'=>'BreadcrumbList', 'itemListElement'=>[
                    ['@type'=>'ListItem','position'=>1,'name'=>'Products','item'=>$this->url('catalog.index')],
                    ['@type'=>'ListItem','position'=>2,'name'=>$product->category->name,'item'=>$this->url('catalog.category',['category'=>$product->category->slug])],
                    ['@type'=>'ListItem','position'=>3,'name'=>$product->name,'item'=>$canonical],
                ]];
            }
        } elseif ($request->routeIs('contact')) {
            $title = 'Contact Luxurry | Sanitaryware & Kitchenware Enquiries';
            $description = 'Contact Luxurry, a Classic Group agency in Bangladesh, for sanitaryware and kitchenware product details, specifications and project enquiries.';
            $canonical = $this->url('contact');
        }
        if ($request->routeIs('home')) {
            $content = app(WebsiteContent::class)->publicData();
            $organization = [
                '@type'=>'Organization', '@id'=>$this->url('home').'#organization',
                'name'=>'Luxurry', 'url'=>$this->url('home'),
                'description'=>$description,
                'parentOrganization'=>['@type'=>'Organization','name'=>'Classic Group'],
            ];
            if (filter_var($content['public_email'], FILTER_VALIDATE_EMAIL)) { $organization['email'] = $content['public_email']; }
            if ($content['phone']) { $organization['telephone'] = $content['phone']; }
            $graph[] = $organization;
            $graph[] = ['@type'=>'WebSite','@id'=>$this->url('home').'#website','name'=>'Luxurry','url'=>$this->url('home'),'publisher'=>['@id'=>$this->url('home').'#organization']];
        }
        $index = $this->indexable($request);
        if (!$request->routeIs('home', 'catalog.index', 'catalog.category', 'catalog.show', 'contact')) {
            $title = 'Luxurry | Classic Group';
        }
        return compact('title','description','canonical','image','graph','index');
    }
}
