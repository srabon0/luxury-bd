<?php
use App\Enums\Role;
use App\Models\User;
use App\Services\AuditTrail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
Artisan::command('luxurry:create-admin', function () {
    $name=$this->ask('Administrator name'); $email=strtolower((string)$this->ask('Administrator email')); $password=$this->secret('Password (at least 12 characters, letters and numbers)'); $confirmation=$this->secret('Confirm password');
    $data=['name'=>$name,'email'=>$email,'password'=>$password,'password_confirmation'=>$confirmation];
    $validator=Validator::make($data,['name'=>'required|string|max:100','email'=>'required|email|max:254|unique:users','password'=>['required','confirmed',Password::min(12)->letters()->numbers()]]);
    if ($validator->fails()) { foreach ($validator->errors()->all() as $error) $this->error($error); return 1; }
    DB::transaction(function () use ($name,$email,$password) { $user=User::create(['name'=>$name,'email'=>$email,'password'=>$password,'role'=>Role::Admin,'is_active'=>true]); app(AuditTrail::class)->record('staff.created',$user,['name','email','password','role','is_active']); });
    $this->info('Administrator created.'); return 0;
})->purpose('Create the first administrator interactively; no default credentials.');
