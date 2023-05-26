<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MstrCustomersAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mstr_customers_address', function(Blueprint $table){
            $table->integer('id_address')->autoIncrement();
            $table->integer('id_customer');
            $table->text('address')->nullable();
            $table->text('description')->nullable();
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
        Schema::dropIfExists('mstr_customers_address');
        //
    }
}
