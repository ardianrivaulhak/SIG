import { FuseNavigation } from "@fuse/types";

export const hris: FuseNavigation[] = [
    {
        id: "application",
        title: "HRIS",
        type: "group",
        // icon    : 'apps',
        children: [
            // {
            //     id: 'dashboard',
            //     title: 'Dashboard',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/hris/dashboard',
            //     exactMatch: true
            // },
            {
                id: "dasboard",
                title: "Dasboard",
                type: "item",
                icon: "dashboard",
                url: "/hris/dashboard",
            },
            {
                id: "employee",
                title: "Employee",
                type: "collapsable",
                icon: "group",
                children: [
                    {
                        id: "employee-add",
                        title: "Employee",
                        type: "item",
                        icon: "group",
                        url: "/hris/employee",
                    },
                    {
                        id: "employee",
                        title: "History",
                        type: "item",
                        icon: "group",
                        url: "/hris/history-employee",
                    },
                ],
            },
            
            {
                id: "leave",
                title: "Leave",
                type: "item",
                icon: "assignment",
                url: "/hris/leave",
            },
            {
                id: "attendance",
                title: "Attendance",
                type: "collapsable",
                icon: "assignment_turned_in",
                // url: '/hris/attendance'
                children: [
                    {
                        id: "attendance-data",
                        title: "Attendance Data",
                        type: "item",
                        icon: "description",
                        url: "/hris/attendance",
                    },
                    {
                        id: "leave",
                        title: "Leave Approval",
                        type: "item",
                        icon: "assignment",
                        url: "/hris/leave-approvel",
                    },
                    {
                        id: "timetable",
                        title: "Timetable",
                        type: "item",
                        icon: "access_time",
                        url: "/hris/modal-rules",
                    },
                    {
                        id: "calender",
                        title: "Calender",
                        type: "item",
                        icon: "calendar_today",
                        url: "/hris/dayoff-modals",
                    },
                    {
                        id: "status",
                        title: "Status Attendance",
                        type: "item",
                        icon: "description",
                        url: "/hris/status-attendance",
                    },
                ],
            },
            {
                id: "application",
                title: "Master",
                type: "group",
                children: [
                    {
                        id: "departement",
                        title: "Department",
                        type: "item",
                        icon: "domain",
                        url: "/hris/departement",
                    },
                    {
                        id: "sistercompany",
                        title: "Sister Company",
                        type: "item",
                        icon: "domain",
                        url: "/hris/sistercompany",
                    },
                    {
                        id: "division",
                        title: "Division",
                        type: "item",
                        icon: "domain",
                        url: "/hris/division",
                    },

                    {
                        id: "subdivision",
                        title: "Sub Division",
                        type: "item",
                        icon: "domain",
                        url: "/hris/sub-division",
                    },
                    {
                        id: "level",
                        title: "Level",
                        type: "item",
                        icon: "layers",
                        url: "/hris/level",
                    },
                    {
                        id: "position",
                        title: "Position",
                        type: "item",
                        icon: "layers",
                        url: "/hris/position",
                    },
                ],
            },
        ],
    },
];
