<?php
namespace App\Services;
use Illuminate\Support\Facades\{DB,File,Storage};
use Symfony\Component\Process\Process;
class LocalBackup {
    public function create(): string {
        $connection=DB::connection()->getConfig();
        if (($connection['driver']??'')!=='mysql') throw new \RuntimeException('Backups require a MySQL/MariaDB connection.');
        $database=(string)($connection['database']??'');
        if (!preg_match('/^[A-Za-z0-9_][A-Za-z0-9_$-]*$/',$database)) throw new \RuntimeException('Unsupported database name for backup.');
        $directory=(string)config('backup.directory');
        if (!str_starts_with($directory,DIRECTORY_SEPARATOR)) throw new \RuntimeException('Backup directory must be an absolute private path.');
        File::ensureDirectoryExists($directory,0700);
        $directory=realpath($directory);
        $public=realpath(public_path());
        if (config('filesystems.disks.public.driver')!=='local') throw new \RuntimeException('Backups require the local public upload disk.');
        $uploadPath=Storage::disk('public')->path(''); File::ensureDirectoryExists($uploadPath);
        $uploads=realpath($uploadPath);
        foreach (array_filter([$public,$uploads]) as $exposed) {
            if ($directory===$exposed || str_starts_with($directory,$exposed.DIRECTORY_SEPARATOR)) throw new \RuntimeException('Backup directory must not be publicly accessible.');
        }
        if (!$directory || !is_writable($directory)) throw new \RuntimeException('Backup directory is unavailable.');
        $locks=app(CatalogBackupLock::class); $lock=$locks->acquire(true,5);
        if (!$lock) throw new \RuntimeException('Catalog is busy or another backup is running. Retry later.');
        $workspace=$directory.'/.work-'.bin2hex(random_bytes(8));
        $partial=$directory.'/.partial-'.bin2hex(random_bytes(8)).'.tar.gz';
        try {
            File::makeDirectory($workspace,0700);
            $options=$workspace.'/mysql.cnf';
            $values=['user'=>$connection['username']??'','password'=>$connection['password']??''];
            if (!empty($connection['unix_socket'])) $values['socket']=$connection['unix_socket'];
            else { $values['host']=$connection['host']??'127.0.0.1'; $values['port']=$connection['port']??3306; }
            $ini="[client]\n";
            foreach ($values as $key=>$value) $ini.=$key.'="'.strtr((string)$value,["\\"=>"\\\\",'"'=>'\\"',"\n"=>'\\n',"\r"=>'\\r'])."\"\n";
            file_put_contents($options,$ini); chmod($options,0600);
            $sql=$workspace.'/database.sql'; $handle=fopen($sql,'wb'); chmod($sql,0600);
            if (!$handle) throw new \RuntimeException('Unable to create database snapshot.');
            try {
                $dump=new Process([(string)config('backup.mysqldump'),'--defaults-file='.$options,'--single-transaction','--quick','--skip-lock-tables','--no-tablespaces',$database]);
                $dump->disableOutput(); $dump->setTimeout(300);
                $dump->run(function ($type,$buffer) use ($handle) { if ($type===Process::OUT && fwrite($handle,$buffer)!==strlen($buffer)) throw new \RuntimeException('Backup disk write failed.'); });
                fflush($handle); clearstatcache(true,$sql);
                if (!$dump->isSuccessful() || filesize($sql)===0) throw new \RuntimeException('Database backup failed. Check the configured client binary and database permissions.');
            } finally { if (isset($dump) && $dump->isRunning()) $dump->stop(1); fclose($handle); }
            unlink($options);
            file_put_contents($workspace.'/manifest.json',json_encode(['application'=>'Luxurry','created_at'=>now()->toIso8601String(),'contents'=>['database.sql','public uploads'],'uploads_directory'=>basename($uploads),'includes_environment'=>false],JSON_PRETTY_PRINT));
            $tar=new Process([(string)config('backup.tar'),'-czf',$partial,'-C',$workspace,'database.sql','manifest.json','-C',dirname($uploads),basename($uploads)]);
            $tar->disableOutput(); $tar->setTimeout(600); $tar->run();
            if (!$tar->isSuccessful()) throw new \RuntimeException('Upload archive failed; a file may have changed during backup.');
            chmod($partial,0600);
            $verify=new Process([(string)config('backup.tar'),'-tzf',$partial,'database.sql','manifest.json']); $verify->disableOutput(); $verify->setTimeout(120); $verify->run();
            if (!$verify->isSuccessful()) throw new \RuntimeException('Backup archive validation failed.');
            $name='luxurry-backup-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(4)).'.tar.gz';
            $target=$directory.'/'.$name;
            if (!rename($partial,$target)) throw new \RuntimeException('Unable to finalize backup.');
            if (file_put_contents($target.'.sha256',hash_file('sha256',$target).'  '.$name."\n")===false) { unlink($target); throw new \RuntimeException('Unable to write backup checksum.'); } chmod($target.'.sha256',0600);
            $this->rotate($directory,$target);
            return $target;
        } finally {
            if (is_file($partial)) unlink($partial);
            if (is_dir($workspace)) File::deleteDirectory($workspace);
            $locks->release($lock);
        }
    }
    private function rotate(string $directory,string $current): void {
        $cutoff=now()->subDays(max(1,(int)config('backup.keep_days')))->getTimestamp();
        foreach (glob($directory.'/luxurry-backup-*.tar.gz') ?: [] as $file) {
            if ($file===$current || is_link($file) || !preg_match('/^luxurry-backup-[0-9]{8}-[0-9]{6}-[a-f0-9]{8}\.tar\.gz$/',basename($file))) continue;
            if (filemtime($file)<$cutoff) { unlink($file); if (is_file($file.'.sha256') && !is_link($file.'.sha256')) unlink($file.'.sha256'); }
        }
    }
}
