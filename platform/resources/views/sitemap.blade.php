@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
@foreach($entries as $entry)
<url><loc>{{ $entry['loc'] }}</loc>@isset($entry['lastmod'])<lastmod>{{ $entry['lastmod'] }}</lastmod>@endisset @isset($entry['image'])<image:image><image:loc>{{ $entry['image'] }}</image:loc></image:image>@endisset</url>
@endforeach
</urlset>
