<?php
namespace App\Http\Controllers;
use App\Mail\ContactEnquiry;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
class ContactController extends Controller {
    public function create(Request $request) {
        $data=$request->validate(['products'=>'sometimes|array|max:3','products.*'=>'required|string|max:180|regex:/^[A-Za-z0-9_-]+$/']);
        $products=Product::where('status','published')->whereIn('slug',$data['products']??[])->get(['name','code']);
        $enquiryMessage=$products->isEmpty() ? '' : "I would like to enquire about:\n".$products->map(fn($product)=>$product->name.' ('.$product->code.')')->implode("\n")."\n\nMy requirements: ";
        $tokens = array_filter($request->session()->get('contact_forms', []), fn($issued) => $issued >= now()->timestamp - 7200);
        $tokens = array_slice($tokens, -4, null, true);
        $contactToken = Str::random(64);
        $tokens[$contactToken] = now()->timestamp;
        $request->session()->put('contact_forms', $tokens);
        return response()->view('catalog.contact', compact('enquiryMessage', 'contactToken'))
            ->header('Cache-Control', 'private, no-store');
    }
    public function store(Request $request) {
        $data=$request->validate(['name'=>'required|string|max:100','email'=>'required|email|max:254','message'=>'required|string|min:10|max:5000','website'=>'nullable|string|max:0','contact_token'=>'required|string|size:64']);
        $token = $data['contact_token'];
        $issued = $request->session()->get('contact_forms', [])[$token] ?? null;
        if (!is_int($issued) || now()->timestamp - $issued < 3 || now()->timestamp - $issued > 7200) {
            throw ValidationException::withMessages(['message'=>'Please reload the contact page and try again.']);
        }
        $recipient=app(\App\Services\WebsiteContent::class)->recipient();
        abort_unless(filter_var($recipient,FILTER_VALIDATE_EMAIL),503,'The contact mailbox has not been configured yet.');
        if (!Cache::add('contact-used:'.hash('sha256', $token), true, 7200)) {
            throw ValidationException::withMessages(['message'=>'This form has already been submitted. Please reload the page for a new enquiry.']);
        }
        $tokens = $request->session()->get('contact_forms', []);
        unset($tokens[$token]);
        $request->session()->put('contact_forms', $tokens);
        $message = preg_replace('/\\s+/u', ' ', trim($data['message']));
        $fingerprint = 'contact-duplicate:'.hash('sha256', Str::lower(trim($data['email'])).'|'.Str::lower($message));
        if (!Cache::add($fingerprint, true, 1800)) {
            return redirect()->route('contact')->with('status','Your enquiry has been submitted to our mail service.');
        }
        try { Mail::to($recipient)->send(new ContactEnquiry(collect($data)->only(['name','email','message'])->all())); }
        catch (\Throwable $e) { Cache::forget($fingerprint); report($e); return back()->withInput($request->except(['website']))->withErrors(['message'=>'Your enquiry could not be submitted. Please try again later.']); }
        return redirect()->route('contact')->with('status','Your enquiry has been submitted to our mail service.');
    }
}
