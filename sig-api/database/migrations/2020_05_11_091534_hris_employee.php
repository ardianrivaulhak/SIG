<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HrisEmployee extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hris_employee', function(Blueprint $table){
            $table->integer('employee_id')->autoIncrement();
            $table->integer('user_id');
            $table->string('noktp',50)->nullable();
            $table->string('nik',50)->nullable();
            $table->string('employee_name',50);
            $table->integer('tempat_lahir');
            $table->date('tgl_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->enum('gender',['Male','Female']);
            $table->string('religion',50);
            $table->integer('id_photo')->nullable();
            $table->string('phone',100)->nullable();
            $table->enum('martial_status',['Menikah','Belum Menikah'])->nullable();
            $table->integer('status')->nullable();
            $table->string('bagian',100);
            $table->string('subagian',100);
            $table->integer('inserted_user')->nullable();
            $table->integer('updated_user')->nullable();
            $table->integer('deleted_user')->nullable();
            $table->timestamps(0);
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
        Schema::dropIfExists('hris_employee');
        //
    }
}
