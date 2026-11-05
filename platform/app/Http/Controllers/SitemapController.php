<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\SearchMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SitemapController extends Controller {
    public function __invoke(Request $request, SearchMetadata $seo) {
        abort_unless($seo->liveHost($request), 404);
        $entries = [
            ['loc'=>$seo->url('home')],
            ['loc'=>$seo->url('catalog.index')],
            ['loc'=>$seo->url('contact')],
        ];
        $count = Product::where('status','published')->count();
        for ($page=2; $page <= min(10000, (int) ceil($count / 12)); $page++) {
            $entries[] = ['loc'=>$seo->url('catalog.index',['page'=>$page])];
        }
        $categories = Category::withCount(['products as public_count'=>fn($q)=>$q->where('status','published')])
            ->whereHas('products',fn($q)=>$q->where('status','published'))->get();
        foreach ($categories as $category) {
            $entries[] = ['loc'=>$seo->url('catalog.category',['category'=>$category->slug])];
            for ($page=2; $page <= min(10000, (int) ceil($category->public_count / 12)); $page++) {
                $entries[] = ['loc'=>$seo->url('catalog.category',['category'=>$category->slug,'page'=>$page])];
            }
        }
        foreach (Product::where('status','published')->select(['slug','image_path','updated_at'])->orderBy('id')->limit(45000)->cursor() as $product) {
            $entry = ['loc'=>$seo->url('catalog.show',['product'=>$product->slug])];
            if ($product->updated_at) { $entry['lastmod'] = $product->updated_at->toAtomString(); }
            if ($product->image_path) { $entry['image'] = Storage::disk('public')->url($product->image_path); }
            $entries[] = $entry;
        }
        return response()->view('sitemap',['entries'=>$entries])
            ->header('Content-Type','application/xml; charset=UTF-8')
            ->header('Cache-Control','public, max-age=300');
    }
}
