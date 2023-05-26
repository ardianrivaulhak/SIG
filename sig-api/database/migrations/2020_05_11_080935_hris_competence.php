<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HrisCompetence extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hris_competence',function(Blueprint $table){
            $table->integer('id_competence')->autoIncrement();
            $table->integer('id_employee');
            $table->integer('id_pengujian');
            $table->integer('id_parameter');
            $table->string('penguji',50);
            $table->string('no_sertifikat',50)->nullable();
            $table->date('tanggal_kompetensi')->nullable();
            $table->date('tanggal_berlaku')->nullable();
            $table->string('status',20);
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
        Schema::dropIfExists('hris_competence');
    }
}
