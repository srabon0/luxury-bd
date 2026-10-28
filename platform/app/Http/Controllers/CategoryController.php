<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class CategoryController extends Controller {
    public function index() { return view('workspace.categories',['categories'=>Category::orderBy('name')->paginate(30)]); }
    public function store(Request $request) { Category::create($request->validate(['name'=>'required|string|max:100','slug'=>'required|alpha_dash:ascii|max:120|unique:categories'])); return back()->with('status','Category created.'); }
    public function update(Request $request, Category $category) { $category->update($request->validate(['name'=>'required|string|max:100','slug'=>['required','alpha_dash:ascii','max:120',Rule::unique('categories')->ignore($category)]])); return back()->with('status','Category updated.'); }
    public function destroy(Category $category) { abort_if($category->products()->exists(),422,'Move products to another category before deleting this one.'); $category->delete(); return back()->with('status','Category deleted.'); }
}
