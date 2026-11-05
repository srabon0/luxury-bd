<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class ResponseHeaders {
    public function handle(Request $request, Closure $next) {
        $seo = app(\App\Services\SearchMetadata::class);
        $host = (string) parse_url($seo->origin(), PHP_URL_HOST);
        if ($request->isMethod('GET') && $host && !str_starts_with($host, 'www.') && $request->getHost() === 'www.'.$host) {
            return redirect()->away($seo->origin().$request->getRequestUri(), 301);
        }
        $response=$next($request);
        if (!$seo->indexable($request) || $response->getStatusCode() >= 400) {
            $response->headers->set('X-Robots-Tag','noindex, follow');
        }
        $response->headers->set('X-Content-Type-Options','nosniff');
        $response->headers->set('Referrer-Policy',$request->is('staff*') ? 'no-referrer' : 'strict-origin-when-cross-origin');
        $response->headers->set('X-Frame-Options','SAMEORIGIN');
        if ($request->is('workspace*','staff*')) $response->headers->set('Cache-Control','private, no-store');
        return $response;
    }
}
