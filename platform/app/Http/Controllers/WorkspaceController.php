<?php
namespace App\Http\Controllers;
use App\Models\Product;
class WorkspaceController extends Controller {
    public function index() { return view('workspace.index',['products'=>Product::with(['category','internalPrice'])->latest('id')->paginate(20)]); }
    public function prices() { return response()->json(['data'=>Product::with('internalPrice')->latest('id')->paginate(30)->through(fn($p)=>['id'=>$p->id,'name'=>$p->name,'price'=>$p->internalPrice?->amount,'currency'=>$p->internalPrice?->currency])])->header('Cache-Control','private, no-store'); }
}
