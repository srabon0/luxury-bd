<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void { Schema::create('site_settings',function (Blueprint $table) { $table->id(); $table->string('name')->default('Website settings'); $table->json('public_data'); $table->string('contact_recipient',254)->nullable(); $table->timestamps(); }); }
    public function down(): void { Schema::dropIfExists('site_settings'); }
};
