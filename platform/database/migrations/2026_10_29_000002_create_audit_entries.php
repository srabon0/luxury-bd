<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('audit_entries',function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_name',100);
            $table->string('actor_role',30)->nullable();
            $table->string('event',40)->index();
            $table->string('subject_type',30);
            $table->unsignedBigInteger('subject_id');
            $table->string('subject_label',160);
            $table->json('changed_fields');
            $table->timestamp('created_at')->useCurrent()->index();
            $table->index(['subject_type','subject_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('audit_entries'); }
};
