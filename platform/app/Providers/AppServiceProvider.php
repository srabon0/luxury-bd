<?php
namespace App\Providers;
use App\Enums\Role;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider {
    public function register(): void {}
    public function boot(): void {
        Gate::define('manage-catalog', fn(User $user) => $user->is_active && $user->role->managesCatalog());
        Gate::define('manage-users', fn(User $user) => $user->is_active && $user->role === Role::Admin);
        Gate::define('view-audit', fn(User $user) => $user->is_active && $user->role === Role::Admin);
        Gate::define('view-prices', fn(User $user) => $user->is_active);
        RateLimiter::for('staff-login', fn(Request $r) => [Limit::perMinute(20)->by($r->ip()), Limit::perMinute(5)->by(hash('sha256',strtolower((string)$r->input('email')).'|'.$r->ip()))]);
        RateLimiter::for('contact', fn(Request $r) => Limit::perMinutes(10,5)->by($r->ip()));
        RateLimiter::for('catalog', fn(Request $r) => Limit::perMinute(120)->by($r->ip()));
    }
}
