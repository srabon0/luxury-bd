<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Deliberately no default accounts, passwords, demo prices or production products.
        // Create the first administrator with: php artisan luxurry:create-admin
    }
}
