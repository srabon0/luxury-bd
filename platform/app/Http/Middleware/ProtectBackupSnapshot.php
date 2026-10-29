<?php
namespace App\Http\Middleware;
use App\Services\CatalogBackupLock;
use Closure;
use Illuminate\Http\Request;
class ProtectBackupSnapshot {
    public function handle(Request $request,Closure $next) {
        if ($request->isMethodSafe() || !$request->is('workspace*')) return $next($request);
        $locks=app(CatalogBackupLock::class); $lock=$locks->acquire(false);
        abort_unless($lock,503,'Catalog updates are temporarily paused for a backup. Please retry shortly.');
        try { return $next($request); } finally { $locks->release($lock); }
    }
}
