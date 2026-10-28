@extends('layout')
@section('content')
<section class="hero"><video autoplay muted loop playsinline preload="metadata" poster="{{ asset('assets/hero-poster.jpg') }}" aria-label="Luxurry collection video"><source src="{{ asset('assets/hero.mp4') }}" type="video/mp4"></video><div><p class="eyebrow">THE SHAPE OF EVERYDAY LIVING</p><h1>Designed around<br>your everyday.</h1><p>Considered forms. Bathroom essentials for the spaces you call your own.</p><a class="button" href="{{ route('catalog.index') }}">Explore products →</a></div><button class="video-toggle" aria-label="Pause homepage video">Pause video</button></section>
<section class="section"><p class="eyebrow">A CONSIDERED COLLECTION</p><h2>Find your next detail.</h2><div class="grid">@forelse($products as $product)@include('catalog.card')@empty<p>The collection is being prepared. <a href="{{ route('contact') }}">Contact our team</a> for details.</p>@endforelse</div></section>
<script src="{{ asset('assets/home.js') }}" defer></script>
@endsection
