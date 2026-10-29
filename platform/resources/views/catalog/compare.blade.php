@extends('layout')
@section('title','Compare products · Luxurry')
@section('content')
<section class="section comparison-page"><p class="eyebrow">LUXURRY / SIDE BY SIDE</p><h1>The details make the difference.</h1><p class="muted">Compare up to three products. Find the form, finish and dimensions that fit your space.</p>
@if($unavailable)<p role="status">Some selected products are no longer available. Choose another from the collection.</p>@endif
@if($products->isEmpty())
<div class="compare-empty"><h2>A clearer view of your favourites.</h2><p>Browse the collection and select “Add to comparison” on up to three products.</p><a class="button" href="{{ route('catalog.index') }}">Explore the collection →</a></div>
@else
<div class="table-wrap comparison-wrap" tabindex="0" role="region" aria-label="Product specification comparison"><table class="comparison-table"><caption>Product specifications. Scroll horizontally on smaller screens.</caption><thead><tr><th scope="col">Specification</th>@foreach($products as $product)<th scope="col">@if($product->thumbnail_path)<img src="{{ Storage::disk('public')->url($product->thumbnail_path) }}" width="240" height="240" alt="" loading="lazy">@endif<a href="{{ route('catalog.show',$product->slug) }}">{{ $product->name }}</a><button hidden class="compare-add" type="button" data-compare-slug="{{ $product->slug }}" data-compare-name="{{ $product->name }}" aria-pressed="false">Add to comparison</button></th>@endforeach</tr></thead><tbody>
@foreach(['Category'=>'category','Product code'=>'code','Finish'=>'finish','Dimensions'=>'dimensions','Material'=>'material','Description'=>'description'] as $label=>$field)
@continue(in_array($field,['finish','dimensions','material','description']) && $products->every(fn($item)=>blank($item->$field)))
<tr><th scope="row">{{ $label }}</th>@foreach($products as $product)<td>{{ $field==='category' ? $product->category->name : ($product->$field ?: 'Not specified') }}</td>@endforeach</tr>
@endforeach
</tbody></table></div><div class="toolbar"><a class="button" href="{{ route('contact',['products'=>$products->pluck('slug')->all()]) }}">Talk to our team →</a><a href="{{ route('catalog.index') }}">Continue exploring</a></div>
@endif</section>
@endsection
