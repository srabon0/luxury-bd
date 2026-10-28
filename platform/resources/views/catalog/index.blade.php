@extends('layout')
@section('title','Product collection · Luxurry')
@section('content')
<section class="page-intro section"><p class="eyebrow">LUXURRY / PRODUCT COLLECTION</p><h1>Find your next detail.</h1><p>From the first idea to the finishing touch.<br>Explore your bathroom, one piece at a time.</p></section>
<section class="section catalog-section">
<form class="filters" method="get" action="{{ route('catalog.index') }}"><label>Search the collection<input type="search" name="search" maxlength="100" value="{{ request('search') }}" placeholder="Product name or code"></label><label>Product category<select name="category"><option value="">All categories</option>@foreach($categories as $category)<option value="{{ $category->slug }}" @selected(request('category')===$category->slug)>{{ $category->name }}</option>@endforeach</select></label><label>Sort by<select name="sort"><option value="newest">Newest first</option><option value="name" @selected(request('sort')==='name')>Name A–Z</option></select></label><button class="button">Apply filters</button><a href="{{ route('catalog.index') }}">Clear</a></form>
<div class="catalog-summary"><p class="muted">{{ $products->total() }} {{ $products->total()===1 ? 'product' : 'products' }}</p><p class="muted">Select up to 3 products to compare specifications.</p></div>
<div class="grid">@forelse($products as $product)@include('catalog.card')@empty<div class="empty-state"><h2>A fresh start?</h2><p>No products match your filters. Try another search or explore the full collection.</p><a class="text-link" href="{{ route('catalog.index') }}">Reset filters ↗</a></div>@endforelse</div><div class="pagination">{{ $products->links('pagination') }}</div>
</section>
@endsection
