<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConditionContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('condition_contracts', function (Blueprint $table) {
            $table->integer('id_condition_contract');
            $table->integer('id_contract');
            $table->integer('status_cs');
            $table->dateTime('time_status_cs');
            $table->integer('user_status_cs');
            $table->integer('status_kendali');
            $table->dateTime('time_status_kendali');
            $table->integer('user_status_kendali');
            $table->integer('status_sample');
            $table->dateTime('time_status_sample');
            $table->integer('user_status_sample');
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
        Schema::dropIfExists('condition_contracts');
    }
}
