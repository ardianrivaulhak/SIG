<?php

use Illuminate\Database\Seeder;

class Hris_position extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('hris_position')->delete();
        
        \DB::table('hris_position')->insert(array (
            0 => 
            array (
                'id_position' => 1,
                'position_name' => 'Direktur Operasional',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id_position' => 2,
                'position_name' => 'Manager Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id_position' => 3,
                'position_name' => 'Direktur Teknik',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id_position' => 4,
                'position_name' => 'Asisten Manager Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id_position' => 5,
                'position_name' => 'Manager Laboratorium R & D',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id_position' => 6,
                'position_name' => 'Manager Mutu',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id_position' => 7,
                'position_name' => 'Manager Marketing',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id_position' => 8,
                'position_name' => 'Manager Administrasi',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id_position' => 9,
                'position_name' => 'Staff Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id_position' => 10,
                'position_name' => 'Marketing Executive',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id_position' => 11,
                'position_name' => 'Supervisor Marketing',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            11 => 
            array (
                'id_position' => 12,
                'position_name' => 'Asisten Manager Marketing',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            12 => 
            array (
                'id_position' => 13,
                'position_name' => 'Asisten Manager Sales',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            13 => 
            array (
                'id_position' => 14,
                'position_name' => 'Manager Sales',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            14 => 
            array (
                'id_position' => 15,
                'position_name' => 'Analis Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            15 => 
            array (
                'id_position' => 16,
                'position_name' => 'Supervisor Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            16 => 
            array (
                'id_position' => 17,
                'position_name' => 'Teknisi Kantor',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            17 => 
            array (
                'id_position' => 18,
                'position_name' => 'Teknisi Laboratorium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            18 => 
            array (
                'id_position' => 19,
                'position_name' => 'Staff Umum',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            19 => 
            array (
                'id_position' => 20,
                'position_name' => 'Customer Service',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            20 => 
            array (
                'id_position' => 21,
                'position_name' => 'Supervisor Administrasi',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            21 => 
            array (
                'id_position' => 22,
                'position_name' => 'Analis R & D',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            22 => 
            array (
                'id_position' => 23,
                'position_name' => 'Supervisor R & D',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            23 => 
            array (
                'id_position' => 24,
                'position_name' => 'Asisten Manager R & D',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            24 => 
            array (
                'id_position' => 25,
                'position_name' => 'Staff IT',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            25 => 
            array (
                'id_position' => 26,
                'position_name' => 'Supervisor IT',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            26 => 
            array (
                'id_position' => 27,
                'position_name' => 'Petugas Sampel',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            27 => 
            array (
                'id_position' => 28,
                'position_name' => 'Staff Legal & GA',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            28 => 
            array (
                'id_position' => 29,
                'position_name' => 'Supervisor HRD & GA',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
