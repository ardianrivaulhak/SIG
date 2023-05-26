import { siglogo, towards, ilac, kan } from "./image";

const headerText = {
    image: siglogo,
    width: 150,
    style: "margin30",
};

const subHeader = {
    text: "TESTING POLICY AT SIG LABORATORY",
    style: "subheader",
};

//   var tablecolumnpenawaran = (data) => {
//     return
//     {

//     }

const tablecolumn = {
    widths: ["*", "*"],
    aligment: "justify",
    columns: [
        {
            style: "term",
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        {
                            text: `Sample Preparation Terms`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `To ensure sample safety and the accuracy of test results, ensure that the test samples sent or submitted are in good standing and representative of your work, the recommendations from SIG are as follows:`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "Store the test samples in an appropriate container, avoiding leaking to prevent environmental contamination",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Prefer stronger materials for containers to prevent any damage or leakage during delivery",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Clarify the handling specifications, such as storage temperature, outside of the package",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Ensure the sample identity label is correct. This greatly influences the test results",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "SIG does not take responsibility for any damages incurred during the shipment process",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: `Sample Condition Terms`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "SIG will not accept samples that may have abnormal conditions except with the approval of the customer",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Samples for chemical and microbiological testing are required to be packaged separately",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Samples with the need for microbiological tests, carbon dioxide, organic compounds / permangant index value, moisture content, integrity, alcohol, peroxide number, iodine number, initial / final oxygen solubility, vitamins, initial / final total bacteria, free chlorine, complete weight and empty cavities are to be kept in separate packaging",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Samples with the need for testing vitamins, curcumin, red already, total carotene, and antioxidants should be maintained at a temperature and protected from direct sunlight",
                            alignment: "justify",
                        },
                    ],
                ],
            },
        },
        {
            style: "term",
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                body: [
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "Samples of raw materials should be attached with COA / MSDS of the product.",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "6.",
                            alignment: "right",
                        },
                        {
                            text: "Testing of weight uniformity and volume uniformity requires a minimum 25 packages to be tested.",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "7.",
                            alignment: "right",
                        },
                        {
                            text: "Testing of deliverable volume requires a minimum 10 packages to be tested and equipped with product volume claim information",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "8.",
                            alignment: "right",
                        },
                        {
                            text: "Antimicrobial testing requires a minimum of 120 ml or in mg per one test microbe",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "9.",
                            alignment: "right",
                        },
                        {
                            text: "Testing the effectiveness of preservatives requires a minimum of 120 ml or in mg per one test microbe",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "10.",
                            alignment: "right",
                        },
                        {
                            text: "Legionella testing requires a minimum of 1000 ml",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "11.",
                            alignment: "right",
                        },
                        {
                            text: "If the amount of sample does not meet the conditions mentioned, SIG will not accept any complaints or requests for re-testing",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: `Sample Delivery Terms`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Please send the test sample accompanied by an offer letter, as well as the completed customer data form to either of the following locations:`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Head Office & Laboratory`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Graha SIG Jl. Rasamala No. 20 Taman Yasmin Kota Bogor, Jawa Barat 16113, +62 (251) 7532348`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Jakarta`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Jl. Percetakan Negara No. 52 B RT 06/RW 01 Rawasari, Cempaka Putih, Jakarta, +62 (21) 21479292`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Surabaya Laboratory`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `AMG Tower Lt. 12 Jl. Dukuh Menanggal Gayungan, Kota Surabaya, Jawa Timur 60234, +62 (31) 82531288`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Semarang`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Jl. Bina Remaja No. 1A (Ruko A) Banyumanik, Kota Semarang, Jawa Tengah 50264, +62 (24) 76403685`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Yogyakarta Representative`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `0896 4856 9422 (Arifin)`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                ],
            },
        },
    ],
};

const tablecolumn3 = {
    widths: ["*", "*"],
    aligment: "justify",
    columns: [
        {
            style: ["term",'fontsize8'],
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        {
                            text: `Ketentuan Persiapan Sampel`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Untuk memastikan keamanan sampel dan keakuratan hasil uji, pastikan sampel uji yang dikirim maupun diserahkan dalam keadaan baik dan mewakili, sehingga kami SIG menyarankan untuk:`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "Simpan sampel uji pada wadah yang semestinya, tertutup rapat dan tidak bocor, hal tersebut guna menghindari adanya kontaminasi lingkungan",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Gunakan wadah dengan material yang kuat, sehingga saat proses pengiriman tidak mengalami kerusakan maupun kebocoran",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Harap infokan spesifik penanganan pada sampel uji yang membutuhkan tempat dengan penanganan khusus seperti suhu penyimpanan pada luar kemasan",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Pastikan label identitas sampel tidak salah, hal ini berpengaruh penting pada hasil uji",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "SIG tidak bertanggung jawab atas kerusakan yang terjadi akibat proses pengiriman",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: `Ketentuan Kondisi Sampel`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "SIG tidak menerima sampel dengan kondisi abnormal kecuali dengan persetujuan pelanggan",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Sampel dengan kebutuhan pengujian kimia dan mikrobiologi wajib memberikan kemasan terpisah",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Sampel dengan kebutuhan uji mikrobiologi, karbondioksida, senyawa organik/nilai index permanganat, kadar air, keutuhan, alkohol, bilangan peroksida, bilangan iod, kelarutan oksigen, vitamin, total bakteri, klorin bebas, bobot tuntas, rongga kosong, dan total organik karbon baiknya dalam kemasan terpisah",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Sampel dengan kebutuhan uji vitamin, kurkumin, merah sudan, total karoten, dan antioksidan sebaiknya dalam keadaan suhu terjaga  dan terlindung dari paparan sinar matahari langsung",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "Sampel bahan baku sebaiknya dilengkapi dengan melampirkan COA/MSDS produk dan info terkait kategori produk (pangan/farmasi/kosmetik)",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "6.",
                            alignment: "right",
                        },
                        {
                            text: "Pengujian keseragaman bobot dan keseragaman volume membutuhkan minimal 25 kemasan",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "7.",
                            alignment: "right",
                        },
                        {
                            text: "Pengujian volume terpindahkan membutuhkan minimal 10 kemasan dan dilengkapi  informasi klaim volume produk",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "8.",
                            alignment: "right",
                        },
                        {
                            text: "Pengujian antimikroba membutuhkan minimal 120 ml atau gram per satu mikroba uji",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "9.",
                            alignment: "right",
                        },
                        {
                            text: "Pengujian efektivitas pengawet membutuhkan minimal 120  ml atau gram per satu mikroba uji",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "10.",
                            alignment: "right",
                        },
                        {
                            text: "Pengujian Legionella membutuhkan minimal 1000 ml",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "11.",
                            alignment: "right",
                        },
                        {
                            text: "Apabila jumlah sampel uji tidak memenuhi ketentuan diatas, SIG tidak menerima segala bentuk keluhan dan permintaan uji ulang.",
                            alignment: "justify",
                        },
                    ],
                    
                ],
            },
        },
        {
            style: ["term",'fontsize8'],
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                body: [
                    [
                        {
                            text: "Ketentuan Pengiriman Sampel",
                            alignment: "justify",
                            colSpan: 2,
                            style: 'bold'
                        },
                        {},
                    ],
                    [
                        {
                            text: "Kirimkan sampel uji disertai surat penawaran dan formulir data pelanggan yang telah diisi ke pilihan alamat berikut:",
                            alignment: "justify",
                            colSpan: 2
                        },
                        {
                        },
                    ],
                    [
                        {
                            text: `SIG Kantor Pusat & Laboratorium`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Graha SIG Jl. Rasamala No. 20 Taman Yasmin Kota Bogor, Jawa Barat 16113, +62 (251) 7532348`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Jakarta`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Jl. Percetakan Negara No. 52 B RT 06/RW 01 Rawasari, Cempaka Putih, Jakarta, +62 (21) 21479292`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Surabaya Laboratorium`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `AMG Tower Lt. 12 Jl. Dukuh Menanggal Gayungan, Kota Surabaya, Jawa Timur 60234, +62 (31) 82531288`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Perwakilan Semarang`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `+62 (813) 91706805 (Ery)`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Perwakilan Yogyakarta`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `+62 (896) 48569422 (Arifin)`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Ketentuan Penyimpanan Sampel`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Penyimpanan sampel suhu normal atau ruang akan dilakukan selama 2 bulan dan sampel suhu dingin atau beku akan disimpan selama 1 bulan, diluar itu SIG tidak bertanggung jawab atas kondisi sampel`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Ketentuan Pembayaran`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Setiap pelanggan wajib membayar pelunasan biaya pengujian sebelum terbit hasil uji, kecuali pelanggan yang telah memperoleh fasilitas termin pembayaran maka pembayarannya dapat dilakukan sesuai tanggal jatuh tempo. Permintaan revisi invoice dapat dilakukan selambat-lambatnya 30 hari setelah tanggal terbit invoice`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Ketentuan Keluhan`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Keluhan hasil uji dapat dilayani maksimal tidak lebih dari 1 bulan tanggal sertifikat terbit, SIG hanya melayani 1 kali permintaan uji ulang dengan memprioritaskan uji ulang menggunakan sampel yang diretain, SIG tidak melayani keluhan atas hasil uji swab test yang proses samplingnya dilakukan oleh pelanggan sendiri, SIG tidak melayani keluhan untuk pengujian mikrobiologi, keseragaman bobot, dan keseragaman volume, SIG tidak melayani keluhan untuk sampel yang kemasannya abnormal/rusak saat diterima`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Ketentuan Umum`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Estimasi lama pengujian dihitung keesokan harinya bila sampel diterima di kantor Bogor diatas pukul 12:00 siang dan atau di kantor cabang maupun perwakilan SIG lainnya. Pembatalan pengujian dapat dilakukan maksimal 1x24 jam setelah kontrak dibuat. Pembatalan pengujian tidak berlaku untuk pengujian mikrobiologi, logam berat, dan pada pengujian dengan status urgent dan atau very urgent`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                ],
            },
        },
    ],
};

