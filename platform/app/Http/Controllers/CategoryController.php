<?php
namespace App\Http\Controllers;
use App\Models\Category;
use App\Services\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
class CategoryController extends Controller {
    public function index() { return view('workspace.categories',['categories'=>Category::orderBy('name')->paginate(30)]); }
    public function store(Request $request) {
        $data=$request->validate(['name'=>'required|string|max:100','slug'=>'required|alpha_dash:ascii|max:120|unique:categories']);
        DB::transaction(function () use ($data) { $category=Category::create($data); app(AuditTrail::class)->record('category.created',$category,array_keys($data)); });
        return back()->with('status','Category created.');
    }
    public function update(Request $request, Category $category) {
        $data=$request->validate(['name'=>'required|string|max:100','slug'=>['required','alpha_dash:ascii','max:120',Rule::unique('categories')->ignore($category)]]);
        DB::transaction(function () use ($data,$category) { $category->update($data); $fields=array_keys(collect($category->getChanges())->except('updated_at')->all()); if ($fields) app(AuditTrail::class)->record('category.updated',$category,$fields); });
        return back()->with('status','Category updated.');
    }
    public function destroy(Category $category) {
        abort_if($category->products()->exists(),422,'Move products to another category before deleting this one.');
        DB::transaction(function () use ($category) { $category->delete(); app(AuditTrail::class)->record('category.deleted',$category); });
        return back()->with('status','Category deleted.');
    }
}
