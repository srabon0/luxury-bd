<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
class SessionController extends Controller {
    public function create() { return view('auth.login'); }
    public function store(Request $request) {
        $data=$request->validate(['email'=>'required|email|max:254','password'=>'required|string|max:200']);
        if (!Auth::attempt([...$data,'is_active'=>true])) throw ValidationException::withMessages(['email'=>'Unable to sign in with these details.']);
        $request->session()->regenerate(); return redirect()->intended(route('workspace.index'));
    }
    public function destroy(Request $request) { Auth::logout(); $request->session()->invalidate(); $request->session()->regenerateToken(); return redirect('/'); }
}
