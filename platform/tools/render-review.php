<?php
// CI-only review snapshots. Fixtures are confined to a disposable in-memory database.
use App\Models\{AuditEntry,Category,Product,User};
use App\Enums\Role;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Artisan,File,View};
require __DIR__.'/../vendor/autoload.php';
$app=require __DIR__.'/../bootstrap/app.php';
$app->make(ConsoleKernel::class)->bootstrap();
if (!app()->environment('testing') || config('database.default') !== 'sqlite' || config('database.connections.sqlite.database') !== ':memory:') {
    throw new RuntimeException('Review rendering only runs with APP_ENV=testing and in-memory SQLite.');
}
Artisan::call('migrate',['--force'=>true]);
$category=Category::create(['name'=>'Basins','slug'=>'basins']);
foreach (['Forma Oval Basin','Linea Countertop Basin','Forma Round Basin','Linea Wall Basin'] as $i=>$name) {
    $product=Product::create(['category_id'=>$category->id,'name'=>$name,'slug'=>Illuminate\Support\Str::slug($name),'code'=>'DEMO-0'.($i+1),'status'=>'published','finish'=>'Gloss white','material'=>'Ceramic','dimensions'=>'580 × 380 × 145 mm','description'=>'Design-review sample only. Replace with verified product information before publication.']);
    $product->internalPrice()->create(['amount'=>'10000.00','currency'=>'BDT']);
}
$root=__DIR__.'/../review';
File::ensureDirectoryExists($root);
File::copyDirectory(public_path('assets'),$root.'/assets');
$kernel=$app->make(Illuminate\Contracts\Http\Kernel::class);
$routes=['index.html'=>'/','products/index.html'=>'/products','product/index.html'=>'/products/forma-oval-basin','contact/index.html'=>'/contact?products[]=forma-oval-basin','compare/index.html'=>'/compare?products[]=forma-oval-basin&products[]=linea-countertop-basin','login/index.html'=>'/staff/login'];
foreach ($routes as $path=>$uri) {
    $request=Request::create('http://localhost'.$uri);
    $response=$kernel->handle($request);
    if ($response->getStatusCode()!==200) throw new RuntimeException('Review route failed: '.$uri.' '.$response->getStatusCode());
    File::ensureDirectoryExists(dirname($root.'/'.$path));
    File::put($root.'/'.$path,$response->getContent());
    $kernel->terminate($request,$response);
}
// Render a fictional workspace for layout review, never an actual user/account export.
$admin=new User(['name'=>'Design review','email'=>'review@example.test','role'=>Role::Admin,'is_active'=>true]);
$admin->id=1;
auth()->setUser($admin);
File::ensureDirectoryExists($root.'/workspace');
File::put($root.'/workspace/index.html',View::make('workspace.index',['products'=>Product::with(['category','internalPrice'])->paginate(20)])->render());
AuditEntry::create(['actor_id'=>null,'actor_name'=>'Design review administrator','actor_role'=>'admin','event'=>'product.updated','subject_type'=>'product','subject_id'=>1,'subject_label'=>'Forma Oval Basin','changed_fields'=>['finish','internal_price']]);
File::ensureDirectoryExists($root.'/activity');
File::put($root.'/activity/index.html',View::make('workspace.audit',['entries'=>AuditEntry::latest('id')->paginate(40),'events'=>AuditEntry::EVENTS])->render());
foreach (File::allFiles($root) as $file) {
    if ($file->getExtension()!=='html') continue;
    $html=str_replace(['http://localhost:8000','http://localhost'],'',File::get($file));
    $html=str_replace('/products/forma-oval-basin','/product/',$html);
    $html=preg_replace('/href="\/products(\?[^\"]*)?"/','href="/products/"',$html);
    $html=preg_replace('/href="\/contact(\?[^\"]*)?"/','href="/contact/"',$html);
    $html=preg_replace('/href="\/compare(\?[^\"]*)?"/','href="/compare/"',$html);
    $html=str_replace('href="/staff/login"','href="/login/"',$html);
    $banner='<div style="padding:12px 5%;background:#fff2cd;color:#504022;font:12px Arial,sans-serif">DESIGN REVIEW · Sample products and fictional staff data. Forms are disabled in this static snapshot.</div>';
    $html=str_replace('href=""','href="/"',$html);
    $html=str_replace('<main id="main">',$banner.'<main id="main">',$html);
    $html=str_replace('<form ','<form onsubmit="event.preventDefault();alert(\'This is a design review. Forms are enabled in the Laravel application.\');" ',$html);
    File::put($file,$html);
}
echo "Rendered public pages and fictional staff workspace/activity views.\n";
