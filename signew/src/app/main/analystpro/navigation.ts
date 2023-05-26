import { FuseNavigation } from '@fuse/types';
export const analystpro_nav: FuseNavigation[] = [
    {
        id: 'application',
        title: 'analyst pro',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                icon: 'bar_chart',
                url: '/analystpro/dashboard',
                exactMatch: true
            },
            {
                id: 'contract',
                title: 'Kontrak Ujii',
                type: 'item',
                icon: 'assignment',
                url: '/analystpro/contract',
            },
            {
                id: 'kendali',
                title: 'Kendali',
                type: 'item',
                icon: 'assignment',
                url: '/analystpro/kendali',
            },
            {
                id: 'preparation',
                title: 'Preparation',
                type: 'item',
                icon: 'assignment',
                url: '/analystpro/preparation',
            }, 
            {
                id: 'sample-uji',
                title: 'Sample Uji',
                type: 'item',
                icon: 'assignment',
                url: '/analystpro/sample-uji',
            }, 
            {
                id: 'lab-pengujian',
                title: 'Lab Pengujian',
                type: 'item',
                icon: 'assignment',
                url: '/analystpro/lab-pengujian',
            }, 
            {
                id: 'certificate',
                title: 'Certificate',
                type: 'item',
                icon: 'description',
                url: '/analystpro/certificate',
            },
            {
                id: 'keuangan',
                title: 'Keuangan',
                type: 'item',
                icon: 'featured_play_list',
                url: '/analystpro/keuangan',
            },
            // {
            //     id: 'datacontract',
            //     title: 'Contract Data',
            //     type: 'item',
            //     icon: 'list_alt',
            //     url: '/marketing/data-contract',
            // },
            // {
            //     id: 'archive',
            //     title: 'LHU Archive',
            //     type: 'item',
            //     icon: 'chrome_reader_mode',
            //     url: '/marketing/lhu-archive',
            // },
            // {
            //     id: 'certificate',
            //     title: 'Certificate',
            //     type: 'item',
            //     icon: 'ballot',
            //     url: '/marketing/certificate',
            // },
            // {
            //     id: 'datacontract',
            //     title: 'Contract Data',
            //     type: 'item',
            //     icon: 'collections_bookmark',
            //     url: '/marketing/data-contract',
            // },
            // {
            //     id: 'history',
            //     title: 'History',
            //     type: 'item',
            //     icon: 'event_note',
            //     url: '/marketing/history',
            // },
           
            {
                id: 'master',
                title: 'Master',
                type: 'group',
                icon: 'apps',
                children: [
                    {
                        id: 'customers',
                        title: 'Customers',
                        type: 'item',
                        icon: 'assignment_ind',
                        url: '/analystpro/customers',
                    },
                    {
                        id: 'contactperson',
                        title: 'Contact Person',
                        type: 'item',
                        icon: 'assignment_ind',
                        url: '/analystpro/contact-person',
                    },
                    {
                        id: 'address',
                        title: 'Address',
                        type: 'item',
                        icon: 'assignment_ind',
                        url: '/analystpro/customeraddress'
                    },
                    {
                        id: 'taxaddress',
                        title: 'Tax Address',
                        type: 'item',
                        icon: 'assignment_ind',
                        url: '/analystpro/customer-taxaddress'
                    },
                    {
                        id: 'catalogue',
                        title: 'Catalogue',
                        type: 'item',
                        icon: 'credit_card',
                        url: '/analystpro/catalogue'
                    },
                    {
                        id: 'subcatalogue',
                        title: 'Sub Catalogue',
                        type: 'item',
                        icon: 'card_travel',
                        url: '/analystpro/subcatalogue'
                    },
                    {
                        id: 'parameteruji',
                        title: 'Parameter Uji',
                        type: 'item',
                        icon: 'bug_report',
                        url: '/analystpro/parameteruji'
                    },
                    {
                        id: 'standart',
                        title: 'Standart',
                        type: 'item',
                        icon: 'aspect_ratio',
                        url: '/analystpro/standart'
                    },
                    {
                        id: 'lod',
                        title: 'LOD',
                        type: 'item',
                        icon: 'blur_linear',
                        url: '/analystpro/lod'
                    },
                    {
                        id: 'metode',
                        title: 'Metode',
                        type: 'item',
                        icon: 'category',
                        url: '/analystpro/metode'
                    },
                    {
                        id: 'unit',
                        title: 'Unit',
                        type: 'item',
                        icon: 'category',
                        url: '/analystpro/unit'
                    },
                    {
                        id: 'paketuji',
                        title: 'Paket Uji',
                        type: 'item',
                        icon: 'compare',
                        url: '/analystpro/paketuji'
                    },
                    {
                        id: 'paketparameter',
                        title: 'Paket Parameter',
                        type: 'item',
                        icon: 'confirmation_number',
                        url: '/analystpro/paket-parameter'
                    },
                    {
                        id: 'unit',
                        title: 'Lab Unit',
                        type: 'item',
                        icon: 'control_camera',
                        url: '/analystpro/lab'
                    },
                    {
                        id: 'contractcategory',
                        title: 'Contract Category',
                        type: 'item',
                        icon: 'casino',
                        url: '/analystpro/contract-category'
                    },
                    {
                        id: 'parametertype',
                        title: 'Parameter Type',
                        type: 'item',
                        icon: 'casino',
                        url: '/analystpro/parameter-type'
                    },

                ]
            }
        ]
    }
];
