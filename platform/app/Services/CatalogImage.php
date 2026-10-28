<?php
namespace App\Services;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
class CatalogImage {
    public function store(UploadedFile $file): array {
        $source=@imagecreatefromstring($file->get());
        if (!$source) throw new RuntimeException('Unable to process image.');
        $paths=[]; $id=(string) Str::uuid();
        try {
            foreach (['image_path'=>1600,'thumbnail_path'=>480] as $field=>$maximum) {
                $width=imagesx($source); $height=imagesy($source); $ratio=min(1,$maximum/max($width,$height));
                $image=imagecreatetruecolor(max(1,(int)round($width*$ratio)),max(1,(int)round($height*$ratio)));
                $white=imagecolorallocate($image,255,255,255); imagefill($image,0,0,$white);
                imagecopyresampled($image,$source,0,0,0,0,imagesx($image),imagesy($image),$width,$height);
                ob_start(); $ok=imagewebp($image,null,82); $bytes=ob_get_clean(); imagedestroy($image);
                if (!$ok || !$bytes) throw new RuntimeException('Unable to encode image.');
                $path='products/'.$id.'-'.$maximum.'.webp';
                if (!Storage::disk('public')->put($path,$bytes)) throw new RuntimeException('Unable to save image.');
                $paths[$field]=$path;
            }
            return $paths;
        } catch (\Throwable $e) { $this->delete($paths); throw $e; }
        finally { imagedestroy($source); }
    }
    public function delete(array $paths): void { foreach ($paths as $path) if ($path && str_starts_with($path,'products/')) Storage::disk('public')->delete($path); }
}
