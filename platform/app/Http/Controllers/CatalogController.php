<?php
namespace App\Http\Controllers;
use App\Http\Resources\PublicProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
class CatalogController extends Controller {
    public function index(Request $request) {
        $data=$request->validate(['search'=>'nullable|string|max:100','category'=>'nullable|string|max:120','page'=>'nullable|integer|min:1|max:10000','sort'=>'nullable|in:newest,name']);
        $query=Product::query()->where('status','published')->with('category');
        if (!empty($data['category'])) $query->whereHas('category',fn($q)=>$q->where('slug',$data['category']));
        if (!empty($data['search'])) { $term='%'.addcslashes($data['search'],'%_\\').'%'; $query->where(fn($q)=>$q->where('name','like',$term)->orWhere('code','like',$term)); }
        $query->orderBy(($data['sort']??'newest')==='name'?'name':'id',($data['sort']??'newest')==='name'?'asc':'desc');
        $products=$query->paginate(12)->withQueryString();
        if ($request->is('api/*')) return PublicProductResource::collection($products);
        return view('catalog.index',['products'=>$products,'categories'=>Category::orderBy('name')->get()]);
    }
    public function compare(Request $request) {
        $data=$request->validate(['products'=>'sometimes|array|max:3','products.*'=>'required|string|max:160|regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/']);
        $slugs=collect($data['products']??[])->unique()->values();
        $found=Product::query()->where('status','published')->whereIn('slug',$slugs)->with('category')->get()->keyBy('slug');
        $products=$slugs->map(fn($slug)=>$found->get($slug))->filter()->values();
        return view('catalog.compare',['products'=>$products,'unavailable'=>$slugs->count()-$products->count()]);
    }
    public function show(Product $product) { abort_unless($product->status==='published',404); $product->load('category'); return request()->is('api/*') ? new PublicProductResource($product) : view('catalog.show',compact('product')); }
}
