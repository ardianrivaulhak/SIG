export interface Labform {
    id: number;
    id_parameteruji: number;
    simplo: string;
    duplo: string;
    triplo: string;
    hasiluji: string;
    id_standart: number;
    id_lod: number;
    id_lab: number;
    id_unit: number;
    id_metode: number;
    format_hasil?: any;
    id_sample: number;
    id_team?: any;
    status: number;
    position?: any;
    deleted_at?: any;
    price: number;
    info: string;
    n: string;
    m: string;
    c: string;
    mm: string;
    lod: Lod;
    lab: Lab;
    standart: Standart;
    metode: Metode;
    unit: Unit;
    parameter_condition_lab: Parameterconditionlab[];
    preparation_approve: Parameterconditionlab[];
    transaction_sample: Transactionsample;
  }
  
  export interface Transactionsample {
    id: number;
    kode_sample: string;
    sample_name: string;
    no_sample: string;
    batch_number?: any;
    tgl_input: string;
    tgl_selesai: string;
    tgl_estimasi_lab: string;
    nama_pabrik?: any;
    alamat_pabrik?: any;
    no_notifikasi?: any;
    no_pengajuan?: any;
    no_registrasi?: any;
    no_principalcode?: any;
    nama_dagang: string;
    lot_number?: any;
    jenis_kemasan?: any;
    tgl_produksi: string;
    tgl_kadaluarsa: string;
    price: number;
    discount?: any;
    id_tujuanpengujian: number;
    id_statuspengujian: number;
    id_subcatalogue: number;
    id_contract: number;
    certificate_info: number;
    subcatalogue: Subcatalogue;
    statuspengujian: Statuspengujian;
    tujuanpengujian: Statuspengujian;
    kontrakuji: Kontrakuji;
    images: any[];
  }

  export interface Photo {
      id: number;
      id_sample: number;
      photo: String;
      insert_user: number;
  }
  
  export interface Kontrakuji {
    id_kontrakuji: number;
    contract_no: string;
    status_contract: string;
    contract_type: number;
    id_customers_handle: number;
    id_contract_category: number;
    contract_category: Contractcategory;
    customers_handle: Customershandle;
  }
  
  export interface Customershandle {
    idch: number;
    id_cp: number;
    id_customer: number;
    email: string;
    phone: string;
    fax: string;
    telp: string;
    customers: Customers;
  }
  
  export interface Customers {
    id_customer: number;
    kode_customer: string;
    customer_name: string;
    npwp: string;
    description: string;
    status?: any;
    active?: any;
  }
  
  export interface Contractcategory {
    id: number;
    title: string;
    category_code: string;
    cover_code: string;
    lhu_code: string;
    sample_code: string;
    description: string;
    active: number;
  }
  
  export interface Statuspengujian {
    id: number;
    name: string;
    description?: any;
  }
  
  export interface Subcatalogue {
    id_sub_catalogue: number;
    id_catalogue: number;
    sub_catalogue_code: string;
    sub_catalogue_name: string;
    description: string;
  }
  
  export interface Parameterconditionlab {
    id_condition_contract: number;
    contract_id: number;
    sample_id: number;
    parameter_id: number;
    user_id: number;
    status: number;
    inserted_at: string;
    groups: string;
    position: number;
    user: User;
  }
  
  export interface User {
    user_id: number;
    employee_name: string;
  }
  
  export interface Unit {
    id: number;
    kode_unit: string;
    nama_unit: string;
    description?: any;
    active: number;
  }
  
  export interface Metode {
    id: number;
    kode_metode: string;
    metode: string;
    keterangan: string;
  }
  
  export interface Standart {
    id: number;
    kode_standart: string;
    nama_standart: string;
    ket_standart: string;
  }
  
  export interface Lab {
    id: number;
    kode_lab: string;
    nama_lab: string;
    ket_lab: string;
  }
  
  export interface Lod {
    id: number;
    kode_lod: string;
    nama_lod: string;
    ket_lod: string;
    active?: any;
  }
