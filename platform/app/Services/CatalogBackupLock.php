<?php
namespace App\Services;
use Illuminate\Support\Facades\File;
class CatalogBackupLock {
    public function acquire(bool $exclusive, int $waitSeconds=0) {
        File::ensureDirectoryExists(storage_path('app/private'),0700);
        $path=storage_path('app/private/catalog-backup.lock');
        if (is_link($path)) throw new \RuntimeException('Invalid catalog lock path.');
        $handle=fopen($path,'c');
        if (!$handle) throw new \RuntimeException('Catalog lock is unavailable.');
        chmod($path,0600);
        $deadline=microtime(true)+$waitSeconds;
        do {
            if (flock($handle,($exclusive ? LOCK_EX : LOCK_SH)|LOCK_NB)) return $handle;
            if (microtime(true)>=$deadline) { fclose($handle); return null; }
            usleep(50000);
        } while (true);
    }
    public function release($handle): void { flock($handle,LOCK_UN); fclose($handle); }
}
