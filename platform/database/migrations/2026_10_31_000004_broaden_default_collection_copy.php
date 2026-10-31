<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
    private const COPY = [
        'hero_description' => [
            'Considered forms. Bathroom essentials for the spaces you call your own.',
            'Sanitaryware and kitchenware for the spaces you call your own.',
        ],
        'intro_description' => [
            'Discover sanitaryware with considered proportions and practical details. Explore the collection, compare specifications and speak with our team about your space.',
            'Discover sanitaryware and kitchenware with considered proportions and practical details. Explore the collection, compare specifications and speak with our team about your space.',
        ],
    ];
    public function up(): void { $this->replaceCopy(0, 1); }
    public function down(): void { $this->replaceCopy(1, 0); }
    private function replaceCopy(int $from, int $to): void {
        $row = DB::table('site_settings')->where('id', 1)->first();
        if (!$row) { return; }
        $data = json_decode($row->public_data, true, 512, JSON_THROW_ON_ERROR);
        $changed = false;
        foreach (self::COPY as $key => $values) {
            if (($data[$key] ?? null) === $values[$from]) {
                $data[$key] = $values[$to];
                $changed = true;
            }
        }
        if ($changed) {
            DB::table('site_settings')->where('id', 1)->update([
                'public_data' => json_encode($data, JSON_THROW_ON_ERROR),
            ]);
        }
    }
};
