<?php
namespace Tests\Feature;
use App\Enums\Role;
use App\Models\{Category,User};
use App\Services\{CatalogBackupLock,LocalBackup};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{DB,File,Storage};
use Tests\TestCase;
class LocalBackupTest extends TestCase {
    use RefreshDatabase;
    private string $directory;
    protected function setUp(): void { parent::setUp();$this->directory=sys_get_temp_dir().'/luxurry-backup-test-'.bin2hex(random_bytes(8)); File::ensureDirectoryExists($this->directory,0700);config(['backup.directory'=>$this->directory,'backup.mysqldump'=>$this->directory.'/dump','backup.keep_days'=>1]); }
    protected function tearDown(): void { File::deleteDirectory($this->directory); parent::tearDown(); }
    private function fakeConnection(): void {
        $original=DB::connection();$config=$original->getConfig(); $config['driver']='mysql';$config['database']='luxurry_test';$config['username']='test';$config['password']='secret-not-in-argv';
        $connection=\Mockery::mock($original);$connection->shouldReceive('getConfig')->andReturn($config);DB::shouldReceive('connection')->andReturn($connection);
    }
    private function binary(bool $failure=false): void {
        $body=$failure ? 'exit 1' : "printf '%s\\n' 'CREATE TABLE backup_test(id INT);'";
        File::put($this->directory.'/dump',"#!/bin/sh\n".$body."\n");chmod($this->directory.'/dump',0700);
    }
    public function test_backup_contains_sql_uploads_manifest_and_checksum_and_rotates_only_owned_files(): void {
        Storage::fake('public'); Storage::disk('public')->put('sample.webp','sample-image');
        $this->fakeConnection();$this->binary();
        $old=$this->directory.'/luxurry-backup-20200101-010101-abcdef12.tar.gz';File::put($old,'old');touch($old,time()-172800);File::put($this->directory.'/unrelated.tar.gz','keep');
        $path=app(LocalBackup::class)->create();
        $this->assertFileExists($path);$this->assertFileExists($path.'.sha256');$this->assertFileDoesNotExist($old);$this->assertFileExists($this->directory.'/unrelated.tar.gz');
        $this->assertStringStartsWith(hash_file('sha256',$path),File::get($path.'.sha256'));
        $this->assertSame(0600,fileperms($path)&0777);
        $archive=new \PharData($path); $this->assertTrue(isset($archive['database.sql']));$this->assertTrue(isset($archive['manifest.json']));$this->assertTrue(isset($archive['public/sample.webp']));
        $this->assertStringNotContainsString('secret-not-in-argv',$archive['database.sql']->getContent());
        $this->assertSame([],glob($this->directory.'/.work-*'));$this->assertSame([],glob($this->directory.'/.partial-*'));
    }
    public function test_failed_dump_creates_no_completed_backup_and_cleans_credentials(): void {
        $this->fakeConnection();$this->binary(true);
        try { app(LocalBackup::class)->create(); $this->fail('Expected backup failure.'); } catch (\RuntimeException $exception) { $this->assertStringContainsString('Database backup failed',$exception->getMessage()); }
        $this->assertSame([],glob($this->directory.'/*.tar.gz'));$this->assertSame([],glob($this->directory.'/.work-*'));
    }
    public function test_public_backup_destination_is_rejected(): void {
        $this->fakeConnection();config(['backup.directory'=>public_path('unsafe-backup-test')]);
        try { app(LocalBackup::class)->create(); $this->fail('Expected unsafe path rejection.'); } catch (\RuntimeException $exception) { $this->assertStringContainsString('publicly accessible',$exception->getMessage()); } finally { File::deleteDirectory(public_path('unsafe-backup-test')); }
    }
    public function test_application_writes_pause_during_backup_but_reads_remain_available(): void {
        $user=User::factory()->create(['role'=>Role::Admin,'is_active'=>true]);$this->actingAs($user);
        $locks=app(CatalogBackupLock::class); $lock=$locks->acquire(true);
        try { $this->post('/workspace/categories',['name'=>'Paused','slug'=>'paused'])->assertStatus(503);$this->get('/workspace')->assertOk();$this->assertDatabaseCount('categories',0); }
        finally { $locks->release($lock); }
        $this->post('/workspace/categories',['name'=>'Available','slug'=>'available'])->assertRedirect(); $this->assertDatabaseHas('categories',['slug'=>'available']);
    }
}
