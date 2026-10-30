<?php
namespace App\Services;
use App\Models\SiteSetting;
class WebsiteContent {
    public const DEFAULTS = [
        'hero_eyebrow'=>'THE SHAPE OF EVERYDAY LIVING','hero_heading'=>"Designed around\nyour everyday.",
        'hero_description'=>'Considered forms. Bathroom essentials for the spaces you call your own.',
        'intro_heading'=>"Spaces that feel\nlike you.",'intro_description'=>'Discover sanitaryware with considered proportions and practical details. Explore the collection, compare specifications and speak with our team about your space.',
        'contact_heading'=>"Good spaces start\nwith a little dialogue.",'contact_description'=>'Whether you’re choosing one detail or planning an entire project, tell us what you have in mind.',
        'public_email'=>'','phone'=>'','address'=>'',
    ];
    private bool $loaded=false;
    private ?object $request=null;
    private ?SiteSetting $settings=null;
    public function settings(): ?SiteSetting { if ($this->request!==request()) { $this->request=request(); $this->loaded=false; } if (!$this->loaded) { $this->settings=SiteSetting::find(1); $this->loaded=true; } return $this->settings; }
    public function publicData(): array { return array_replace(self::DEFAULTS,array_intersect_key($this->settings()?->public_data??[],self::DEFAULTS)); }
    public function recipient(): ?string { return $this->settings()?->contact_recipient ?: config('catalog.contact_email'); }
}