const tablecolumn4 = {
    widths: ["*", "*"],
    aligment: "justify",
    columns: [
        {
            style: ["term",'fontsize8'],
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        {
                            text: `Sample Preparation Terms`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `To ensure sample safety and the accuracy of test results, ensure that the test samples sent or submitted are in good standing and representative of your work, the recommendations from SIG are as follows:`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "Store the test samples in an appropriate container, avoiding leaking to prevent environmental contamination",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Prefer stronger materials for containers to prevent any damage or leakage during delivery",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Clarify the handling specifications, such as storage temperature, outside of the package",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Ensure the sample identity label is correct. This greatly influences the test results",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "SIG Laboratory does not take responsibility for any damages incurred during the shipment process",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: `Sample Condition Terms`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: "1.",
                            alignment: "right",
                        },
                        {
                            text: "SIG Laboratory will not accept samples that may have abnormal conditions except with the approval of the customer",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "2.",
                            alignment: "right",
                        },
                        {
                            text: "Samples for chemical and microbiological testing are required to be packaged separately",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "3.",
                            alignment: "right",
                        },
                        {
                            text: "Samples with the need for microbiological tests, carbon dioxide, organic compounds / permangant index value, moisture content, integrity, alcohol, peroxide number, iodine number, initial / final oxygen solubility, vitamins, initial / final total bacteria, free chlorine, complete weight and empty cavities are to be kept in separate packaging",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "4.",
                            alignment: "right",
                        },
                        {
                            text: "Samples with the need for testing vitamins, curcumin, sudan red, total carotene, and antioxidants should be maintained at a temperature and protected from direct sunlight",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "5.",
                            alignment: "right",
                        },
                        {
                            text: "Samples of raw materials should be attached with COA / MSDS of the product.",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "6.",
                            alignment: "right",
                        },
                        {
                            text: "Testing of weight uniformity and volume uniformity requires a minimum 25 packages to be tested.",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "7.",
                            alignment: "right",
                        },
                        {
                            text: "Testing of deliverable volume requires a minimum 10 packages to be tested",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "8.",
                            alignment: "right",
                        },
                        {
                            text: "Antimicrobial testing requires a minimum of 120 ml (or in mg).",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "9.",
                            alignment: "right",
                        },
                        {
                            text: "Testing the effectiveness of preservatives requires a minimum of 600ml (or in mg).",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "10.",
                            alignment: "right",
                        },
                        {
                            text: "Legionella testing requires a minimum of 1000 ml.",
                            alignment: "justify",
                        },
                    ],
                    [
                        {
                            text: "11.",
                            alignment: "right",
                        },
                        {
                            text: "If the amount of sample does not meet the conditions mentioned, SIG Laboratory will not accept any complaints or requests for re- testing.",
                            alignment: "justify",
                        },
                    ],
                    
                ],
            },
        },
        {
            style: ["term",'fontsize8'],
            layout: "noBorders",
            table: {
                widths: [15, 200],
                headerRows: 2,
                body: [
                    [
                        {
                            text: "Sample Delivery Terms",
                            alignment: "justify",
                            colSpan: 2,
                            style: 'bold'
                        },
                        {},
                    ],
                    [
                        {
                            text: "Please send the test sample accompanied by an offer letter, as well as the completed customer data form to either of the following locations:",
                            alignment: "justify",
                            colSpan: 2
                        },
                        {
                        },
                    ],
                    [
                        {
                            text: `SIG Head Office & Laboratory`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Graha SIG Jl. Rasamala No. 20 Taman Yasmin Kota Bogor, Jawa Barat 16113, +62 (251) 7532348`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Jakarta Branch`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Jl. Percetakan Negara No. 52 B RT 06/RW 01 Rawasari, Cempaka Putih, Jakarta, +62 (21) 21479292`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `SIG Surabaya Branch`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `AMG Tower Lt. 12 Jl. Dukuh Menanggal Gayungan, Kota Surabaya, Jawa Timur 60234, +62 (31) 82531288`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Semarang Representative`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `+62 (813) 91706805 (Ery)`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Yogyakarta Representative`,
                            style: "bold",
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `+62 (896) 48569422 (Arifin)`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Sample Storage Requirements`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Samples kept at normal or room temperatures will be stored for 2 months and samples kept at cold or frozen temperatures are stored for 1 month under the care of SIG Laboratory. Outside of this timeframe, SIG will not be responsible for the condition of the sample.`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Terms of Payment`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `All customers are required to pay the testing fees in full before the test results can be published, except for customers who have obtained a payment term facility, allowing the payment to be settled within a given date. Invoice revision requests can be made no later than 30 days after the initial invoice issuance date.`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Terms of Complaint`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Complaints can be addressed no later than 1 month after the date of the issuance of the certificate. SIG Laboratory provides only 1 re-test, using the samples retained within the SIG Laboratory. SIG Laboratory does not address complaints regarding the result of swab tests, carried out by the customers themselves. In addition, SIG Laboratory will not address complaints for microbial testing, weight uniformity and volume uniformity testing. SIG Laboratory will not address complaints for samples where the condition of the packaging is abnormal or damaged when received.`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `General Requirements`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `The estimated length of testing is accounted for the next day if the sample is received at the Customer Service of Bogor Office as well as other branches and representatives later than 12:00. Cancellation of testing cannot be made for microbial testing, heavy metals, and testing sent as "urgent" and/or "very urgent".`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `Cancellation of testing`,
                            style: ["bold", "margintop5"],
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                    [
                        {
                            text: `cannot be made for microbial testing, heavy metals and contracts sent as 'urgent' and / or 'very urgent'.`,
                            colSpan: 2,
                            alignment: "justify",
                        },
                        {},
                    ],
                ],
            },
        },
    ],
};

