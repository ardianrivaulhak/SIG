<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MstrCustomersCategory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mstr_customers_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->uniqid();
            $table->tinyInteger('active');
            $table->text('desc');
            $table->string('slug');
            $table->integer('category_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mstr_customers_category');
        //
    }
}
