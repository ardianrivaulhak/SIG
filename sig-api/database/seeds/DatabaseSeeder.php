<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call('Hris_employee_education');
        $this->call('Hris_employee');
        $this->call('Hris_employee_status');
        $this->call('Hris_experience');
        $this->call('Hris_competence');
        $this->call('Hris_level');
        $this->call('Hris_pengujian');
        $this->call('Hris_parameter');
        $this->call('Hris_position');
        $this->call('Users');
        $this->call('City');
        $this->call('PermissionTableSeeder');
        $this->call('RoleSeeder');
        $this->call('MstrCustomersTaxaddressTableSeeder');
        $this->call('MstrCustomersCustomerTableSeeder');
        $this->call('MstrCustomersAddressTableSeeder');
    }
}
