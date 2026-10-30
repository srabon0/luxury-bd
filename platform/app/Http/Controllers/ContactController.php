<?php
namespace App\Http\Controllers;
use App\Mail\ContactEnquiry;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
class ContactController extends Controller {
    public function create(Request $request) {
        $data=$request->validate(['products'=>'sometimes|array|max:3','products.*'=>'required|string|max:180|regex:/^[A-Za-z0-9_-]+$/']);
        $products=Product::where('status','published')->whereIn('slug',$data['products']??[])->get(['name','code']);
        $enquiryMessage=$products->isEmpty() ? '' : "I would like to enquire about:\n".$products->map(fn($product)=>$product->name.' ('.$product->code.')')->implode("\n")."\n\nMy requirements: ";
        return view('catalog.contact',compact('enquiryMessage'));
    }
    public function store(Request $request) {
        $data=$request->validate(['name'=>'required|string|max:100','email'=>'required|email|max:254','message'=>'required|string|min:10|max:5000','website'=>'nullable|string|max:0']);
        $recipient=app(\App\Services\WebsiteContent::class)->recipient();
        abort_unless(filter_var($recipient,FILTER_VALIDATE_EMAIL),503,'The contact mailbox has not been configured yet.');
        try { Mail::to($recipient)->send(new ContactEnquiry(collect($data)->only(['name','email','message'])->all())); }
        catch (\Throwable $e) { report($e); return back()->withInput($request->except(['website']))->withErrors(['message'=>'Your enquiry could not be submitted. Please try again later.']); }
        return redirect()->route('contact')->with('status','Your enquiry has been submitted to our mail service.');
    }
}
