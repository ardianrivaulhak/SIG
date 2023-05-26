import { FuseNavigation } from '@fuse/types';

export const edocs: FuseNavigation[] = [
    {
        id: 'application',
        title: 'EDOC',
        type: 'group',
        // icon    : 'apps',
        children: [
            {
                id: 'dashboard',
                title: 'dashboard',
                type: 'item',
                icon: 'bar_chart',
                url: '/edoc/documents',
                exactMatch: true
            },
            {
                id: 'add',
                title: 'New Document',
                type: 'item',
                icon: 'add_box',
                url: '/edoc/add-new'
            },
            {
                id: 'application',
                title: 'EDOC',
                type: 'group',
                // icon    : 'apps',
                children: [
                    {
                        id: 'panduan-mutu',
                        title: 'Panduan Mutu',
                        type: 'item',
                        icon: 'group',
                        url: '/edoc/documents/panduan-mutu'
                    },
                    {
                        id: 'prosedur-pelaksanaan',
                        title: 'Prosedur Pelaksanaan',
                        type: 'item',
                        icon: 'group',
                        url: '/edoc/documents/prosedur-pelaksanaan'
                    },
                    {
                        id: 'instruks_ kerja',
                        title: 'Instruksi Kerja',
                        type: 'group',
                        // icon    : 'apps',
                        children: [
                            {
                                id: 'analitik',
                                title: 'Analitik',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/analitik'
                            },
                            {
                                id: 'bioteknologi',
                                title: 'Bioteknologi',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/bioteknologi'
                            },
                            {
                                id: 'farmasi',
                                title: 'Farmasi',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/farmasi'
                            },
                            {
                                id: 'gc',
                                title: 'GC',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/gc'
                            },
                            {
                                id: 'gc-msms',
                                title: 'GC-MS/MS',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/gc-msms'
                            },
                            {
                                id: 'logam',
                                title: 'Logam',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/logam'
                            }, {
                                id: 'mainan',
                                title: 'Mainan',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/mainan'
                            }, {
                                id: 'sampling',
                                title: 'Sampling',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/sampling'
                            }, 
                            {
                                id: 'spektrofotometri',
                                title: 'Spektrofotometri',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/spektrofotometri'
                            },
                            {
                                id: 'umursimpan',
                                title: 'Umur Simpan',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/umursimpan'
                            },
                            {
                                id: 'toksisitas',
                                title: 'Toksisitas',
                                type: 'item',
                                icon: 'group',
                                url: '/edoc/documents/toksisitas'
                            },
                        ]
                    },
                ]
            }
            
        ]
    },
];