const din = {
    normal: "/assets/fonts/DIN-Light.otf",
    bold: "/assets/fonts/DIN-Bold.otf",
};

const footer = (contractype) => {
    return {
        columns: [
            {
                layout: "noBorders",
                style: "tested",
                table: {
                    widths: ["*", "*", 50, 120],
                    body: [
                        [
                            {
                                image: towards,
                                width: 90,
                                style: "marginminussetengah",
                            },
                            {
                                text: `PT SARASWANTI INDO GENETECH
                                Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                Bogor 16113 INDONESIA
                                Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                Fax +62 251 7540 927
                                www.siglaboratory.com`,
                                alignment: "left",
                                style: "marginminus",
                            },
                            {
                                image: ilac,
                                width: 40,
                                style: "marginminus",
                                alignment: "right",
                            },
                            {
                                image: kan,
                                width: 60,
                                style: "marginminussetengahaja",
                                alignment: "right",
                            },
                        ],
                    ],
                },
            },
        ],
    };
};

const styles = {
    tableNoMargin: {
        margin: [0, 0, 0, 0],
        padding: [0, 0, 0, 0],
    },
    margintop5: {
        margin: [0, 5, 0, 0],
    },
    header: {
        bold: true,
        width: 150,
    },
    borderOut: {
        border: `1px solid #000`,
    },
    fontsize8: {
        fontSize: 8,
    },
    marginBawah: {
        margin: [0, 0, 0, 20],
    },
    marginDalam: {
        margin: [0, 10, 0, 10],
    },
    bold: {
        bold: true,
    },
    fontsize: {
        fontSize: 9,
    },
    marginawal: {
        margin: [0, 30, 0, 0],
    },
    subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 20, 0, 0],
    },
    tableExample: {
        margin: [10, 15, 0, 0],
    },
    tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
    },
    marginatascuk: {
        margin: [0, 0, 0, 150],
    },
    testing: {
        margin: [100, 30, 25, 0],
    },
    testing2: {
        margin: [90, 30, 25, 0],
    },
    term: {
        fontSize: 9,
        margin: 0,
    },
    termpenawaran: {
        fontSize: 10,
        margin: [-30, 0, 0, 10],
    },
    margin10: {
        margin: [10, 0, 10, 0],
    },
    marginkiri10: {
        margin: [10, 0, 0, 0],
    },
    margin20: {
        margin: [20, 0, 20, 0],
    },
    margin15: {
        margin: [15, 0, 15, 0],
    },
    marginatas30: {
        margin: [0, 30, 0, 0],
    },
    marginkirikanan40: {
        margin: [200, 0, 200, 0],
    },
    marginatas10: {
        margin: [0, 10, 0, 0],
    },
    marginatas0: {
        margin: [0, 0, 0, 0],
    },
    marginatas20: {
        margin: [0, 20, 0, 0],
    },
    marginatas40: {
        margin: [0, 20, 0, 0],
    },
    marginbawah30: {
        margin: [0, 0, 0, 30],
    },
    margin30: {
        margin: [30, 0, 30, 0],
    },

    marginminus: {
        margin: [0, 0, 0, 10],
        fontSize: 6,
    },
    marginminussetengah: {
        margin: [40, 0, 0, 0],
    },
    verticalmiddle: {
        verticalAlign: "middle",
    },
    marginminussetengahaja: {
        margin: [0, 0, 23, 0],
    },
    marginBawahinDong: {
        margin: [0, 0, 0, 60],
    },
    fontsize6: {
        fontSize: 6,
    },
    fontsize10: {
        fontSize: 10,
    },
};

export { headerText, subHeader, tablecolumn, footer, styles, din, tablecolumn3, tablecolumn4 };
