<?php
namespace App\Http\Controllers;
use App\Models\SiteSetting;
use App\Services\{AuditTrail,WebsiteContent};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class SiteSettingsController extends Controller {
    public function edit(WebsiteContent $content) { return view('workspace.settings',['content'=>$content->publicData(),'recipient'=>$content->settings()?->contact_recipient]); }
    public function update(Request $request) {
        $data=$request->validate([
            'hero_eyebrow'=>'required|string|max:100','hero_heading'=>'required|string|max:160','hero_description'=>'required|string|max:500',
            'intro_heading'=>'required|string|max:160','intro_description'=>'required|string|max:1500','contact_heading'=>'required|string|max:160','contact_description'=>'required|string|max:1500',
            'public_email'=>'nullable|email|max:254','phone'=>'nullable|string|max:60','address'=>'nullable|string|max:1000','contact_recipient'=>'nullable|email|max:254',
        ]);
        DB::transaction(function () use ($data) {
            $settings=SiteSetting::firstOrCreate(['id'=>1],['name'=>'Website settings','public_data'=>WebsiteContent::DEFAULTS]);
            $settings->update(['public_data'=>array_intersect_key($data,WebsiteContent::DEFAULTS),'contact_recipient'=>$data['contact_recipient']??null]);
            app(AuditTrail::class)->record('settings.updated',$settings,['homepage','contact_details','contact_recipient']);
        });
        app()->forgetInstance(WebsiteContent::class);
        return back()->with('status','Website settings saved.');
    }
}
