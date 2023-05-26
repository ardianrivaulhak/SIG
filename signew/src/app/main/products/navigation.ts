import { FuseNavigation } from '@fuse/types';

export const products: FuseNavigation[] = [
    {
        id: 'application',
        title: 'PRODUCTS',
        type: 'group',
        // icon    : 'apps',
        children: [
            {
                id: 'dashboard',
                title: 'dashboard',
                type: 'item',
                icon: 'bar_chart',
                url: '/products/dashboard',
                exactMatch: true
            },
            {
                id: 'mediartu',
                title: 'Media RTU',
                type: 'item',
                icon: 'group',
                url: '/products/contract/mediartu'
            },
            {
                id: 'dioxin',
                title: 'Dioxin',
                type: 'item',
                icon: 'group',
                url: '/products/contract/dioxin'
            },
            {
                id: 'approvelab',
                title: 'Approval Lab',
                type: 'item',
                icon: 'group',
                url: '/products/approve-lab'
            },
            {
                id: 'mediartulab',
                title: 'Media RTU Lab',
                type: 'item',
                icon: 'group',
                url: '/products/mediartu-lab'
            },
            {
                id: 'approvalfinance',
                title: 'Approval Finance',
                type: 'item',
                icon: 'group',
                url: '/products/approve-finance'
            }, {
                id: 'finance',
                title: 'Finance',
                type: 'item',
                icon: 'group',
                url: '/products/finance'
            },
            // {
            //     id: 'application',
            //     title: 'Master',
            //     type: 'group',
            //     children: [
            //         {
            //             id: 'status',
            //             title: 'Status Attendance',
            //             type: 'item',
            //             icon: 'group',
            //             url: '/hris/status-attendance'
            //         },
            //         {
            //             id: 'division',
            //             title: 'Division',
            //             type: 'item',
            //             icon: 'group',
            //             url: '/hris/division'
            //         },
            //         {
            //             id: 'departement',
            //             title: 'Departement',
            //             type: 'item',
            //             icon: 'group',
            //             url: '/hris/departement'
            //         },
            //         {
            //             id: 'subdivision',
            //             title: 'Sub Division',
            //             type: 'item',
            //             icon: 'group',
            //             url: '/hris/sub-division'
            //         },
            //         {
            //             id: 'level',
            //             title: 'Level',
            //             type: 'item',
            //             icon: 'group',
            //             url: '/hris/level'
            //         }
            //     ]
            // }
        ]
    },
];