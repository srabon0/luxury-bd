<?php
namespace App\Http\Controllers;
use App\Models\AuditEntry;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class AuditController extends Controller {
    public function index(Request $request) {
        $data=$request->validate(['event'=>['nullable',Rule::in(AuditEntry::EVENTS)],'page'=>'nullable|integer|min:1|max:10000']);
        $entries=AuditEntry::query()->when($data['event']??null,fn($query,$event)=>$query->where('event',$event))->latest('id')->paginate(40)->withQueryString();
        return view('workspace.audit',['entries'=>$entries,'events'=>AuditEntry::EVENTS]);
    }
}
