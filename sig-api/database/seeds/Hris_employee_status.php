<?php

use Illuminate\Database\Seeder;

class Hris_employee_status extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('hris_employee_status')->delete();
        
        \DB::table('hris_employee_status')->insert(array (
            0 => 
            array (
                'id_employee_status' => 1,
                'status' => 'TETAP',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            1 => 
            array (
                'id_employee_status' => 2,
                'status' => 'KONTRAK',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            2 => 
            array (
                'id_employee_status' => 3,
                'status' => 'HONORER',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
        ));
        
        
    }
}
