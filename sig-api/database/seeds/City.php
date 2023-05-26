<?php

use Illuminate\Database\Seeder;

class City extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('city')->delete();
        
        \DB::table('city')->insert(array (
            0 => 
            array (
                'id_city' => 1,
                'city_name' => 'CILEGON',
            ),
            1 => 
            array (
                'id_city' => 2,
                'city_name' => 'LEBAK',
            ),
            2 => 
            array (
                'id_city' => 3,
                'city_name' => 'PANDEGLANG',
            ),
            3 => 
            array (
                'id_city' => 4,
                'city_name' => 'SERANG',
            ),
            4 => 
            array (
                'id_city' => 5,
                'city_name' => 'TANGERANG',
            ),
            5 => 
            array (
                'id_city' => 6,
                'city_name' => 'TANGERANG SELATAN',
            ),
            6 => 
            array (
                'id_city' => 7,
                'city_name' => 'JAKARTA BARAT',
            ),
            7 => 
            array (
                'id_city' => 8,
                'city_name' => 'JAKARTA PUSAT',
            ),
            8 => 
            array (
                'id_city' => 9,
                'city_name' => 'JAKARTA SELATAN',
            ),
            9 => 
            array (
                'id_city' => 10,
                'city_name' => 'JAKARTA TIMUR',
            ),
            10 => 
            array (
                'id_city' => 11,
                'city_name' => 'JAKARTA UTARA',
            ),
            11 => 
            array (
                'id_city' => 12,
                'city_name' => 'KEPULAUAN SERIBU',
            ),
            12 => 
            array (
                'id_city' => 13,
                'city_name' => 'BANDUNG',
            ),
            13 => 
            array (
                'id_city' => 14,
                'city_name' => 'BANDUNG BARAT',
            ),
            14 => 
            array (
                'id_city' => 15,
                'city_name' => 'BANJAR',
            ),
            15 => 
            array (
                'id_city' => 16,
                'city_name' => 'BEKASI',
            ),
            16 => 
            array (
                'id_city' => 17,
                'city_name' => 'BOGOR',
            ),
            17 => 
            array (
                'id_city' => 18,
                'city_name' => 'CIAMIS',
            ),
            18 => 
            array (
                'id_city' => 19,
                'city_name' => 'CIANJUR',
            ),
            19 => 
            array (
                'id_city' => 20,
                'city_name' => 'CIMAHI',
            ),
            20 => 
            array (
                'id_city' => 21,
                'city_name' => 'CIREBON',
            ),
            21 => 
            array (
                'id_city' => 22,
                'city_name' => 'DEPOK',
            ),
            22 => 
            array (
                'id_city' => 23,
                'city_name' => 'GARUT',
            ),
            23 => 
            array (
                'id_city' => 24,
                'city_name' => 'INDRAMAYU',
            ),
            24 => 
            array (
                'id_city' => 25,
                'city_name' => 'KARAWANG',
            ),
            25 => 
            array (
                'id_city' => 26,
                'city_name' => 'KUNINGAN',
            ),
            26 => 
            array (
                'id_city' => 27,
                'city_name' => 'MAJALENGKA',
            ),
            27 => 
            array (
                'id_city' => 28,
                'city_name' => 'PANGANDARAN',
            ),
            28 => 
            array (
                'id_city' => 29,
                'city_name' => 'PURWAKARTA',
            ),
            29 => 
            array (
                'id_city' => 30,
                'city_name' => 'SUBANG',
            ),
            30 => 
            array (
                'id_city' => 31,
                'city_name' => 'SUKABUMI',
            ),
            31 => 
            array (
                'id_city' => 32,
                'city_name' => 'SUMEDANG',
            ),
            32 => 
            array (
                'id_city' => 33,
                'city_name' => 'TASIKMALAYA',
            ),
            33 => 
            array (
                'id_city' => 34,
                'city_name' => 'BANJARNEGARA',
            ),
            34 => 
            array (
                'id_city' => 35,
                'city_name' => 'BANYUMAS',
            ),
            35 => 
            array (
                'id_city' => 36,
                'city_name' => 'BATANG',
            ),
            36 => 
            array (
                'id_city' => 37,
                'city_name' => 'BLORA',
            ),
            37 => 
            array (
                'id_city' => 38,
                'city_name' => 'BOYOLALI',
            ),
            38 => 
            array (
                'id_city' => 39,
                'city_name' => 'BREBES',
            ),
            39 => 
            array (
                'id_city' => 40,
                'city_name' => 'CILACAP',
            ),
            40 => 
            array (
                'id_city' => 41,
                'city_name' => 'DEMAK',
            ),
            41 => 
            array (
                'id_city' => 42,
                'city_name' => 'GROBOGAN',
            ),
            42 => 
            array (
                'id_city' => 43,
                'city_name' => 'JEPARA',
            ),
            43 => 
            array (
                'id_city' => 44,
                'city_name' => 'KARANGANYAR',
            ),
            44 => 
            array (
                'id_city' => 45,
                'city_name' => 'KEBUMEN',
            ),
            45 => 
            array (
                'id_city' => 46,
                'city_name' => 'KENDAL',
            ),
            46 => 
            array (
                'id_city' => 47,
                'city_name' => 'KLATEN',
            ),
            47 => 
            array (
                'id_city' => 48,
                'city_name' => 'KUDUS',
            ),
            48 => 
            array (
                'id_city' => 49,
                'city_name' => 'MAGELANG',
            ),
            49 => 
            array (
                'id_city' => 50,
                'city_name' => 'PATI',
            ),
            50 => 
            array (
                'id_city' => 51,
                'city_name' => 'PEKALONGAN',
            ),
            51 => 
            array (
                'id_city' => 52,
                'city_name' => 'PEMALANG',
            ),
            52 => 
            array (
                'id_city' => 53,
                'city_name' => 'PURBALINGGA',
            ),
            53 => 
            array (
                'id_city' => 54,
                'city_name' => 'PURWOREJO',
            ),
            54 => 
            array (
                'id_city' => 55,
                'city_name' => 'REMBANG',
            ),
            55 => 
            array (
                'id_city' => 56,
                'city_name' => 'SALATIGA',
            ),
            56 => 
            array (
                'id_city' => 57,
                'city_name' => 'SEMARANG',
            ),
            57 => 
            array (
                'id_city' => 58,
                'city_name' => 'SRAGEN',
            ),
            58 => 
            array (
                'id_city' => 59,
                'city_name' => 'SUKOHARJO',
            ),
            59 => 
            array (
                'id_city' => 60,
            'city_name' => 'SURAKARTA (SOLO)',
            ),
            60 => 
            array (
                'id_city' => 61,
                'city_name' => 'TEGAL',
            ),
            61 => 
            array (
                'id_city' => 62,
                'city_name' => 'TEMANGGUNG',
            ),
            62 => 
            array (
                'id_city' => 63,
                'city_name' => 'WONOGIRI',
            ),
            63 => 
            array (
                'id_city' => 64,
                'city_name' => 'WONOSOBO',
            ),
            64 => 
            array (
                'id_city' => 65,
                'city_name' => 'BANTUL',
            ),
            65 => 
            array (
                'id_city' => 66,
                'city_name' => 'GUNUNG KIDUL',
            ),
            66 => 
            array (
                'id_city' => 67,
                'city_name' => 'KULON PROGO',
            ),
            67 => 
            array (
                'id_city' => 68,
                'city_name' => 'SLEMAN',
            ),
            68 => 
            array (
                'id_city' => 69,
                'city_name' => 'YOGYAKARTA',
            ),
            69 => 
            array (
                'id_city' => 70,
                'city_name' => 'BANGKALAN',
            ),
            70 => 
            array (
                'id_city' => 71,
                'city_name' => 'BANYUWANGI',
            ),
            71 => 
            array (
                'id_city' => 72,
                'city_name' => 'BATU',
            ),
            72 => 
            array (
                'id_city' => 73,
                'city_name' => 'BLITAR',
            ),
            73 => 
            array (
                'id_city' => 74,
                'city_name' => 'BOJONEGORO',
            ),
            74 => 
            array (
                'id_city' => 75,
                'city_name' => 'BONDOWOSO',
            ),
            75 => 
            array (
                'id_city' => 76,
                'city_name' => 'GRESIK',
            ),
            76 => 
            array (
                'id_city' => 77,
                'city_name' => 'JEMBER',
            ),
            77 => 
            array (
                'id_city' => 78,
                'city_name' => 'JOMBANG',
            ),
            78 => 
            array (
                'id_city' => 79,
                'city_name' => 'KEDIRI',
            ),
            79 => 
            array (
                'id_city' => 80,
                'city_name' => 'LAMONGAN',
            ),
            80 => 
            array (
                'id_city' => 81,
                'city_name' => 'LUMAJANG',
            ),
            81 => 
            array (
                'id_city' => 82,
                'city_name' => 'MADIUN',
            ),
            82 => 
            array (
                'id_city' => 83,
                'city_name' => 'MAGETAN',
            ),
            83 => 
            array (
                'id_city' => 84,
                'city_name' => 'MALANG',
            ),
            84 => 
            array (
                'id_city' => 85,
                'city_name' => 'MOJOKERTO',
            ),
            85 => 
            array (
                'id_city' => 86,
                'city_name' => 'NGANJUK',
            ),
            86 => 
            array (
                'id_city' => 87,
                'city_name' => 'NGAWI',
            ),
            87 => 
            array (
                'id_city' => 88,
                'city_name' => 'PACITAN',
            ),
            88 => 
            array (
                'id_city' => 89,
                'city_name' => 'PAMEKASAN',
            ),
            89 => 
            array (
                'id_city' => 90,
                'city_name' => 'PASURUAN',
            ),
            90 => 
            array (
                'id_city' => 91,
                'city_name' => 'PONOROGO',
            ),
            91 => 
            array (
                'id_city' => 92,
                'city_name' => 'PROBOLINGGO',
            ),
            92 => 
            array (
                'id_city' => 93,
                'city_name' => 'SAMPANG',
            ),
            93 => 
            array (
                'id_city' => 94,
                'city_name' => 'SIDOARJO',
            ),
            94 => 
            array (
                'id_city' => 95,
                'city_name' => 'SITUBONDO',
            ),
            95 => 
            array (
                'id_city' => 96,
                'city_name' => 'SUMENEP',
            ),
            96 => 
            array (
                'id_city' => 97,
                'city_name' => 'SURABAYA',
            ),
            97 => 
            array (
                'id_city' => 98,
                'city_name' => 'TRENGGALEK',
            ),
            98 => 
            array (
                'id_city' => 99,
                'city_name' => 'TUBAN',
            ),
            99 => 
            array (
                'id_city' => 100,
                'city_name' => 'TULUNGAGUNG',
            ),
            100 => 
            array (
                'id_city' => 101,
                'city_name' => 'BADUNG',
            ),
            101 => 
            array (
                'id_city' => 102,
                'city_name' => 'BANGLI',
            ),
            102 => 
            array (
                'id_city' => 103,
                'city_name' => 'BULELENG',
            ),
            103 => 
            array (
                'id_city' => 104,
                'city_name' => 'DENPASAR',
            ),
            104 => 
            array (
                'id_city' => 105,
                'city_name' => 'GIANYAR',
            ),
            105 => 
            array (
                'id_city' => 106,
                'city_name' => 'JEMBRANA',
            ),
            106 => 
            array (
                'id_city' => 107,
                'city_name' => 'KARANGASEM',
            ),
            107 => 
            array (
                'id_city' => 108,
                'city_name' => 'KLUNGKUNG',
            ),
            108 => 
            array (
                'id_city' => 109,
                'city_name' => 'TABANAN',
            ),
            109 => 
            array (
                'id_city' => 110,
                'city_name' => 'ACEH BARAT',
            ),
            110 => 
            array (
                'id_city' => 111,
                'city_name' => 'ACEH BARAT DAYA',
            ),
            111 => 
            array (
                'id_city' => 112,
                'city_name' => 'ACEH BESAR',
            ),
            112 => 
            array (
                'id_city' => 113,
                'city_name' => 'ACEH JAYA',
            ),
            113 => 
            array (
                'id_city' => 114,
                'city_name' => 'ACEH SELATAN',
            ),
            114 => 
            array (
                'id_city' => 115,
                'city_name' => 'ACEH SINGKIL',
            ),
            115 => 
            array (
                'id_city' => 116,
                'city_name' => 'ACEH TAMIANG',
            ),
            116 => 
            array (
                'id_city' => 117,
                'city_name' => 'ACEH TENGAH',
            ),
            117 => 
            array (
                'id_city' => 118,
                'city_name' => 'ACEH TENGGARA',
            ),
            118 => 
            array (
                'id_city' => 119,
                'city_name' => 'ACEH TIMUR',
            ),
            119 => 
            array (
                'id_city' => 120,
                'city_name' => 'ACEH UTARA',
            ),
            120 => 
            array (
                'id_city' => 121,
                'city_name' => 'BANDA ACEH',
            ),
            121 => 
            array (
                'id_city' => 122,
                'city_name' => 'BENER MERIAH',
            ),
            122 => 
            array (
                'id_city' => 123,
                'city_name' => 'BIREUEN',
            ),
            123 => 
            array (
                'id_city' => 124,
                'city_name' => 'GAYO LUES',
            ),
            124 => 
            array (
                'id_city' => 125,
                'city_name' => 'LANGSA',
            ),
            125 => 
            array (
                'id_city' => 126,
                'city_name' => 'LHOKSEUMAWE',
            ),
            126 => 
            array (
                'id_city' => 127,
                'city_name' => 'NAGAN RAYA',
            ),
            127 => 
            array (
                'id_city' => 128,
                'city_name' => 'PIDIE',
            ),
            128 => 
            array (
                'id_city' => 129,
                'city_name' => 'PIDIE JAYA',
            ),
            129 => 
            array (
                'id_city' => 130,
                'city_name' => 'SABANG',
            ),
            130 => 
            array (
                'id_city' => 131,
                'city_name' => 'SIMEULUE',
            ),
            131 => 
            array (
                'id_city' => 132,
                'city_name' => 'SUBULUSSALAM',
            ),
            132 => 
            array (
                'id_city' => 133,
                'city_name' => 'ASAHAN',
            ),
            133 => 
            array (
                'id_city' => 134,
                'city_name' => 'BATU BARA',
            ),
            134 => 
            array (
                'id_city' => 135,
                'city_name' => 'BINJAI',
            ),
            135 => 
            array (
                'id_city' => 136,
                'city_name' => 'DAIRI',
            ),
            136 => 
            array (
                'id_city' => 137,
                'city_name' => 'DELI SERDANG',
            ),
            137 => 
            array (
                'id_city' => 138,
                'city_name' => 'GUNUNGSITOLI',
            ),
            138 => 
            array (
                'id_city' => 139,
                'city_name' => 'HUMBANG HASUNDUTAN',
            ),
            139 => 
            array (
                'id_city' => 140,
                'city_name' => 'KARO',
            ),
            140 => 
            array (
                'id_city' => 141,
                'city_name' => 'LABUHAN BATU',
            ),
            141 => 
            array (
                'id_city' => 142,
                'city_name' => 'LABUHAN BATU SELATAN',
            ),
            142 => 
            array (
                'id_city' => 143,
                'city_name' => 'LABUHAN BATU UTARA',
            ),
            143 => 
            array (
                'id_city' => 144,
                'city_name' => 'LANGKAT',
            ),
            144 => 
            array (
                'id_city' => 145,
                'city_name' => 'MANDAILING NATAL',
            ),
            145 => 
            array (
                'id_city' => 146,
                'city_name' => 'MEDAN',
            ),
            146 => 
            array (
                'id_city' => 147,
                'city_name' => 'NIAS',
            ),
            147 => 
            array (
                'id_city' => 148,
                'city_name' => 'NIAS BARAT',
            ),
            148 => 
            array (
                'id_city' => 149,
                'city_name' => 'NIAS SELATAN',
            ),
            149 => 
            array (
                'id_city' => 150,
                'city_name' => 'NIAS UTARA',
            ),
            150 => 
            array (
                'id_city' => 151,
                'city_name' => 'PADANG LAWAS',
            ),
            151 => 
            array (
                'id_city' => 152,
                'city_name' => 'PADANG LAWAS UTARA',
            ),
            152 => 
            array (
                'id_city' => 153,
                'city_name' => 'PADANG SIDEMPUAN',
            ),
            153 => 
            array (
                'id_city' => 154,
                'city_name' => 'PAKPAK BHARAT',
            ),
            154 => 
            array (
                'id_city' => 155,
                'city_name' => 'PEMATANG SIANTAR',
            ),
            155 => 
            array (
                'id_city' => 156,
                'city_name' => 'SAMOSIR',
            ),
            156 => 
            array (
                'id_city' => 157,
                'city_name' => 'SERDANG BEDAGAI',
            ),
            157 => 
            array (
                'id_city' => 158,
                'city_name' => 'SIBOLGA',
            ),
            158 => 
            array (
                'id_city' => 159,
                'city_name' => 'SIMALUNGUN',
            ),
            159 => 
            array (
                'id_city' => 160,
                'city_name' => 'TANJUNG BALAI',
            ),
            160 => 
            array (
                'id_city' => 161,
                'city_name' => 'TAPANULI SELATAN',
            ),
            161 => 
            array (
                'id_city' => 162,
                'city_name' => 'TAPANULI TENGAH',
            ),
            162 => 
            array (
                'id_city' => 163,
                'city_name' => 'TAPANULI UTARA',
            ),
            163 => 
            array (
                'id_city' => 164,
                'city_name' => 'TEBING TINGGI',
            ),
            164 => 
            array (
                'id_city' => 165,
                'city_name' => 'TOBA SAMOSIR',
            ),
            165 => 
            array (
                'id_city' => 166,
                'city_name' => 'AGAM',
            ),
            166 => 
            array (
                'id_city' => 167,
                'city_name' => 'BUKITTINGGI',
            ),
            167 => 
            array (
                'id_city' => 168,
                'city_name' => 'DHARMASRAYA',
            ),
            168 => 
            array (
                'id_city' => 169,
                'city_name' => 'KEPULAUAN MENTAWAI',
            ),
            169 => 
            array (
                'id_city' => 170,
                'city_name' => 'LIMA PULUH KOTO/KOTA',
            ),
            170 => 
            array (
                'id_city' => 171,
                'city_name' => 'PADANG',
            ),
            171 => 
            array (
                'id_city' => 172,
                'city_name' => 'PADANG PANJANG',
            ),
            172 => 
            array (
                'id_city' => 173,
                'city_name' => 'PADANG PARIAMAN',
            ),
            173 => 
            array (
                'id_city' => 174,
                'city_name' => 'PARIAMAN',
            ),
            174 => 
            array (
                'id_city' => 175,
                'city_name' => 'PASAMAN',
            ),
            175 => 
            array (
                'id_city' => 176,
                'city_name' => 'PASAMAN BARAT',
            ),
            176 => 
            array (
                'id_city' => 177,
                'city_name' => 'PAYAKUMBUH',
            ),
            177 => 
            array (
                'id_city' => 178,
                'city_name' => 'PESISIR SELATAN',
            ),
            178 => 
            array (
                'id_city' => 179,
                'city_name' => 'SAWAH LUNTO',
            ),
            179 => 
            array (
                'id_city' => 180,
            'city_name' => 'SIJUNJUNG (SAWAH LUNTO SIJUNJUNG)',
            ),
            180 => 
            array (
                'id_city' => 181,
                'city_name' => 'SOLOK',
            ),
            181 => 
            array (
                'id_city' => 182,
                'city_name' => 'SOLOK SELATAN',
            ),
            182 => 
            array (
                'id_city' => 183,
                'city_name' => 'TANAH DATAR',
            ),
            183 => 
            array (
                'id_city' => 184,
                'city_name' => 'BENGKALIS',
            ),
            184 => 
            array (
                'id_city' => 185,
                'city_name' => 'DUMAI',
            ),
            185 => 
            array (
                'id_city' => 186,
                'city_name' => 'INDRAGIRI HILIR',
            ),
            186 => 
            array (
                'id_city' => 187,
                'city_name' => 'INDRAGIRI HULU',
            ),
            187 => 
            array (
                'id_city' => 188,
                'city_name' => 'KAMPAR',
            ),
            188 => 
            array (
                'id_city' => 189,
                'city_name' => 'KEPULAUAN MERANTI',
            ),
            189 => 
            array (
                'id_city' => 190,
                'city_name' => 'KUANTAN SINGINGI',
            ),
            190 => 
            array (
                'id_city' => 191,
                'city_name' => 'PEKANBARU',
            ),
            191 => 
            array (
                'id_city' => 192,
                'city_name' => 'PELALAWAN',
            ),
            192 => 
            array (
                'id_city' => 193,
                'city_name' => 'ROKAN HILIR',
            ),
            193 => 
            array (
                'id_city' => 194,
                'city_name' => 'ROKAN HULU',
            ),
            194 => 
            array (
                'id_city' => 195,
                'city_name' => 'SIAK',
            ),
            195 => 
            array (
                'id_city' => 196,
                'city_name' => 'BATAM',
            ),
            196 => 
            array (
                'id_city' => 197,
                'city_name' => 'BINTAN',
            ),
            197 => 
            array (
                'id_city' => 198,
                'city_name' => 'KARIMUN',
            ),
            198 => 
            array (
                'id_city' => 199,
                'city_name' => 'KEPULAUAN ANAMBAS',
            ),
            199 => 
            array (
                'id_city' => 200,
                'city_name' => 'LINGGA',
            ),
            200 => 
            array (
                'id_city' => 201,
                'city_name' => 'NATUNA',
            ),
            201 => 
            array (
                'id_city' => 202,
                'city_name' => 'TANJUNG PINANG',
            ),
            202 => 
            array (
                'id_city' => 203,
                'city_name' => 'BATANG HARI',
            ),
            203 => 
            array (
                'id_city' => 204,
                'city_name' => 'BUNGO',
            ),
            204 => 
            array (
                'id_city' => 205,
                'city_name' => 'JAMBI',
            ),
            205 => 
            array (
                'id_city' => 206,
                'city_name' => 'KERINCI',
            ),
            206 => 
            array (
                'id_city' => 207,
                'city_name' => 'MERANGIN',
            ),
            207 => 
            array (
                'id_city' => 208,
                'city_name' => 'MUARO JAMBI',
            ),
            208 => 
            array (
                'id_city' => 209,
                'city_name' => 'SAROLANGUN',
            ),
            209 => 
            array (
                'id_city' => 210,
                'city_name' => 'SUNGAIPENUH',
            ),
            210 => 
            array (
                'id_city' => 211,
                'city_name' => 'TANJUNG JABUNG BARAT',
            ),
            211 => 
            array (
                'id_city' => 212,
                'city_name' => 'TANJUNG JABUNG TIMUR',
            ),
            212 => 
            array (
                'id_city' => 213,
                'city_name' => 'TEBO',
            ),
            213 => 
            array (
                'id_city' => 214,
                'city_name' => 'BENGKULU',
            ),
            214 => 
            array (
                'id_city' => 215,
                'city_name' => 'BENGKULU SELATAN',
            ),
            215 => 
            array (
                'id_city' => 216,
                'city_name' => 'BENGKULU TENGAH',
            ),
            216 => 
            array (
                'id_city' => 217,
                'city_name' => 'BENGKULU UTARA',
            ),
            217 => 
            array (
                'id_city' => 218,
                'city_name' => 'KAUR',
            ),
            218 => 
            array (
                'id_city' => 219,
                'city_name' => 'KEPAHIANG',
            ),
            219 => 
            array (
                'id_city' => 220,
                'city_name' => 'LEBONG',
            ),
            220 => 
            array (
                'id_city' => 221,
                'city_name' => 'MUKO MUKO',
            ),
            221 => 
            array (
                'id_city' => 222,
                'city_name' => 'REJANG LEBONG',
            ),
            222 => 
            array (
                'id_city' => 223,
                'city_name' => 'SELUMA',
            ),
            223 => 
            array (
                'id_city' => 224,
                'city_name' => 'BANYUASIN',
            ),
            224 => 
            array (
                'id_city' => 225,
                'city_name' => 'EMPAT LAWANG',
            ),
            225 => 
            array (
                'id_city' => 226,
                'city_name' => 'LAHAT',
            ),
            226 => 
            array (
                'id_city' => 227,
                'city_name' => 'LUBUK LINGGAU',
            ),
            227 => 
            array (
                'id_city' => 228,
                'city_name' => 'MUARA ENIM',
            ),
            228 => 
            array (
                'id_city' => 229,
                'city_name' => 'MUSI BANYUASIN',
            ),
            229 => 
            array (
                'id_city' => 230,
                'city_name' => 'MUSI RAWAS',
            ),
            230 => 
            array (
                'id_city' => 231,
                'city_name' => 'OGAN ILIR',
            ),
            231 => 
            array (
                'id_city' => 232,
                'city_name' => 'OGAN KOMERING ILIR',
            ),
            232 => 
            array (
                'id_city' => 233,
                'city_name' => 'OGAN KOMERING ULU',
            ),
            233 => 
            array (
                'id_city' => 234,
                'city_name' => 'OGAN KOMERING ULU SELATAN',
            ),
            234 => 
            array (
                'id_city' => 235,
                'city_name' => 'OGAN KOMERING ULU TIMUR',
            ),
            235 => 
            array (
                'id_city' => 236,
                'city_name' => 'PAGAR ALAM',
            ),
            236 => 
            array (
                'id_city' => 237,
                'city_name' => 'PALEMBANG',
            ),
            237 => 
            array (
                'id_city' => 238,
                'city_name' => 'PRABUMULIH',
            ),
            238 => 
            array (
                'id_city' => 239,
                'city_name' => 'BANGKA',
            ),
            239 => 
            array (
                'id_city' => 240,
                'city_name' => 'BANGKA BARAT',
            ),
            240 => 
            array (
                'id_city' => 241,
                'city_name' => 'BANGKA SELATAN',
            ),
            241 => 
            array (
                'id_city' => 242,
                'city_name' => 'BANGKA TENGAH',
            ),
            242 => 
            array (
                'id_city' => 243,
                'city_name' => 'BELITUNG',
            ),
            243 => 
            array (
                'id_city' => 244,
                'city_name' => 'BELITUNG TIMUR',
            ),
            244 => 
            array (
                'id_city' => 245,
                'city_name' => 'PANGKAL PINANG',
            ),
            245 => 
            array (
                'id_city' => 246,
                'city_name' => 'BANDAR LAMPUNG',
            ),
            246 => 
            array (
                'id_city' => 247,
                'city_name' => 'LAMPUNG BARAT',
            ),
            247 => 
            array (
                'id_city' => 248,
                'city_name' => 'LAMPUNG SELATAN',
            ),
            248 => 
            array (
                'id_city' => 249,
                'city_name' => 'LAMPUNG TENGAH',
            ),
            249 => 
            array (
                'id_city' => 250,
                'city_name' => 'LAMPUNG TIMUR',
            ),
            250 => 
            array (
                'id_city' => 251,
                'city_name' => 'LAMPUNG UTARA',
            ),
            251 => 
            array (
                'id_city' => 252,
                'city_name' => 'MESUJI',
            ),
            252 => 
            array (
                'id_city' => 253,
                'city_name' => 'METRO',
            ),
            253 => 
            array (
                'id_city' => 254,
                'city_name' => 'PESAWARAN',
            ),
            254 => 
            array (
                'id_city' => 255,
                'city_name' => 'PESISIR BARAT',
            ),
            255 => 
            array (
                'id_city' => 256,
                'city_name' => 'PRINGSEWU',
            ),
            256 => 
            array (
                'id_city' => 257,
                'city_name' => 'TANGGAMUS',
            ),
            257 => 
            array (
                'id_city' => 258,
                'city_name' => 'TULANG BAWANG',
            ),
            258 => 
            array (
                'id_city' => 259,
                'city_name' => 'TULANG BAWANG BARAT',
            ),
            259 => 
            array (
                'id_city' => 260,
                'city_name' => 'WAY KANAN',
            ),
            260 => 
            array (
                'id_city' => 261,
                'city_name' => 'BENGKAYANG',
            ),
            261 => 
            array (
                'id_city' => 262,
                'city_name' => 'KAPUAS HULU',
            ),
            262 => 
            array (
                'id_city' => 263,
                'city_name' => 'KAYONG UTARA',
            ),
            263 => 
            array (
                'id_city' => 264,
                'city_name' => 'KETAPANG',
            ),
            264 => 
            array (
                'id_city' => 265,
                'city_name' => 'KUBU RAYA',
            ),
            265 => 
            array (
                'id_city' => 266,
                'city_name' => 'LANDAK',
            ),
            266 => 
            array (
                'id_city' => 267,
                'city_name' => 'MELAWI',
            ),
            267 => 
            array (
                'id_city' => 268,
                'city_name' => 'PONTIANAK',
            ),
            268 => 
            array (
                'id_city' => 269,
                'city_name' => 'SAMBAS',
            ),
            269 => 
            array (
                'id_city' => 270,
                'city_name' => 'SANGGAU',
            ),
            270 => 
            array (
                'id_city' => 271,
                'city_name' => 'SEKADAU',
            ),
            271 => 
            array (
                'id_city' => 272,
                'city_name' => 'SINGKAWANG',
            ),
            272 => 
            array (
                'id_city' => 273,
                'city_name' => 'SINTANG',
            ),
            273 => 
            array (
                'id_city' => 274,
                'city_name' => 'BARITO SELATAN',
            ),
            274 => 
            array (
                'id_city' => 275,
                'city_name' => 'BARITO TIMUR',
            ),
            275 => 
            array (
                'id_city' => 276,
                'city_name' => 'BARITO UTARA',
            ),
            276 => 
            array (
                'id_city' => 277,
                'city_name' => 'GUNUNG MAS',
            ),
            277 => 
            array (
                'id_city' => 278,
                'city_name' => 'KAPUAS',
            ),
            278 => 
            array (
                'id_city' => 279,
                'city_name' => 'KATINGAN',
            ),
            279 => 
            array (
                'id_city' => 280,
                'city_name' => 'KOTAWARINGIN BARAT',
            ),
            280 => 
            array (
                'id_city' => 281,
                'city_name' => 'KOTAWARINGIN TIMUR',
            ),
            281 => 
            array (
                'id_city' => 282,
                'city_name' => 'LAMANDAU',
            ),
            282 => 
            array (
                'id_city' => 283,
                'city_name' => 'MURUNG RAYA',
            ),
            283 => 
            array (
                'id_city' => 284,
                'city_name' => 'PALANGKA RAYA',
            ),
            284 => 
            array (
                'id_city' => 285,
                'city_name' => 'PULANG PISAU',
            ),
            285 => 
            array (
                'id_city' => 286,
                'city_name' => 'SERUYAN',
            ),
            286 => 
            array (
                'id_city' => 287,
                'city_name' => 'SUKAMARA',
            ),
            287 => 
            array (
                'id_city' => 288,
                'city_name' => 'BALANGAN',
            ),
            288 => 
            array (
                'id_city' => 289,
                'city_name' => 'BANJAR',
            ),
            289 => 
            array (
                'id_city' => 290,
                'city_name' => 'BANJARBARU',
            ),
            290 => 
            array (
                'id_city' => 291,
                'city_name' => 'BANJARMASIN',
            ),
            291 => 
            array (
                'id_city' => 292,
                'city_name' => 'BARITO KUALA',
            ),
            292 => 
            array (
                'id_city' => 293,
                'city_name' => 'HULU SUNGAI SELATAN',
            ),
            293 => 
            array (
                'id_city' => 294,
                'city_name' => 'HULU SUNGAI TENGAH',
            ),
            294 => 
            array (
                'id_city' => 295,
                'city_name' => 'HULU SUNGAI UTARA',
            ),
            295 => 
            array (
                'id_city' => 296,
                'city_name' => 'KOTABARU',
            ),
            296 => 
            array (
                'id_city' => 297,
                'city_name' => 'TABALONG',
            ),
            297 => 
            array (
                'id_city' => 298,
                'city_name' => 'TANAH BUMBU',
            ),
            298 => 
            array (
                'id_city' => 299,
                'city_name' => 'TANAH LAUT',
            ),
            299 => 
            array (
                'id_city' => 300,
                'city_name' => 'TAPIN',
            ),
            300 => 
            array (
                'id_city' => 301,
                'city_name' => 'BALIKPAPAN',
            ),
            301 => 
            array (
                'id_city' => 302,
                'city_name' => 'BERAU',
            ),
            302 => 
            array (
                'id_city' => 303,
                'city_name' => 'BONTANG',
            ),
            303 => 
            array (
                'id_city' => 304,
                'city_name' => 'KUTAI BARAT',
            ),
            304 => 
            array (
                'id_city' => 305,
                'city_name' => 'KUTAI KARTANEGARA',
            ),
            305 => 
            array (
                'id_city' => 306,
                'city_name' => 'KUTAI TIMUR',
            ),
            306 => 
            array (
                'id_city' => 307,
                'city_name' => 'PASER',
            ),
            307 => 
            array (
                'id_city' => 308,
                'city_name' => 'PENAJAM PASER UTARA',
            ),
            308 => 
            array (
                'id_city' => 309,
                'city_name' => 'SAMARINDA',
            ),
            309 => 
            array (
                'id_city' => 310,
            'city_name' => 'BULUNGAN (BULONGAN)',
            ),
            310 => 
            array (
                'id_city' => 311,
                'city_name' => 'MALINAU',
            ),
            311 => 
            array (
                'id_city' => 312,
                'city_name' => 'NUNUKAN',
            ),
            312 => 
            array (
                'id_city' => 313,
                'city_name' => 'TANA TIDUNG',
            ),
            313 => 
            array (
                'id_city' => 314,
                'city_name' => 'TARAKAN',
            ),
            314 => 
            array (
                'id_city' => 315,
                'city_name' => 'MAJENE',
            ),
            315 => 
            array (
                'id_city' => 316,
                'city_name' => 'MAMASA',
            ),
            316 => 
            array (
                'id_city' => 317,
                'city_name' => 'MAMUJU',
            ),
            317 => 
            array (
                'id_city' => 318,
                'city_name' => 'MAMUJU UTARA',
            ),
            318 => 
            array (
                'id_city' => 319,
                'city_name' => 'POLEWALI MANDAR',
            ),
            319 => 
            array (
                'id_city' => 320,
                'city_name' => 'BANTAENG',
            ),
            320 => 
            array (
                'id_city' => 321,
                'city_name' => 'BARRU',
            ),
            321 => 
            array (
                'id_city' => 322,
                'city_name' => 'BONE',
            ),
            322 => 
            array (
                'id_city' => 323,
                'city_name' => 'BULUKUMBA',
            ),
            323 => 
            array (
                'id_city' => 324,
                'city_name' => 'ENREKANG',
            ),
            324 => 
            array (
                'id_city' => 325,
                'city_name' => 'GOWA',
            ),
            325 => 
            array (
                'id_city' => 326,
                'city_name' => 'JENEPONTO',
            ),
            326 => 
            array (
                'id_city' => 327,
                'city_name' => 'LUWU',
            ),
            327 => 
            array (
                'id_city' => 328,
                'city_name' => 'LUWU TIMUR',
            ),
            328 => 
            array (
                'id_city' => 329,
                'city_name' => 'LUWU UTARA',
            ),
            329 => 
            array (
                'id_city' => 330,
                'city_name' => 'MAKASSAR',
            ),
            330 => 
            array (
                'id_city' => 331,
                'city_name' => 'MAROS',
            ),
            331 => 
            array (
                'id_city' => 332,
                'city_name' => 'PALOPO',
            ),
            332 => 
            array (
                'id_city' => 333,
                'city_name' => 'PANGKAJENE KEPULAUAN',
            ),
            333 => 
            array (
                'id_city' => 334,
                'city_name' => 'PAREPARE',
            ),
            334 => 
            array (
                'id_city' => 335,
                'city_name' => 'PINRANG',
            ),
            335 => 
            array (
                'id_city' => 336,
            'city_name' => 'SELAYAR (KEPULAUAN SELAYAR)',
            ),
            336 => 
            array (
                'id_city' => 337,
                'city_name' => 'SIDENRENG RAPPANG/RAPANG',
            ),
            337 => 
            array (
                'id_city' => 338,
                'city_name' => 'SINJAI',
            ),
            338 => 
            array (
                'id_city' => 339,
                'city_name' => 'SOPPENG',
            ),
            339 => 
            array (
                'id_city' => 340,
                'city_name' => 'TAKALAR',
            ),
            340 => 
            array (
                'id_city' => 341,
                'city_name' => 'TANA TORAJA',
            ),
            341 => 
            array (
                'id_city' => 342,
                'city_name' => 'TORAJA UTARA',
            ),
            342 => 
            array (
                'id_city' => 343,
                'city_name' => 'WAJO',
            ),
            343 => 
            array (
                'id_city' => 344,
                'city_name' => 'BAU-BAU',
            ),
            344 => 
            array (
                'id_city' => 345,
                'city_name' => 'BOMBANA',
            ),
            345 => 
            array (
                'id_city' => 346,
                'city_name' => 'BUTON',
            ),
            346 => 
            array (
                'id_city' => 347,
                'city_name' => 'BUTON UTARA',
            ),
            347 => 
            array (
                'id_city' => 348,
                'city_name' => 'KENDARI',
            ),
            348 => 
            array (
                'id_city' => 349,
                'city_name' => 'KOLAKA',
            ),
            349 => 
            array (
                'id_city' => 350,
                'city_name' => 'KOLAKA UTARA',
            ),
            350 => 
            array (
                'id_city' => 351,
                'city_name' => 'KONAWE',
            ),
            351 => 
            array (
                'id_city' => 352,
                'city_name' => 'KONAWE SELATAN',
            ),
            352 => 
            array (
                'id_city' => 353,
                'city_name' => 'KONAWE UTARA',
            ),
            353 => 
            array (
                'id_city' => 354,
                'city_name' => 'MUNA',
            ),
            354 => 
            array (
                'id_city' => 355,
                'city_name' => 'WAKATOBI',
            ),
            355 => 
            array (
                'id_city' => 356,
                'city_name' => 'BANGGAI',
            ),
            356 => 
            array (
                'id_city' => 357,
                'city_name' => 'BANGGAI KEPULAUAN',
            ),
            357 => 
            array (
                'id_city' => 358,
                'city_name' => 'BUOL',
            ),
            358 => 
            array (
                'id_city' => 359,
                'city_name' => 'DONGGALA',
            ),
            359 => 
            array (
                'id_city' => 360,
                'city_name' => 'MOROWALI',
            ),
            360 => 
            array (
                'id_city' => 361,
                'city_name' => 'PALU',
            ),
            361 => 
            array (
                'id_city' => 362,
                'city_name' => 'PARIGI MOUTONG',
            ),
            362 => 
            array (
                'id_city' => 363,
                'city_name' => 'POSO',
            ),
            363 => 
            array (
                'id_city' => 364,
                'city_name' => 'SIGI',
            ),
            364 => 
            array (
                'id_city' => 365,
                'city_name' => 'TOJO UNA-UNA',
            ),
            365 => 
            array (
                'id_city' => 366,
                'city_name' => 'TOLI-TOLI',
            ),
            366 => 
            array (
                'id_city' => 367,
                'city_name' => 'BOALEMO',
            ),
            367 => 
            array (
                'id_city' => 368,
                'city_name' => 'BONE BOLANGO',
            ),
            368 => 
            array (
                'id_city' => 369,
                'city_name' => 'GORONTALO',
            ),
            369 => 
            array (
                'id_city' => 370,
                'city_name' => 'GORONTALO UTARA',
            ),
            370 => 
            array (
                'id_city' => 371,
                'city_name' => 'POHUWATO',
            ),
            371 => 
            array (
                'id_city' => 372,
                'city_name' => 'BITUNG',
            ),
            372 => 
            array (
                'id_city' => 373,
            'city_name' => 'BOLAANG MONGONDOW (BOLMONG)',
            ),
            373 => 
            array (
                'id_city' => 374,
                'city_name' => 'BOLAANG MONGONDOW SELATAN',
            ),
            374 => 
            array (
                'id_city' => 375,
                'city_name' => 'BOLAANG MONGONDOW TIMUR',
            ),
            375 => 
            array (
                'id_city' => 376,
                'city_name' => 'BOLAANG MONGONDOW UTARA',
            ),
            376 => 
            array (
                'id_city' => 377,
                'city_name' => 'KEPULAUAN SANGIHE',
            ),
            377 => 
            array (
                'id_city' => 378,
            'city_name' => 'KEPULAUAN SIAU TAGULANDANG BIARO (SITARO)',
            ),
            378 => 
            array (
                'id_city' => 379,
                'city_name' => 'KEPULAUAN TALAUD',
            ),
            379 => 
            array (
                'id_city' => 380,
                'city_name' => 'KOTAMOBAGU',
            ),
            380 => 
            array (
                'id_city' => 381,
                'city_name' => 'MANADO',
            ),
            381 => 
            array (
                'id_city' => 382,
                'city_name' => 'MINAHASA',
            ),
            382 => 
            array (
                'id_city' => 383,
                'city_name' => 'MINAHASA SELATAN',
            ),
            383 => 
            array (
                'id_city' => 384,
                'city_name' => 'MINAHASA TENGGARA',
            ),
            384 => 
            array (
                'id_city' => 385,
                'city_name' => 'MINAHASA UTARA',
            ),
            385 => 
            array (
                'id_city' => 386,
                'city_name' => 'TOMOHON',
            ),
            386 => 
            array (
                'id_city' => 387,
                'city_name' => 'AMBON',
            ),
            387 => 
            array (
                'id_city' => 388,
                'city_name' => 'BURU',
            ),
            388 => 
            array (
                'id_city' => 389,
                'city_name' => 'BURU SELATAN',
            ),
            389 => 
            array (
                'id_city' => 390,
                'city_name' => 'KEPULAUAN ARU',
            ),
            390 => 
            array (
                'id_city' => 391,
                'city_name' => 'MALUKU BARAT DAYA',
            ),
            391 => 
            array (
                'id_city' => 392,
                'city_name' => 'MALUKU TENGAH',
            ),
            392 => 
            array (
                'id_city' => 393,
                'city_name' => 'MALUKU TENGGARA',
            ),
            393 => 
            array (
                'id_city' => 394,
                'city_name' => 'MALUKU TENGGARA BARAT',
            ),
            394 => 
            array (
                'id_city' => 395,
                'city_name' => 'SERAM BAGIAN BARAT',
            ),
            395 => 
            array (
                'id_city' => 396,
                'city_name' => 'SERAM BAGIAN TIMUR',
            ),
            396 => 
            array (
                'id_city' => 397,
                'city_name' => 'TUAL',
            ),
            397 => 
            array (
                'id_city' => 398,
                'city_name' => 'HALMAHERA BARAT',
            ),
            398 => 
            array (
                'id_city' => 399,
                'city_name' => 'HALMAHERA SELATAN',
            ),
            399 => 
            array (
                'id_city' => 400,
                'city_name' => 'HALMAHERA TENGAH',
            ),
            400 => 
            array (
                'id_city' => 401,
                'city_name' => 'HALMAHERA TIMUR',
            ),
            401 => 
            array (
                'id_city' => 402,
                'city_name' => 'HALMAHERA UTARA',
            ),
            402 => 
            array (
                'id_city' => 403,
                'city_name' => 'KEPULAUAN SULA',
            ),
            403 => 
            array (
                'id_city' => 404,
                'city_name' => 'PULAU MOROTAI',
            ),
            404 => 
            array (
                'id_city' => 405,
                'city_name' => 'TERNATE',
            ),
            405 => 
            array (
                'id_city' => 406,
                'city_name' => 'TIDORE KEPULAUAN',
            ),
            406 => 
            array (
                'id_city' => 407,
                'city_name' => 'BIMA',
            ),
            407 => 
            array (
                'id_city' => 408,
                'city_name' => 'DOMPU',
            ),
            408 => 
            array (
                'id_city' => 409,
                'city_name' => 'LOMBOK BARAT',
            ),
            409 => 
            array (
                'id_city' => 410,
                'city_name' => 'LOMBOK TENGAH',
            ),
            410 => 
            array (
                'id_city' => 411,
                'city_name' => 'LOMBOK TIMUR',
            ),
            411 => 
            array (
                'id_city' => 412,
                'city_name' => 'LOMBOK UTARA',
            ),
            412 => 
            array (
                'id_city' => 413,
                'city_name' => 'MATARAM',
            ),
            413 => 
            array (
                'id_city' => 414,
                'city_name' => 'SUMBAWA',
            ),
            414 => 
            array (
                'id_city' => 415,
                'city_name' => 'SUMBAWA BARAT',
            ),
            415 => 
            array (
                'id_city' => 416,
                'city_name' => 'ALOR',
            ),
            416 => 
            array (
                'id_city' => 417,
                'city_name' => 'BELU',
            ),
            417 => 
            array (
                'id_city' => 418,
                'city_name' => 'ENDE',
            ),
            418 => 
            array (
                'id_city' => 419,
                'city_name' => 'FLORES TIMUR',
            ),
            419 => 
            array (
                'id_city' => 420,
                'city_name' => 'KUPANG',
            ),
            420 => 
            array (
                'id_city' => 421,
                'city_name' => 'LEMBATA',
            ),
            421 => 
            array (
                'id_city' => 422,
                'city_name' => 'MANGGARAI',
            ),
            422 => 
            array (
                'id_city' => 423,
                'city_name' => 'MANGGARAI BARAT',
            ),
            423 => 
            array (
                'id_city' => 424,
                'city_name' => 'MANGGARAI TIMUR',
            ),
            424 => 
            array (
                'id_city' => 425,
                'city_name' => 'NAGEKEO',
            ),
            425 => 
            array (
                'id_city' => 426,
                'city_name' => 'NGADA',
            ),
            426 => 
            array (
                'id_city' => 427,
                'city_name' => 'ROTE NDAO',
            ),
            427 => 
            array (
                'id_city' => 428,
                'city_name' => 'SABU RAIJUA',
            ),
            428 => 
            array (
                'id_city' => 429,
                'city_name' => 'SIKKA',
            ),
            429 => 
            array (
                'id_city' => 430,
                'city_name' => 'SUMBA BARAT',
            ),
            430 => 
            array (
                'id_city' => 431,
                'city_name' => 'SUMBA BARAT DAYA',
            ),
            431 => 
            array (
                'id_city' => 432,
                'city_name' => 'SUMBA TENGAH',
            ),
            432 => 
            array (
                'id_city' => 433,
                'city_name' => 'SUMBA TIMUR',
            ),
            433 => 
            array (
                'id_city' => 434,
                'city_name' => 'TIMOR TENGAH SELATAN',
            ),
            434 => 
            array (
                'id_city' => 435,
                'city_name' => 'TIMOR TENGAH UTARA',
            ),
            435 => 
            array (
                'id_city' => 436,
                'city_name' => 'FAKFAK',
            ),
            436 => 
            array (
                'id_city' => 437,
                'city_name' => 'KAIMANA',
            ),
            437 => 
            array (
                'id_city' => 438,
                'city_name' => 'MANOKWARI',
            ),
            438 => 
            array (
                'id_city' => 439,
                'city_name' => 'MANOKWARI SELATAN',
            ),
            439 => 
            array (
                'id_city' => 440,
                'city_name' => 'MAYBRAT',
            ),
            440 => 
            array (
                'id_city' => 441,
                'city_name' => 'PEGUNUNGAN ARFAK',
            ),
            441 => 
            array (
                'id_city' => 442,
                'city_name' => 'RAJA AMPAT',
            ),
            442 => 
            array (
                'id_city' => 443,
                'city_name' => 'SORONG',
            ),
            443 => 
            array (
                'id_city' => 444,
                'city_name' => 'SORONG SELATAN',
            ),
            444 => 
            array (
                'id_city' => 445,
                'city_name' => 'TAMBRAUW',
            ),
            445 => 
            array (
                'id_city' => 446,
                'city_name' => 'TELUK BINTUNI',
            ),
            446 => 
            array (
                'id_city' => 447,
                'city_name' => 'TELUK WONDAMA',
            ),
            447 => 
            array (
                'id_city' => 448,
                'city_name' => 'ASMAT',
            ),
            448 => 
            array (
                'id_city' => 449,
                'city_name' => 'BIAK NUMFOR',
            ),
            449 => 
            array (
                'id_city' => 450,
                'city_name' => 'BOVEN DIGOEL',
            ),
            450 => 
            array (
                'id_city' => 451,
            'city_name' => 'DEIYAI (DELIYAI)',
            ),
            451 => 
            array (
                'id_city' => 452,
                'city_name' => 'DOGIYAI',
            ),
            452 => 
            array (
                'id_city' => 453,
                'city_name' => 'INTAN JAYA',
            ),
            453 => 
            array (
                'id_city' => 454,
                'city_name' => 'JAYAPURA',
            ),
            454 => 
            array (
                'id_city' => 455,
                'city_name' => 'JAYAWIJAYA',
            ),
            455 => 
            array (
                'id_city' => 456,
                'city_name' => 'KEEROM',
            ),
            456 => 
            array (
                'id_city' => 457,
            'city_name' => 'KEPULAUAN YAPEN (YAPEN WAROPEN)',
            ),
            457 => 
            array (
                'id_city' => 458,
                'city_name' => 'LANNY JAYA',
            ),
            458 => 
            array (
                'id_city' => 459,
                'city_name' => 'MAMBERAMO RAYA',
            ),
            459 => 
            array (
                'id_city' => 460,
                'city_name' => 'MAMBERAMO TENGAH',
            ),
            460 => 
            array (
                'id_city' => 461,
                'city_name' => 'MAPPI',
            ),
            461 => 
            array (
                'id_city' => 462,
                'city_name' => 'MERAUKE',
            ),
            462 => 
            array (
                'id_city' => 463,
                'city_name' => 'MIMIKA',
            ),
            463 => 
            array (
                'id_city' => 464,
                'city_name' => 'NABIRE',
            ),
            464 => 
            array (
                'id_city' => 465,
                'city_name' => 'NDUGA',
            ),
            465 => 
            array (
                'id_city' => 466,
                'city_name' => 'PANIAI',
            ),
            466 => 
            array (
                'id_city' => 467,
                'city_name' => 'PEGUNUNGAN BINTANG',
            ),
            467 => 
            array (
                'id_city' => 468,
                'city_name' => 'PUNCAK',
            ),
            468 => 
            array (
                'id_city' => 469,
                'city_name' => 'PUNCAK JAYA',
            ),
            469 => 
            array (
                'id_city' => 470,
                'city_name' => 'SARMI',
            ),
            470 => 
            array (
                'id_city' => 471,
                'city_name' => 'SUPIORI',
            ),
            471 => 
            array (
                'id_city' => 472,
                'city_name' => 'TOLIKARA',
            ),
            472 => 
            array (
                'id_city' => 473,
                'city_name' => 'WAROPEN',
            ),
            473 => 
            array (
                'id_city' => 474,
                'city_name' => 'YAHUKIMO',
            ),
            474 => 
            array (
                'id_city' => 475,
                'city_name' => 'YALIMO',
            ),
            475 => 
            array (
                'id_city' => 476,
                'city_name' => 'JAKARTA',
            ),
            476 => 
            array (
                'id_city' => 477,
                'city_name' => 'SOLO',
            ),
            477 => 
            array (
                'id_city' => 478,
                'city_name' => 'SERIRIT',
            ),
            478 => 
            array (
                'id_city' => 479,
                'city_name' => 'PADANGSIDEMPUAN',
            ),
            479 => 
            array (
                'id_city' => 480,
                'city_name' => 'WATU',
            ),
            480 => 
            array (
                'id_city' => 481,
                'city_name' => 'KAB. SEMARANG',
            ),
            481 => 
            array (
                'id_city' => 482,
                'city_name' => 'LARANTUKA',
            ),
            482 => 
            array (
                'id_city' => 483,
                'city_name' => 'DAMPANG',
            ),
            483 => 
            array (
                'id_city' => 484,
                'city_name' => 'CIBINONG',
            ),
            484 => 
            array (
                'id_city' => 485,
                'city_name' => 'SUNGAILIAT',
            ),
            485 => 
            array (
                'id_city' => 486,
                'city_name' => 'LAMPUNG',
            ),
            486 => 
            array (
                'id_city' => 487,
                'city_name' => 'PADANG BINTUNGAN',
            ),
            487 => 
            array (
                'id_city' => 488,
                'city_name' => 'PURWOKERTO',
            ),
        ));
        
        
    }
}
