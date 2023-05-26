<?php

use Illuminate\Database\Seeder;

class Hris_parameter extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('hris_parameter')->delete();
        
        \DB::table('hris_parameter')->insert(array (
            0 => 
            array (
                'id_parameter' => 1,
                'parameter_name' => 'Arsen, Arsen Anorganik, Arsen Total, Merkuri',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id_parameter' => 2,
                'parameter_name' => 'Besi',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id_parameter' => 3,
                'parameter_name' => 'Aluminium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id_parameter' => 4,
                'parameter_name' => 'Merkuri',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id_parameter' => 5,
                'parameter_name' => 'Arsen',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id_parameter' => 6,
                'parameter_name' => 'Arsen Anorganik',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id_parameter' => 7,
                'parameter_name' => 'Timbal',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id_parameter' => 8,
                'parameter_name' => 'Triamsinolon Asetonida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id_parameter' => 9,
                'parameter_name' => 'Methanyl Yellow',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id_parameter' => 10,
                'parameter_name' => 'Rhodamin B',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id_parameter' => 11,
                'parameter_name' => 'Asam retinoat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            11 => 
            array (
                'id_parameter' => 12,
                'parameter_name' => 'Vitamin B1',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            12 => 
            array (
                'id_parameter' => 13,
                'parameter_name' => 'Histamin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            13 => 
            array (
                'id_parameter' => 14,
                'parameter_name' => 'L-Triptophane',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            14 => 
            array (
                'id_parameter' => 15,
                'parameter_name' => 'K-Sorbat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            15 => 
            array (
                'id_parameter' => 16,
                'parameter_name' => 'Chloramphenicol',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            16 => 
            array (
                'id_parameter' => 17,
                'parameter_name' => 'Betametason',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            17 => 
            array (
                'id_parameter' => 18,
                'parameter_name' => 'Hidrokinon',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            18 => 
            array (
                'id_parameter' => 19,
            'parameter_name' => 'Kafein (anhidrat)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            19 => 
            array (
                'id_parameter' => 20,
                'parameter_name' => 'Glycine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            20 => 
            array (
                'id_parameter' => 21,
                'parameter_name' => 'Okratoksin A',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            21 => 
            array (
                'id_parameter' => 22,
                'parameter_name' => 'Vitamin C',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            22 => 
            array (
                'id_parameter' => 23,
            'parameter_name' => 'Alkohol (miras)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            23 => 
            array (
                'id_parameter' => 24,
                'parameter_name' => 'Vitamin B12',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            24 => 
            array (
                'id_parameter' => 25,
                'parameter_name' => 'Kolesterol',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            25 => 
            array (
                'id_parameter' => 26,
                'parameter_name' => 'Kadar lemak, Asam lemak bebas',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            26 => 
            array (
                'id_parameter' => 27,
                'parameter_name' => 'Kadar protein',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            27 => 
            array (
                'id_parameter' => 28,
            'parameter_name' => 'Karbon dioksida (CO2) bebas',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            28 => 
            array (
                'id_parameter' => 29,
                'parameter_name' => 'Daya hantar listrik pada 25 ?C',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            29 => 
            array (
                'id_parameter' => 30,
                'parameter_name' => 'Minyak pelikan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            30 => 
            array (
                'id_parameter' => 31,
                'parameter_name' => 'Aldrin dan Dieldrin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            31 => 
            array (
                'id_parameter' => 32,
                'parameter_name' => 'Heptachlorepoxide',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            32 => 
            array (
                'id_parameter' => 33,
                'parameter_name' => 'pH',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            33 => 
            array (
                'id_parameter' => 34,
                'parameter_name' => 'Kekeruhan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            34 => 
            array (
                'id_parameter' => 35,
                'parameter_name' => 'Zat yang terlarut',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            35 => 
            array (
                'id_parameter' => 36,
            'parameter_name' => 'Klorida (Cl-)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            36 => 
            array (
                'id_parameter' => 37,
                'parameter_name' => 'Kadar air',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            37 => 
            array (
                'id_parameter' => 38,
            'parameter_name' => 'Amonium (NH4)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            38 => 
            array (
                'id_parameter' => 39,
                'parameter_name' => 'Total Organik Karbon ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            39 => 
            array (
                'id_parameter' => 40,
            'parameter_name' => 'Fluorida (F)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            40 => 
            array (
                'id_parameter' => 41,
            'parameter_name' => 'Sianida (CN)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            41 => 
            array (
                'id_parameter' => 42,
                'parameter_name' => 'Kafein',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            42 => 
            array (
                'id_parameter' => 43,
                'parameter_name' => 'Saturated Fat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            43 => 
            array (
                'id_parameter' => 44,
            'parameter_name' => 'Kehalusan, lolos ayakan 212 um No. 70 (b/b)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            44 => 
            array (
                'id_parameter' => 45,
                'parameter_name' => 'Bilangan Peroksida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            45 => 
            array (
                'id_parameter' => 46,
                'parameter_name' => 'Azo dyes :',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            46 => 
            array (
                'id_parameter' => 47,
                'parameter_name' => 'Formaldehyde',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            47 => 
            array (
                'id_parameter' => 48,
            'parameter_name' => 'Total Volatile Base-Nitrogen (TVB-N) ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            48 => 
            array (
                'id_parameter' => 49,
                'parameter_name' => 'Asam Lemak',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            49 => 
            array (
                'id_parameter' => 50,
                'parameter_name' => 'Siklamat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            50 => 
            array (
                'id_parameter' => 51,
                'parameter_name' => 'Fruktosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            51 => 
            array (
                'id_parameter' => 52,
                'parameter_name' => 'Xylosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            52 => 
            array (
                'id_parameter' => 53,
                'parameter_name' => 'Vitamin B9',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            53 => 
            array (
                'id_parameter' => 54,
                'parameter_name' => 'EDTA',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            54 => 
            array (
                'id_parameter' => 55,
                'parameter_name' => 'Formalin Kualitatif',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            55 => 
            array (
                'id_parameter' => 56,
                'parameter_name' => 'Aflatoksin G1',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            56 => 
            array (
                'id_parameter' => 57,
                'parameter_name' => 'Warna Lovibond',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            57 => 
            array (
                'id_parameter' => 58,
            'parameter_name' => 'Surfaktan Anionik (Deterjen)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            58 => 
            array (
                'id_parameter' => 59,
                'parameter_name' => 'Amonium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            59 => 
            array (
                'id_parameter' => 60,
                'parameter_name' => 'Flourida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            60 => 
            array (
                'id_parameter' => 61,
                'parameter_name' => 'Nitrat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            61 => 
            array (
                'id_parameter' => 62,
                'parameter_name' => 'Nitrit',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            62 => 
            array (
                'id_parameter' => 63,
                'parameter_name' => 'Klor Bebas',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            63 => 
            array (
                'id_parameter' => 64,
                'parameter_name' => 'Sianida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            64 => 
            array (
                'id_parameter' => 65,
                'parameter_name' => 'Sulfat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            65 => 
            array (
                'id_parameter' => 66,
                'parameter_name' => 'Warna',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            66 => 
            array (
                'id_parameter' => 67,
                'parameter_name' => 'ALT',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            67 => 
            array (
                'id_parameter' => 68,
                'parameter_name' => 'Kapang',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            68 => 
            array (
                'id_parameter' => 69,
                'parameter_name' => 'Bacillus cereus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            69 => 
            array (
                'id_parameter' => 70,
                'parameter_name' => 'Listeria monocytogenes',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            70 => 
            array (
                'id_parameter' => 71,
                'parameter_name' => 'Clostridium perfringens',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            71 => 
            array (
                'id_parameter' => 72,
                'parameter_name' => 'ALT Thermofilik Pembentuk Spora',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            72 => 
            array (
                'id_parameter' => 73,
                'parameter_name' => 'Legionella pneumophilla',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            73 => 
            array (
                'id_parameter' => 74,
                'parameter_name' => 'Enterobactericeae',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            74 => 
            array (
                'id_parameter' => 75,
                'parameter_name' => 'Salmonella sp',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            75 => 
            array (
                'id_parameter' => 76,
                'parameter_name' => 'Escherichia coli',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            76 => 
            array (
                'id_parameter' => 77,
                'parameter_name' => 'Vibrio cholerae',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            77 => 
            array (
                'id_parameter' => 78,
                'parameter_name' => 'Pseudomonas aeruginosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            78 => 
            array (
                'id_parameter' => 79,
                'parameter_name' => 'Enterococci',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            79 => 
            array (
                'id_parameter' => 80,
                'parameter_name' => 'Khamir',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            80 => 
            array (
                'id_parameter' => 81,
                'parameter_name' => 'Bacillus sp',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            81 => 
            array (
                'id_parameter' => 82,
                'parameter_name' => 'Staphyloccoucus aureus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            82 => 
            array (
                'id_parameter' => 83,
                'parameter_name' => 'Coliform',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            83 => 
            array (
                'id_parameter' => 84,
                'parameter_name' => 'Anaerob pereduksi sulfit pembentuk spora',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            84 => 
            array (
                'id_parameter' => 85,
                'parameter_name' => 'Candida albicans',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            85 => 
            array (
                'id_parameter' => 86,
                'parameter_name' => 'Shigella sonnei',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            86 => 
            array (
                'id_parameter' => 87,
                'parameter_name' => 'Vibrio parahaemolyticus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            87 => 
            array (
                'id_parameter' => 88,
                'parameter_name' => 'Bifidobacterium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            88 => 
            array (
                'id_parameter' => 89,
                'parameter_name' => 'Lactobacillus acidophilus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            89 => 
            array (
                'id_parameter' => 90,
                'parameter_name' => 'Lactobacillus casei',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            90 => 
            array (
                'id_parameter' => 91,
                'parameter_name' => 'Enterobacteriaceae plate count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            91 => 
            array (
                'id_parameter' => 92,
                'parameter_name' => 'S.aureus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            92 => 
            array (
                'id_parameter' => 93,
                'parameter_name' => 'Enterobacteriaceae kualitatif',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            93 => 
            array (
                'id_parameter' => 94,
                'parameter_name' => 'B.cereus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            94 => 
            array (
                'id_parameter' => 95,
                'parameter_name' => 'P.aeruginosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            95 => 
            array (
                'id_parameter' => 96,
                'parameter_name' => 'UDH',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            96 => 
            array (
                'id_parameter' => 97,
                'parameter_name' => 'Efektivitas Pengawet',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            97 => 
            array (
                'id_parameter' => 98,
                'parameter_name' => 'E.coli',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            98 => 
            array (
                'id_parameter' => 99,
                'parameter_name' => 'E.coli Plate Count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            99 => 
            array (
                'id_parameter' => 100,
                'parameter_name' => 'Enterobactericeae plate count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            100 => 
            array (
                'id_parameter' => 101,
                'parameter_name' => 'Enterobacteariceae plate count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            101 => 
            array (
                'id_parameter' => 102,
                'parameter_name' => 'Enterobacteariceae kualitatif',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            102 => 
            array (
                'id_parameter' => 103,
                'parameter_name' => 'Enterobacter sakazakii',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            103 => 
            array (
                'id_parameter' => 104,
            'parameter_name' => 'Formalin (kualitatif)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            104 => 
            array (
                'id_parameter' => 105,
            'parameter_name' => 'Vitamin B2 (Riboflavin)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            105 => 
            array (
                'id_parameter' => 106,
                'parameter_name' => 'Indigotin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            106 => 
            array (
                'id_parameter' => 107,
                'parameter_name' => 'Tartrazin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            107 => 
            array (
                'id_parameter' => 108,
                'parameter_name' => 'Betametason 17 Valerate',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            108 => 
            array (
                'id_parameter' => 109,
                'parameter_name' => 'Deksametason',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            109 => 
            array (
                'id_parameter' => 110,
                'parameter_name' => 'Hidrokortison asetat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            110 => 
            array (
                'id_parameter' => 111,
            'parameter_name' => 'Quinoline Yellow (E104)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            111 => 
            array (
                'id_parameter' => 112,
                'parameter_name' => 'Glukosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            112 => 
            array (
                'id_parameter' => 113,
                'parameter_name' => 'Sakarosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            113 => 
            array (
                'id_parameter' => 114,
                'parameter_name' => 'Maltosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            114 => 
            array (
                'id_parameter' => 115,
                'parameter_name' => 'Laktosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            115 => 
            array (
                'id_parameter' => 116,
                'parameter_name' => 'L-Alanine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            116 => 
            array (
                'id_parameter' => 117,
                'parameter_name' => 'L-Argrinine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            117 => 
            array (
                'id_parameter' => 118,
                'parameter_name' => 'L-Aspartic acid',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            118 => 
            array (
                'id_parameter' => 119,
                'parameter_name' => 'L-Cystine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            119 => 
            array (
                'id_parameter' => 120,
                'parameter_name' => 'L-Glutamic Acid',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            120 => 
            array (
                'id_parameter' => 121,
                'parameter_name' => 'L-Histidine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            121 => 
            array (
                'id_parameter' => 122,
                'parameter_name' => 'L-Isoleusine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            122 => 
            array (
                'id_parameter' => 123,
                'parameter_name' => 'L-L Lysine HCl',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            123 => 
            array (
                'id_parameter' => 124,
                'parameter_name' => 'L-Leucine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            124 => 
            array (
                'id_parameter' => 125,
                'parameter_name' => 'L-Methionine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            125 => 
            array (
                'id_parameter' => 126,
                'parameter_name' => 'L-Phenylalanine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            126 => 
            array (
                'id_parameter' => 127,
                'parameter_name' => 'L-Proline',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            127 => 
            array (
                'id_parameter' => 128,
                'parameter_name' => 'L-Serine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            128 => 
            array (
                'id_parameter' => 129,
                'parameter_name' => 'L-Threonine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            129 => 
            array (
                'id_parameter' => 130,
                'parameter_name' => 'L-Tyrosine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            130 => 
            array (
                'id_parameter' => 131,
                'parameter_name' => 'L-Valine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            131 => 
            array (
                'id_parameter' => 132,
                'parameter_name' => 'L-Triptophan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            132 => 
            array (
                'id_parameter' => 133,
                'parameter_name' => 'Total Glukosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            133 => 
            array (
                'id_parameter' => 134,
                'parameter_name' => 'Aflatoksin total, B1, B2, G1 dan G2',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            134 => 
            array (
                'id_parameter' => 135,
                'parameter_name' => 'Vitamin E Asetat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            135 => 
            array (
                'id_parameter' => 136,
            'parameter_name' => 'Butylated Hydroxytoluene (BHT)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            136 => 
            array (
                'id_parameter' => 137,
            'parameter_name' => 'Butylated Hydroxyanisole (BHA)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            137 => 
            array (
                'id_parameter' => 138,
            'parameter_name' => 'Tertiary Butylhydroquinone (TBHQ)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            138 => 
            array (
                'id_parameter' => 139,
                'parameter_name' => 'Sudan I',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            139 => 
            array (
                'id_parameter' => 140,
                'parameter_name' => 'Sudan II',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            140 => 
            array (
                'id_parameter' => 141,
                'parameter_name' => 'Sudan III',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            141 => 
            array (
                'id_parameter' => 142,
                'parameter_name' => 'Sudan IV',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            142 => 
            array (
                'id_parameter' => 143,
                'parameter_name' => 'Amitrol',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            143 => 
            array (
                'id_parameter' => 144,
                'parameter_name' => 'Residu Pestisida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            144 => 
            array (
                'id_parameter' => 145,
                'parameter_name' => 'Diquat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            145 => 
            array (
                'id_parameter' => 146,
                'parameter_name' => 'Identifikasi Gelatin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            146 => 
            array (
                'id_parameter' => 147,
                'parameter_name' => 'Glufosinate Ammonium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            147 => 
            array (
                'id_parameter' => 148,
                'parameter_name' => 'Azo Dyes',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            148 => 
            array (
                'id_parameter' => 149,
                'parameter_name' => 'Tetrasiklin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            149 => 
            array (
                'id_parameter' => 150,
                'parameter_name' => '3MCPD',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            150 => 
            array (
                'id_parameter' => 151,
                'parameter_name' => 'Pthalat',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            151 => 
            array (
                'id_parameter' => 152,
                'parameter_name' => 'Dioksin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            152 => 
            array (
                'id_parameter' => 153,
                'parameter_name' => 'Klorampenikol',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            153 => 
            array (
                'id_parameter' => 154,
                'parameter_name' => 'Melamine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            154 => 
            array (
                'id_parameter' => 155,
                'parameter_name' => 'Dimethipin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            155 => 
            array (
                'id_parameter' => 156,
                'parameter_name' => 'TPM dyes',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            156 => 
            array (
                'id_parameter' => 157,
                'parameter_name' => 'Residu Solvent',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            157 => 
            array (
                'id_parameter' => 158,
                'parameter_name' => 'Kadar Fruktosa',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            158 => 
            array (
                'id_parameter' => 159,
            'parameter_name' => 'Kadar Dimethylaminoethanol Hydrogentartrate (DMAE)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            159 => 
            array (
                'id_parameter' => 160,
                'parameter_name' => 'Kadar Folic Acid',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            160 => 
            array (
                'id_parameter' => 161,
                'parameter_name' => 'Kadar Ascorbic Acid',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            161 => 
            array (
                'id_parameter' => 162,
                'parameter_name' => 'Kadar Cholecalciferol ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            162 => 
            array (
                'id_parameter' => 163,
                'parameter_name' => 'Kadar L-Tryptophan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            163 => 
            array (
                'id_parameter' => 164,
                'parameter_name' => 'Kadar L-Lysine Acetate, L-Histidine, L-Threonine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            164 => 
            array (
                'id_parameter' => 165,
                'parameter_name' => 'Kadar Biotin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            165 => 
            array (
                'id_parameter' => 166,
                'parameter_name' => 'Okratoksin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            166 => 
            array (
                'id_parameter' => 167,
            'parameter_name' => 'Deoxinivalenol (DON)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            167 => 
            array (
                'id_parameter' => 168,
            'parameter_name' => 'Oksigen Terlarut (DO)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            168 => 
            array (
                'id_parameter' => 169,
                'parameter_name' => 'Ca',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            169 => 
            array (
                'id_parameter' => 170,
                'parameter_name' => 'Mg',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            170 => 
            array (
                'id_parameter' => 171,
                'parameter_name' => 'Na',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            171 => 
            array (
                'id_parameter' => 172,
                'parameter_name' => 'Zn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            172 => 
            array (
                'id_parameter' => 173,
                'parameter_name' => 'Al',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            173 => 
            array (
                'id_parameter' => 174,
                'parameter_name' => 'Fe',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            174 => 
            array (
                'id_parameter' => 175,
                'parameter_name' => 'As total',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            175 => 
            array (
                'id_parameter' => 176,
                'parameter_name' => 'Pb',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            176 => 
            array (
                'id_parameter' => 177,
                'parameter_name' => 'Cd',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            177 => 
            array (
                'id_parameter' => 178,
                'parameter_name' => 'Hg',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            178 => 
            array (
                'id_parameter' => 179,
                'parameter_name' => 'As Anorganik',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            179 => 
            array (
                'id_parameter' => 180,
                'parameter_name' => 'TiO2',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            180 => 
            array (
                'id_parameter' => 181,
                'parameter_name' => 'Dimethipine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            181 => 
            array (
                'id_parameter' => 182,
                'parameter_name' => '3-MCPD',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            182 => 
            array (
                'id_parameter' => 183,
                'parameter_name' => 'As',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            183 => 
            array (
                'id_parameter' => 184,
                'parameter_name' => 'Sn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            184 => 
            array (
                'id_parameter' => 185,
                'parameter_name' => 'Melamin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            185 => 
            array (
                'id_parameter' => 186,
                'parameter_name' => 'Cadmium',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            186 => 
            array (
                'id_parameter' => 187,
                'parameter_name' => 'Timah',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            187 => 
            array (
                'id_parameter' => 188,
                'parameter_name' => 'Kadar Abu',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            188 => 
            array (
                'id_parameter' => 189,
                'parameter_name' => 'Padatan Total',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            189 => 
            array (
                'id_parameter' => 190,
                'parameter_name' => 'Gula Total',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            190 => 
            array (
                'id_parameter' => 191,
                'parameter_name' => 'Kadar Lemak',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            191 => 
            array (
                'id_parameter' => 192,
                'parameter_name' => 'NaCl',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            192 => 
            array (
                'id_parameter' => 193,
                'parameter_name' => 'Klorida',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            193 => 
            array (
                'id_parameter' => 194,
                'parameter_name' => 'Alkalinitas',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            194 => 
            array (
                'id_parameter' => 195,
                'parameter_name' => 'Bilangan Iod',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            195 => 
            array (
                'id_parameter' => 196,
                'parameter_name' => 'Bilangan Penyabunan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            196 => 
            array (
                'id_parameter' => 197,
                'parameter_name' => 'Kesadahan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            197 => 
            array (
                'id_parameter' => 198,
                'parameter_name' => 'Sulfit',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            198 => 
            array (
                'id_parameter' => 199,
                'parameter_name' => 'Kadar Ekstrak Panax Ginseng Terstandar ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            199 => 
            array (
                'id_parameter' => 200,
                'parameter_name' => 'Kadar L-Tyrosine',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            200 => 
            array (
                'id_parameter' => 201,
            'parameter_name' => 'Angka Lempeng Total (ALT)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            201 => 
            array (
                'id_parameter' => 202,
                'parameter_name' => 'Enterobacteariceae',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            202 => 
            array (
                'id_parameter' => 203,
                'parameter_name' => 'Escherichia coli Plate Count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            203 => 
            array (
                'id_parameter' => 204,
                'parameter_name' => 'Enterobacteriaceae',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            204 => 
            array (
                'id_parameter' => 205,
                'parameter_name' => 'Staphylococcus aureus',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            205 => 
            array (
                'id_parameter' => 206,
                'parameter_name' => 'Clostridium perfringens, Shigella sp',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            206 => 
            array (
                'id_parameter' => 207,
                'parameter_name' => 'Endotoksin ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            207 => 
            array (
                'id_parameter' => 208,
                'parameter_name' => 'Endotoksin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            208 => 
            array (
                'id_parameter' => 209,
                'parameter_name' => 'Kapang, Khamir, Candida albicans, ALT',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            209 => 
            array (
                'id_parameter' => 210,
                'parameter_name' => 'Coliform, Escherichia coli, Escherichia coli plate count',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            210 => 
            array (
                'id_parameter' => 211,
                'parameter_name' => 'Fe, Zn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            211 => 
            array (
                'id_parameter' => 212,
                'parameter_name' => 'Pb, Cd, Hg, As',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            212 => 
            array (
                'id_parameter' => 213,
                'parameter_name' => 'Mn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            213 => 
            array (
                'id_parameter' => 214,
                'parameter_name' => 'Mo, Se',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            214 => 
            array (
                'id_parameter' => 215,
                'parameter_name' => 'Cd, Hg, As',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            215 => 
            array (
                'id_parameter' => 216,
                'parameter_name' => 'Sodium Cu Chlorophyllin, Fe, Zn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            216 => 
            array (
                'id_parameter' => 217,
                'parameter_name' => 'As III, As V',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            217 => 
            array (
                'id_parameter' => 218,
                'parameter_name' => 'Arsenobetaine, Dimetylarsenic acid',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            218 => 
            array (
                'id_parameter' => 219,
                'parameter_name' => 'Ca, Na',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            219 => 
            array (
                'id_parameter' => 220,
            'parameter_name' => 'Cu, Ni, Pb, Cd (Logam Terkestraksi)',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            220 => 
            array (
                'id_parameter' => 221,
                'parameter_name' => 'Sulfur',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            221 => 
            array (
                'id_parameter' => 222,
                'parameter_name' => 'Posfor',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            222 => 
            array (
                'id_parameter' => 223,
                'parameter_name' => 'Pb, Hg',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            223 => 
            array (
                'id_parameter' => 224,
                'parameter_name' => 'Cd, As',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            224 => 
            array (
                'id_parameter' => 225,
                'parameter_name' => 'Mo',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            225 => 
            array (
                'id_parameter' => 226,
                'parameter_name' => 'Cu, Fe, Zn, Sn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            226 => 
            array (
                'id_parameter' => 227,
                'parameter_name' => 'Ca, Sn',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            227 => 
            array (
                'id_parameter' => 228,
                'parameter_name' => 'Cu',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            228 => 
            array (
                'id_parameter' => 229,
                'parameter_name' => 'Mn, Cr',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            229 => 
            array (
                'id_parameter' => 230,
                'parameter_name' => 'K, Fe, Ca, Cu, Mg',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            230 => 
            array (
                'id_parameter' => 231,
                'parameter_name' => 'SiO2',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            231 => 
            array (
                'id_parameter' => 232,
                'parameter_name' => 'Al, Ca, Fe, Mg',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            232 => 
            array (
                'id_parameter' => 233,
                'parameter_name' => 'Kadar Air KF',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            233 => 
            array (
                'id_parameter' => 234,
                'parameter_name' => 'Gula Reduksi',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            234 => 
            array (
                'id_parameter' => 235,
                'parameter_name' => 'Asam Lemak Bebas',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            235 => 
            array (
                'id_parameter' => 236,
                'parameter_name' => 'Bilangan Asam',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            236 => 
            array (
                'id_parameter' => 237,
                'parameter_name' => 'Serat Pangan Total',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            237 => 
            array (
                'id_parameter' => 238,
                'parameter_name' => 'Serat Kasar',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            238 => 
            array (
                'id_parameter' => 239,
                'parameter_name' => 'Zat Organik',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            239 => 
            array (
                'id_parameter' => 240,
                'parameter_name' => 'Formalin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            240 => 
            array (
                'id_parameter' => 241,
                'parameter_name' => 'Curcumin',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            241 => 
            array (
                'id_parameter' => 242,
                'parameter_name' => 'Aspartame',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            242 => 
            array (
                'id_parameter' => 243,
                'parameter_name' => 'Detergen',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            243 => 
            array (
                'id_parameter' => 244,
                'parameter_name' => 'Triptophan',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            244 => 
            array (
                'id_parameter' => 245,
                'parameter_name' => 'Antioksidan AOAC',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            245 => 
            array (
                'id_parameter' => 246,
                'parameter_name' => 'Sudan Red',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            246 => 
            array (
                'id_parameter' => 247,
                'parameter_name' => 'Pewarna',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            247 => 
            array (
                'id_parameter' => 248,
                'parameter_name' => 'Vitamin B',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            248 => 
            array (
                'id_parameter' => 249,
                'parameter_name' => 'Pengawet Kosmetik',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            249 => 
            array (
                'id_parameter' => 250,
                'parameter_name' => 'Asam Lemak ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            250 => 
            array (
                'id_parameter' => 251,
                'parameter_name' => 'Kolesterol ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            251 => 
            array (
                'id_parameter' => 252,
                'parameter_name' => '3 MCPD ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            252 => 
            array (
                'id_parameter' => 253,
                'parameter_name' => 'Etanol ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            253 => 
            array (
                'id_parameter' => 254,
                'parameter_name' => 'Metanol ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            254 => 
            array (
                'id_parameter' => 255,
                'parameter_name' => 'Residu Solvent ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            255 => 
            array (
                'id_parameter' => 256,
                'parameter_name' => 'Multi Residu Pestisida LCMSMS ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            256 => 
            array (
                'id_parameter' => 257,
                'parameter_name' => 'Multi Residu Pestisida GCMSMS ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            257 => 
            array (
                'id_parameter' => 258,
                'parameter_name' => 'Diquat ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            258 => 
            array (
                'id_parameter' => 259,
                'parameter_name' => 'Chlormequat ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            259 => 
            array (
                'id_parameter' => 260,
                'parameter_name' => 'Maleic Hydrazide',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            260 => 
            array (
                'id_parameter' => 261,
                'parameter_name' => 'Ethephone ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            261 => 
            array (
                'id_parameter' => 262,
                'parameter_name' => 'Ion Bromida ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            262 => 
            array (
                'id_parameter' => 263,
                'parameter_name' => 'Tetracycline ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            263 => 
            array (
                'id_parameter' => 264,
                'parameter_name' => 'Oxytetracycline ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            264 => 
            array (
                'id_parameter' => 265,
                'parameter_name' => 'Chlortetracycline',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            265 => 
            array (
                'id_parameter' => 266,
                'parameter_name' => 'Vitamin B12 ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            266 => 
            array (
                'id_parameter' => 267,
                'parameter_name' => 'Chloramphenicol ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            267 => 
            array (
                'id_parameter' => 268,
                'parameter_name' => 'Mikotoksin ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            268 => 
            array (
                'id_parameter' => 269,
                'parameter_name' => 'Dioksin ',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
