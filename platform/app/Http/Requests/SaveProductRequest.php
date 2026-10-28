<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class SaveProductRequest extends FormRequest {
    public function authorize(): bool { return $this->user()?->can('manage-catalog') ?? false; }
    public function rules(): array { return [
        'name'=>'required|string|max:160','code'=>['required','string','max:60',Rule::unique('products')->ignore($this->route('product'))],
        'slug'=>['required','alpha_dash:ascii','max:180',Rule::unique('products')->ignore($this->route('product'))],
        'category_id'=>'required|exists:categories,id','description'=>'nullable|string|max:10000','finish'=>'nullable|string|max:120','dimensions'=>'nullable|string|max:160','material'=>'nullable|string|max:160',
        'status'=>'required|in:draft,published','price'=>'required|numeric|min:0|max:9999999999.99|decimal:0,2',
        'image'=>'nullable|image|mimes:jpg,jpeg,png,webp|max:4096|dimensions:max_width=3000,max_height=3000',
    ]; }
}
