<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class ResponseHeaders {
    public function handle(Request $request, Closure $next) {
        $response=$next($request);
        $response->headers->set('X-Content-Type-Options','nosniff');
        $response->headers->set('Referrer-Policy',$request->is('staff*') ? 'no-referrer' : 'strict-origin-when-cross-origin');
        $response->headers->set('X-Frame-Options','SAMEORIGIN');
        if ($request->is('workspace*','staff*')) $response->headers->set('Cache-Control','private, no-store');
        return $response;
    }
}
