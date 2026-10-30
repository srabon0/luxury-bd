<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class ActiveStaff {
    public function handle(Request $request, Closure $next) {
        if (!$request->user()?->is_active) {
            auth()->logout(); $request->session()->invalidate(); $request->session()->regenerateToken();
            abort(403, 'This staff account is inactive.');
        }
        return $next($request);
    }
}
