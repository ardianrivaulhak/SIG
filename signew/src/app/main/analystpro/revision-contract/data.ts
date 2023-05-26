export const typeContract = [
    {
        id: 1,
        type: "Bogor",
    },
    {
        id: 2,
        type: "Jakarta",
    },
    {
        id: 3,
        type: "Package",
    },
    {
        id: 4,
        type: "Surabaya",
    },
    {
        id: 5,
        type: "Semarang",
    },
    {
        id: 6,
        type: "Yogyakarta",
    },
];

export const contractSet = [
    {
        id: 1,
        value: "Government",
    },
    {
        id: 2,
        value: "Non Government",
    },
];

export var formContract = {
    contract_id: null,
    contractcategory: null,
    no_penawaran: null,
    penawaran: null,
    no_po: null,
    sample_source: null,
    idch: null,
    clienthandling: null,
    alamatcustomer: null,
    internal_desc: null,
    sample: [],
    sampleremove: [],
    totalhargakontrak: 0,
    biayasample: 0,
    datasampling: [],
    dataakg: [],
    biayaakg: 0,
    discount_conv: null,
    discount_price: 0,
    subtotal: 0,
    ppn: 0,
    totaltanpappn: 0,
    uangmuka: 0,
    sisapembayaran: null,
    voucher: null,
    alasan: null,
    external_desc: null
};

export const statuspengujian = [
    {
        id: 1,
        status: "Normal",
        value: 1,
        disc: 0,
    },
    {
        id: 2,
        status: "Urgent",
        value: 2,
        disc: 0,
    },
    {
        id: 3,
        status: "Very Urgent",
        value: 3,
        disc: 0,
    },
    {
        id: 4,
        status: "Custom 2 Hari",
        value: 4,
        disc: 0,
    },
    {
        id: 5,
        status: "Custom 1 Hari",
        value: 5,
        disc: 0,
    },
];

export const normalstatuspengujian = [
    {
        id: 1,
        status: "Normal",
        value: 1,
        disc: 0,
    },
    {
        id: 2,
        status: "Urgent",
        value: 2,
        disc: 0,
    },
    {
        id: 3,
        status: "Very Urgent",
        value: 3,
        disc: 0,
    },
    {
        id: 4,
        status: "Custom 2 Hari",
        value: 4,
        disc: 0,
    },
    {
        id: 5,
        status: "Custom 1 Hari",
        value: 5,
        disc: 0,
    },
];

export const dataformathasil = [
    { id: 1, hasil: "Simplo" },
    { id: 2, hasil: "Duplo" },
    { id: 3, hasil: "Triplo" },
];

export const dataselectparameter = {
    page: 1,
    search: null,
};

export const setprice = (value, text) => {
    return value * text;
};

export const isImportantForm = [
    {
        title: "Tujuan Pengujian",
        values: "tujuanpengujian",
    },
    {
        title: "Status Pengujian",
        values: "statuspengujian",
    },
    {
        title: "Matriks",
        values: "subcatalogue",
    },
    {
        title: "Tgl Input",
        values: "tgl_input",
    },
    {
        title: "Tgl Selesai",
        values: "tgl_selesai",
    },
];

export const importantFormContractRev = [
    {
        title: "Contract Category",
        values: "contract_category",
    },
    {
        title: "Sample Source",
        values: "sample_source",
    },
    {
        title: "Customers Handle",
        values: "idch",
    },
    {
        title: "Cust Address",
        values: "alamatcustomer",
    },
    {
        title: "Alasan",
        values: "alasan",
    }
];

export var formSample = {
    index: null,
    tujuanpengujian: null,
    statuspengujian: null,
    subcatalogue: null,
    tgl_input: null,
    tgl_selesai: null,
    tgl_produksi: null,
    tgl_kadaluarsa: null,
    factoryname: null,
    factory_address: null,
    trademark: null,
    lotno: null,
    jeniskemasan: null,
    batchno: null,
    no_notifikasi: null,
    no_pengajuan: null,
    no_registrasi: null,
    no_principalCode: null,
    certificate_info: "0",
    ket_lain: null,
    kode_sample: null,
    no_sample: null,
    nonpaket: [],
    paketparameter: [],
    paketpkm: [],
    discount_sample: null,
    price_sample: null,
    price_original: null,
    discount_conv: null,
    sample_name: null,
};
