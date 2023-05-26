
export interface Martial {
    text: string;
    id: string;
  }

export interface Gender {
    text: string;
    id: string
}

export interface Religion {
    text: string;
    id: string
}

export interface City {
    id_city: string;
    city_name: string
}

export interface Level {
    id_level: string;
    level_name: string;
}

export interface Bagian {
    id_div: string;
    division_name: string;
}

export interface Employee_status {
    id: string;
    status: string;
}

export const dataEmployeeStatus: Employee_status[] = [
    {
        id: '0',
        status: 'Not Set',
    },
    {
        id: '1',
        status: 'Tetap',
    },
    {
        id: '2',
        status: 'Kontrak',
    },
    {
        id: '3',
        status: 'Honorer',
    }
]

export const dataMartial: Martial[] = [
    {
        text: 'Single',
        id: 'Belum Menikah' 
    },
    {
        text: 'Married',
        id:'Menikah'
    }];


export const dataGender: Gender[] = [
    {
        text: 'Not Set',
        id: 'Not Set'
    },
    {
        text: 'Male',
        id: 'Male'
    },
    {
        text: 'Female',
        id: 'Female'
    }
];

export const dataReligion: Religion[] = [
    {
        text: 'Not Set',
        id: 'Not Set'
    },
    {
        text: 'Islam',
        id: 'Islam'
    },
    {
        text: 'Katolik',
        id: 'Katolik'
    },
    {
        text: 'Protestan',
        id: 'Protestan'
    },
    {
        text: 'Budha',
        id: 'Budha'
    },
    {
        text: 'Hindu',
        id: 'Hindu'
    },
]