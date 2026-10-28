<?php
namespace App\Http\Controllers;
use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
class StaffController extends Controller {
    public function index() { return view('workspace.users',['users'=>User::orderBy('name')->paginate(30),'roles'=>Role::cases()]); }
    public function store(Request $request) {
        $data=$request->validate(['name'=>'required|string|max:100','email'=>'required|email|max:254|unique:users','role'=>['required',Rule::enum(Role::class)],'password'=>['required','confirmed',Password::min(12)->letters()->numbers()]]);
        User::create([...collect($data)->except('password_confirmation')->all(),'email'=>strtolower($data['email']),'is_active'=>true]);
        return back()->with('status','Staff account created.');
    }
    public function update(Request $request, User $user) {
        $data=$request->validate(['name'=>'required|string|max:100','email'=>['required','email','max:254',Rule::unique('users')->ignore($user)],'role'=>['required',Rule::enum(Role::class)],'is_active'=>'required|boolean','password'=>['nullable','confirmed',Password::min(12)->letters()->numbers()]]);
        DB::transaction(function () use ($user,$data) {
            $admins=User::where('role',Role::Admin->value)->where('is_active',true)->orderBy('id')->lockForUpdate()->get();
            $user->refresh();
            if ($user->role===Role::Admin && $user->is_active && $admins->count()<=1 && ($data['role']!==Role::Admin->value || !$data['is_active'])) throw ValidationException::withMessages(['role'=>'Keep at least one active administrator.']);
            $values=collect($data)->except(['password','password_confirmation'])->all(); $values['email']=strtolower($values['email']);
            if (!empty($data['password'])) $values['password']=$data['password'];
            $user->update($values);
        },3);
        return back()->with('status','Staff account updated.');
    }
}
