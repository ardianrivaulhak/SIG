<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HrisTraining extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hris_training',function(Blueprint $table){
            $table->integer('id_training')->autoIncrement();
            $table->integer('id_jenis')->nullable();
            $table->string('title',150);
            $table->string('instansi',150);
            $table->integer('id_city');
            $table->date('tanggal_pelatihan');
            $table->timestamps();
            $table->softDeletes('deleted_at', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hris_training');
    }
}
