<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HrisEmployeeEducation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('hris_employee_education',function(Blueprint $table){
           $table->integer('id_employee_education')->autoIncrement();
           $table->integer('id_employee');
           $table->string('last_education',50)->nullable();
           $table->string('instansi',200)->nullable();
           $table->string('jurusan',200)->nullable();
           $table->string('tgl_masuk',25)->nullable();
           $table->string('tgl_keluar',25)->nullable();
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
        Schema::dropIfExists('hris_employee_education');
    }
}
