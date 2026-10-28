<?php
use App\Http\Controllers\{AuditController,CatalogController,CategoryController,ContactController,ProductController,SessionController,StaffController,WorkspaceController};
use App\Http\Middleware\ActiveStaff;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
Route::get('/', fn()=>view('catalog.home',['products'=>Product::where('status','published')->with('category')->latest('id')->limit(4)->get()]))->name('home');
Route::get('/compare',[CatalogController::class,'compare'])->middleware('throttle:catalog')->name('catalog.compare');
Route::get('/products',[CatalogController::class,'index'])->name('catalog.index');
Route::get('/products/{product:slug}',[CatalogController::class,'show'])->name('catalog.show');
Route::get('/api/products',[CatalogController::class,'index'])->middleware('throttle:catalog');
Route::get('/api/products/{product:slug}',[CatalogController::class,'show'])->middleware('throttle:catalog');
Route::get('/contact',[ContactController::class,'create'])->name('contact');
Route::post('/contact',[ContactController::class,'store'])->middleware('throttle:contact')->name('contact.send');
Route::middleware('guest')->group(function () {
    Route::get('/staff/login',[SessionController::class,'create'])->name('login');
    Route::post('/staff/login',[SessionController::class,'store'])->middleware('throttle:staff-login')->name('login.store');
});
Route::middleware(['auth',ActiveStaff::class])->group(function () {
    Route::post('/staff/logout',[SessionController::class,'destroy'])->name('logout');
    Route::prefix('workspace')->name('workspace.')->group(function () {
        Route::get('/',[WorkspaceController::class,'index'])->middleware('can:view-prices')->name('index');
        Route::get('/activity',[AuditController::class,'index'])->middleware('can:view-audit')->name('audit');
        Route::get('/prices',[WorkspaceController::class,'prices'])->middleware('can:view-prices')->name('prices');
        Route::middleware('can:manage-catalog')->group(function () {
            Route::resource('products',ProductController::class)->except(['index','show']);
            Route::resource('categories',CategoryController::class)->only(['index','store','update','destroy']);
        });
        Route::middleware('can:manage-users')->group(function () {
            Route::get('/users',[StaffController::class,'index'])->name('users.index');
            Route::post('/users',[StaffController::class,'store'])->name('users.store');
            Route::patch('/users/{user}',[StaffController::class,'update'])->name('users.update');
        });
    });
});
