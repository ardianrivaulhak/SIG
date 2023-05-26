<?php


use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       $roles = [
           'Admin',
           'Superadmin',
           'Direksi',
           'Manager',
           'Assistant Manager',
           'Clerk',
           'Junior',
           'Staff',
           'Madya',
           'Senior',
           'Supervisor'
        ];


        foreach ($roles as $role) {
             Role::create(['name' => $role]);
        }
    }
}