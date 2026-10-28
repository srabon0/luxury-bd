<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) { $table->string('role',32)->default('sr'); $table->boolean('is_active')->default(true); });
        Schema::create('categories', function (Blueprint $table) { $table->id(); $table->string('name',100); $table->string('slug',120)->unique(); $table->timestamps(); });
        Schema::create('products', function (Blueprint $table) {
            $table->id(); $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name',160); $table->string('slug',180)->unique(); $table->string('code',60)->unique(); $table->text('description')->nullable();
            $table->string('finish',120)->nullable(); $table->string('dimensions',160)->nullable(); $table->string('material',160)->nullable();
            $table->string('status',16)->default('draft'); $table->string('image_path')->nullable(); $table->string('thumbnail_path')->nullable(); $table->timestamps();
            $table->index(['status','category_id','id']); $table->index(['status','id']);
        });
        Schema::create('product_prices', function (Blueprint $table) { $table->id(); $table->foreignId('product_id')->unique()->constrained()->cascadeOnDelete(); $table->decimal('amount',12,2); $table->char('currency',3)->default('BDT'); $table->timestamps(); });
    }
    public function down(): void { Schema::dropIfExists('product_prices'); Schema::dropIfExists('products'); Schema::dropIfExists('categories'); Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['role','is_active'])); }
};
