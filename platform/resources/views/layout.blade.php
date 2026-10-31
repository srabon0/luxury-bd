<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#3730A3">
    <meta name="description" content="Explore sanitaryware and kitchenware from Luxurry, a Classic Group agency. Discover products, compare specifications and discuss your project with our team.">
    <title>@yield('title','Luxurry · Classic Group')</title>
    <link rel="stylesheet" href="{{ asset('assets/app.css') }}?v=20261029-compare2">
</head>
<body class="{{ request()->is('workspace*','staff/*') ? 'workspace-page' : 'public-page' }} {{ request()->routeIs('catalog.compare') ? 'comparison-view' : '' }}">
<a class="skip" href="#main">Skip to content</a>
<div class="topline"><span>Considered spaces. Everyday living.</span><a href="{{ route('contact') }}">Planning your space? Let’s talk ↗</a></div>
<header>
    <a class="brand" href="{{ route('home') }}" aria-label="Luxurry home, a brand by Classic Group">
        <span class="wordmark">LUXURRY<small>SANITARYWARE & KITCHENWARE</small></span>
        <span class="parent"><img src="{{ asset('assets/classic-group.png') }}" width="45" height="45" alt="Classic Group"><span>A brand by<strong>Classic Group</strong></span></span>
    </a>
    <nav aria-label="Main">
        <a href="{{ route('catalog.index') }}" @if(request()->routeIs('catalog.index','catalog.show')) aria-current="page" @endif>Products</a>
        <a href="{{ route('catalog.compare') }}" data-compare-link @if(request()->routeIs('catalog.compare')) aria-current="page" @endif>Compare</a>
        <a class="nav-contact" href="{{ route('contact') }}" @if(request()->routeIs('contact')) aria-current="page" @endif>Contact our team ↗</a>
        @auth<a href="{{ route('workspace.index') }}">Workspace</a><form method="post" action="{{ route('logout') }}">@csrf<button>Sign out</button></form>@endauth
    </nav>
</header>
<main id="main">
    @if(session('status'))<p class="flash" role="status">{{ session('status') }}</p>@endif
    @if($errors->any())<div class="errors" role="alert"><strong>Please check the following:</strong><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>@endif
    @yield('content')
</main>
<footer>
    <div class="footer-main">
        <div><a class="wordmark" href="{{ route('home') }}">LUXURRY<small>SANITARYWARE & KITCHENWARE</small></a><p>Thoughtful forms for the<br>spaces you call your own.</p><div class="footer-parent"><img src="{{ asset('assets/classic-group.png') }}" width="48" height="48" alt="Classic Group" loading="lazy"><span>A BRAND BY<strong>Classic Group</strong></span></div></div>
        <div class="footer-links"><p class="eyebrow">EXPLORE</p><a href="{{ route('catalog.index') }}">Product collection</a><a href="{{ route('catalog.compare') }}" data-compare-link>Compare products</a><a href="{{ route('contact') }}">Project enquiries</a></div>
        <div><p class="eyebrow">LET’S TALK ABOUT YOUR SPACE</p><h2>A considered start.<br>A personal conversation.</h2><a class="footer-contact" href="{{ route('contact') }}">Contact our team ↗</a></div>
    </div>
    <div class="footer-bottom"><span>© {{ date('Y') }} Classic Group</span><span>Luxurry · Sanitaryware &amp; Kitchenware</span><span>Designed in Berlin</span>@auth<a href="{{ route('workspace.index') }}">Staff workspace</a>@else<a href="{{ route('login') }}">Staff sign in</a>@endauth</div>
</footer>
<aside class="compare-tray" hidden aria-label="Selected products"><div><strong>Compare your favourites</strong><span data-compare-count></span></div><ul data-compare-items></ul><a class="button" data-compare-open href="{{ route('catalog.compare') }}">View comparison →</a><button type="button" data-compare-clear>Clear selection</button></aside>
<p class="compare-status" role="status" aria-live="polite" data-compare-status></p>
<script src="{{ asset('assets/compare.js') }}?v=20261029-compare2" defer></script>
</body>
</html>
