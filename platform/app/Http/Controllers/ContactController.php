<?php
namespace App\Http\Controllers;
use App\Mail\ContactEnquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
class ContactController extends Controller {
    public function create() { return view('catalog.contact'); }
    public function store(Request $request) {
        $data=$request->validate(['name'=>'required|string|max:100','email'=>'required|email|max:254','message'=>'required|string|min:10|max:5000','website'=>'nullable|string|max:0']);
        $recipient=config('catalog.contact_email');
        abort_unless(filter_var($recipient,FILTER_VALIDATE_EMAIL),503,'The contact mailbox has not been configured yet.');
        try { Mail::to($recipient)->send(new ContactEnquiry(collect($data)->only(['name','email','message'])->all())); }
        catch (\Throwable $e) { report($e); return back()->withInput($request->except(['website']))->withErrors(['message'=>'Your enquiry could not be submitted. Please try again later.']); }
        return redirect()->route('contact')->with('status','Your enquiry has been submitted to our mail service.');
    }
}
