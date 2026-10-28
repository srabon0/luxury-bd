<?php
namespace App\Http\Controllers;
use App\Http\Requests\SaveProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogImage;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller {
    public function create() { return view('workspace.product',['product'=>new Product,'categories'=>Category::orderBy('name')->get()]); }
    public function edit(Product $product) { $product->load('internalPrice'); return view('workspace.product',['product'=>$product,'categories'=>Category::orderBy('name')->get()]); }
    public function store(SaveProductRequest $request, CatalogImage $images) { return $this->save($request,new Product,$images); }
    public function update(SaveProductRequest $request, Product $product, CatalogImage $images) { return $this->save($request,$product,$images); }
    private function save(SaveProductRequest $request, Product $product, CatalogImage $images) {
        $data=$request->validated(); $old=[$product->image_path,$product->thumbnail_path];
        $new=$request->hasFile('image') ? $images->store($request->file('image')) : [];
        try { DB::transaction(function () use ($product,$data,$new) { $product->fill(collect($data)->except(['price','image'])->all()); $product->fill($new); $product->save(); $product->internalPrice()->updateOrCreate([],['amount'=>$data['price'],'currency'=>'BDT']); }); }
        catch (\Throwable $e) { $images->delete($new); throw $e; }
        if ($new) $images->delete($old);
        return redirect()->route('workspace.index')->with('status','Product saved.');
    }
    public function destroy(Product $product, CatalogImage $images) { $old=[$product->image_path,$product->thumbnail_path]; $product->delete(); $images->delete($old); return redirect()->route('workspace.index')->with('status','Product deleted.'); }
}
