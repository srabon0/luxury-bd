<?php
namespace App\Providers;
use App\Enums\Role;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\View;
use App\Services\WebsiteContent;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider {
    public function register(): void { $this->app->scoped(WebsiteContent::class); }
    public function boot(): void {
        ResetPassword::createUrlUsing(fn(User $user,string $token)=>rtrim((string)config('app.url'),'/').route('password.reset',['token'=>$token,'email'=>$user->getEmailForPasswordReset()],false));
        View::composer(['layout','catalog.home','catalog.contact'],fn($view)=>$view->with('siteContent',app(WebsiteContent::class)->publicData()));
        RateLimiter::for('password-recovery',fn(Request $r)=>[Limit::perMinute(10)->by($r->ip()),Limit::perMinutes(15,5)->by(hash('sha256',strtolower((string)$r->input('email')).'|'.$r->ip()))]);
        Gate::define('manage-catalog', fn(User $user) => $user->is_active && $user->role->managesCatalog());
        Gate::define('manage-users', fn(User $user) => $user->is_active && $user->role === Role::Admin);
        Gate::define('view-audit', fn(User $user) => $user->is_active && $user->role === Role::Admin);
        Gate::define('view-prices', fn(User $user) => $user->is_active);
        RateLimiter::for('staff-login', fn(Request $r) => [Limit::perMinute(20)->by($r->ip()), Limit::perMinute(5)->by(hash('sha256',strtolower((string)$r->input('email')).'|'.$r->ip()))]);
        RateLimiter::for('contact', fn(Request $r) => Limit::perMinutes(10,5)->by($r->ip()));
        RateLimiter::for('catalog', fn(Request $r) => Limit::perMinute(120)->by($r->ip()));
    }
}
