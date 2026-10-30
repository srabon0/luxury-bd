<?php
namespace App\Http\Controllers;
use App\Http\Requests\SaveProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogImage;
use App\Services\AuditTrail;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller {
    public function create() { return view('workspace.product',['product'=>new Product,'categories'=>Category::orderBy('name')->get()]); }
    public function edit(Product $product) { $product->load('internalPrice'); return view('workspace.product',['product'=>$product,'categories'=>Category::orderBy('name')->get()]); }
    public function store(SaveProductRequest $request, CatalogImage $images) { return $this->save($request,new Product,$images); }
    public function update(SaveProductRequest $request, Product $product, CatalogImage $images) { return $this->save($request,$product,$images); }
    private function save(SaveProductRequest $request, Product $product, CatalogImage $images) {
        $data=$request->validated(); $existing=$product->exists; $old=[$product->image_path,$product->thumbnail_path];
        $new=$request->hasFile('image') ? $images->store($request->file('image')) : [];
        try { DB::transaction(function () use ($product,$data,$new,$existing) { $product->fill(collect($data)->except(['price','image'])->all()); $product->fill($new); $product->save(); $price=$product->internalPrice()->updateOrCreate([],['amount'=>$data['price'],'currency'=>'BDT']);
            $fields=array_keys(collect($existing ? $product->getChanges() : $product->getAttributes())->except(['created_at','updated_at'])->all());
            if ($price->wasRecentlyCreated || $price->wasChanged('amount')) $fields[]='internal_price';
            if (!$existing || $fields) app(AuditTrail::class)->record($existing ? 'product.updated' : 'product.created',$product,$fields); }); }
        catch (\Throwable $e) { $images->delete($new); throw $e; }
        if ($new) $images->delete($old);
        return redirect()->route('workspace.index')->with('status','Product saved.');
    }
    public function destroy(Product $product, CatalogImage $images) { $old=[$product->image_path,$product->thumbnail_path]; DB::transaction(function () use ($product) { $product->delete(); app(AuditTrail::class)->record('product.deleted',$product); }); $images->delete($old); return redirect()->route('workspace.index')->with('status','Product deleted.'); }
}
