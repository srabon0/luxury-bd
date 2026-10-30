<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
class PublicProductResource extends JsonResource {
    public function toArray(Request $request): array {
        return ['id'=>$this->id,'name'=>$this->name,'slug'=>$this->slug,'code'=>$this->code,'description'=>$this->description,'finish'=>$this->finish,'dimensions'=>$this->dimensions,'material'=>$this->material,
            'category'=>['name'=>$this->category->name,'slug'=>$this->category->slug],
            'image_url'=>$this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'thumbnail_url'=>$this->thumbnail_path ? Storage::disk('public')->url($this->thumbnail_path) : null];
    }
}
