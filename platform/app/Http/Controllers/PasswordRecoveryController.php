<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Services\AuditTrail;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Password};
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
class PasswordRecoveryController extends Controller {
    public function requestForm() { return view('auth.forgot'); }
    public function email(Request $request) {
        $request->merge(['email'=>strtolower((string)$request->input('email'))]);
        $data=$request->validate(['email'=>'required|email|max:254']);
        try { Password::sendResetLink([...$data,'is_active'=>true]); } catch (\Throwable $exception) { report($exception); }
        return back()->with('status','If this address belongs to an active staff account, a reset email has been requested. Check your inbox or contact your administrator.');
    }
    public function resetForm(Request $request, string $token) {
        abort_if(strlen($token)>255,404);
        $data=$request->validate(['email'=>'required|email|max:254']);
        return view('auth.reset',['token'=>$token,'email'=>$data['email']]);
    }
    public function reset(Request $request) {
        $request->merge(['email'=>strtolower((string)$request->input('email'))]);
        $data=$request->validate(['token'=>'required|string|max:255','email'=>'required|email|max:254','password'=>['required','confirmed',PasswordRule::min(12)->letters()->numbers()]]);
        $status=Password::reset([...$data,'is_active'=>true],function (User $user,string $password) {
            DB::transaction(function () use ($user,$password) {
                $user->forceFill(['password'=>$password,'remember_token'=>Str::random(60)])->save();
                app(AuditTrail::class)->record('staff.password_reset',$user,['password']);
            });
            event(new PasswordReset($user));
        });
        if ($status!==Password::PASSWORD_RESET) return back()->withInput($request->only('email'))->withErrors(['email'=>'This reset link is invalid, expired or unavailable. Request another link or contact your administrator.']);
        $request->session()->invalidate(); $request->session()->regenerateToken();
        return redirect()->route('login')->with('status','Password updated. Sign in with your new password.');
    }
}
