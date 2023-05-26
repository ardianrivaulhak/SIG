<?php

use Illuminate\Database\Seeder;

class Hris_pengujian extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('hris_pengujian')->delete();
        
        \DB::table('hris_pengujian')->insert(array (
            0 => 
            array (
                'id_pengujian' => 1,
            'nama_penguji' => 'AAS FIAS (HVG)',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            1 => 
            array (
                'id_pengujian' => 2,
                'nama_penguji' => 'ICP-OES',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            2 => 
            array (
                'id_pengujian' => 3,
                'nama_penguji' => 'UPLC',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            3 => 
            array (
                'id_pengujian' => 4,
                'nama_penguji' => 'HPLC',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            4 => 
            array (
                'id_pengujian' => 5,
                'nama_penguji' => 'LC MSMS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            5 => 
            array (
                'id_pengujian' => 6,
                'nama_penguji' => 'GC',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            6 => 
            array (
                'id_pengujian' => 7,
                'nama_penguji' => 'LCMSMS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            7 => 
            array (
                'id_pengujian' => 8,
                'nama_penguji' => 'Proksimat',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            8 => 
            array (
                'id_pengujian' => 9,
                'nama_penguji' => 'Titrimetri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            9 => 
            array (
                'id_pengujian' => 10,
                'nama_penguji' => 'Konduktometer',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            10 => 
            array (
                'id_pengujian' => 11,
            'nama_penguji' => 'Kualitatif (Visual)',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            11 => 
            array (
                'id_pengujian' => 12,
                'nama_penguji' => 'GC MSMS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            12 => 
            array (
                'id_pengujian' => 13,
                'nama_penguji' => 'pH meter',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            13 => 
            array (
                'id_pengujian' => 14,
                'nama_penguji' => 'Turbidimeter',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            14 => 
            array (
                'id_pengujian' => 15,
                'nama_penguji' => 'TDS meter',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            15 => 
            array (
                'id_pengujian' => 16,
                'nama_penguji' => 'Spektrofotometer',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            16 => 
            array (
                'id_pengujian' => 17,
                'nama_penguji' => 'TOC Analyzer',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            17 => 
            array (
                'id_pengujian' => 18,
                'nama_penguji' => 'Gravimetri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            18 => 
            array (
                'id_pengujian' => 19,
                'nama_penguji' => 'Kualitatif',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            19 => 
            array (
                'id_pengujian' => 20,
                'nama_penguji' => 'Lovibond',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            20 => 
            array (
                'id_pengujian' => 21,
                'nama_penguji' => 'Mikrobiologi',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            21 => 
            array (
                'id_pengujian' => 22,
                'nama_penguji' => 'GC MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            22 => 
            array (
                'id_pengujian' => 23,
                'nama_penguji' => 'APGC',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            23 => 
            array (
                'id_pengujian' => 24,
                'nama_penguji' => 'LC MS MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            24 => 
            array (
                'id_pengujian' => 25,
                'nama_penguji' => 'LCMS/MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            25 => 
            array (
                'id_pengujian' => 26,
                'nama_penguji' => 'AAS-FLAME',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            26 => 
            array (
                'id_pengujian' => 27,
                'nama_penguji' => 'ICP-MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            27 => 
            array (
                'id_pengujian' => 28,
                'nama_penguji' => 'AAS-FIAS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            28 => 
            array (
                'id_pengujian' => 29,
                'nama_penguji' => 'GCMS/MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            29 => 
            array (
                'id_pengujian' => 30,
                'nama_penguji' => 'GCMS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            30 => 
            array (
                'id_pengujian' => 31,
                'nama_penguji' => 'Karl Fischer',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            31 => 
            array (
                'id_pengujian' => 32,
                'nama_penguji' => 'ICP MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            32 => 
            array (
                'id_pengujian' => 33,
                'nama_penguji' => 'Spektrofotometri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            33 => 
            array (
                'id_pengujian' => 34,
                'nama_penguji' => 'Tintometri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            34 => 
            array (
                'id_pengujian' => 35,
                'nama_penguji' => 'AAS Flame',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            35 => 
            array (
                'id_pengujian' => 36,
                'nama_penguji' => 'ICP OES',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            36 => 
            array (
                'id_pengujian' => 37,
                'nama_penguji' => 'AAS HVG',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            37 => 
            array (
                'id_pengujian' => 38,
                'nama_penguji' => 'LC ICP MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            38 => 
            array (
                'id_pengujian' => 39,
                'nama_penguji' => 'LC QTOF',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            39 => 
            array (
                'id_pengujian' => 40,
                'nama_penguji' => 'GC MS / GC MS MS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            40 => 
            array (
                'id_pengujian' => 41,
                'nama_penguji' => 'Turbidimetri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            41 => 
            array (
                'id_pengujian' => 42,
                'nama_penguji' => 'Potensiometri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            42 => 
            array (
                'id_pengujian' => 43,
                'nama_penguji' => 'Konduktometri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            43 => 
            array (
                'id_pengujian' => 44,
                'nama_penguji' => 'Luff Schoorl',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            44 => 
            array (
                'id_pengujian' => 45,
                'nama_penguji' => 'Enzimatis & Gravimetri',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            45 => 
            array (
                'id_pengujian' => 46,
                'nama_penguji' => 'Spektro',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            46 => 
            array (
                'id_pengujian' => 47,
                'nama_penguji' => 'Kualitiatf',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            47 => 
            array (
                'id_pengujian' => 48,
                'nama_penguji' => 'GC FID',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            48 => 
            array (
                'id_pengujian' => 49,
                'nama_penguji' => 'GC FID Headspace',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            49 => 
            array (
                'id_pengujian' => 50,
                'nama_penguji' => 'GCMSMS',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
            50 => 
            array (
                'id_pengujian' => 51,
                'nama_penguji' => 'GC ECD',
                'updated_at' => NULL,
                'created_at' => NULL,
            ),
        ));
        
        
    }
}
