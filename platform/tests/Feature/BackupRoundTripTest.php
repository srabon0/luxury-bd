<?php
namespace Tests\Feature;
use App\Models\{Category,Product};
use App\Services\LocalBackup;
use Illuminate\Foundation\Testing\{DatabaseMigrations,RefreshDatabaseState};
use Illuminate\Support\Facades\{DB,File,Storage};
use Symfony\Component\Process\Process;
use Tests\TestCase;
class BackupRoundTripTest extends TestCase {
    use DatabaseMigrations;
    protected function tearDown(): void { parent::tearDown(); RefreshDatabaseState::$migrated=false; }
    public function test_real_database_backup_restores_into_a_separate_disposable_database(): void {
        if (getenv('GITHUB_ACTIONS')!=='true' || DB::connection()->getDriverName()!=='mysql') $this->markTestSkipped('Real restore runs only in isolated MariaDB CI.');
        $directory=sys_get_temp_dir().'/luxurry-restore-test-'.bin2hex(random_bytes(8));File::ensureDirectoryExists($directory,0700);
        config(['backup.directory'=>$directory,'backup.mysqldump'=>'mariadb-dump']);
        Storage::fake('public');Storage::disk('public')->put('fixtures/photo.webp','restore-fixture-image');
        $category=Category::create(['name'=>'Restored category','slug'=>'restore-fixture']);
        $product=Product::create(['category_id'=>$category->id,'name'=>'Restore basin','slug'=>'restore-basin','code'=>'RESTORE-01','status'=>'published']);
        $product->internalPrice()->create(['amount'=>'1234.56','currency'=>'BDT']);
        $restore='luxurry_restore_test'; $handle=null;
        try {
            $path=app(LocalBackup::class)->create();
            $archive=new \PharData($path);$sql=$archive['database.sql']->getContent();
            $this->assertSame('restore-fixture-image',$archive['public/fixtures/photo.webp']->getContent());
            DB::statement('CREATE DATABASE `luxurry_restore_test` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            $source=DB::connection()->getConfig();
            $options=$directory.'/restore.cnf';
            $ini="[client]\nhost=127.0.0.1\nport=3306\nuser=root\npassword=isolated-ci-password\n";
            file_put_contents($options,$ini);chmod($options,0600);
            $process=new Process(['mariadb','--defaults-file='.$options,$restore]);$process->setInput($sql);$process->setTimeout(60);$process->run();
            $this->assertTrue($process->isSuccessful(),'Isolated database import failed.');
            config(['database.connections.restore_check'=>[...$source,'url'=>null,'database'=>$restore]]);
            $connection=DB::connection('restore_check');
            $this->assertSame('Restored category',$connection->table('categories')->where('slug','restore-fixture')->value('name'));
            $this->assertSame('1234.56',(string)$connection->table('product_prices')->where('product_id',$product->id)->value('amount'));
            $this->assertTrue($connection->getSchemaBuilder()->hasTable('audit_entries'));
        } finally { DB::purge('restore_check');DB::statement('DROP DATABASE IF EXISTS `luxurry_restore_test`');File::deleteDirectory($directory); }
    }
}
