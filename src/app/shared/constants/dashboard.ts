import { IstatusCards } from "@/app/shared/interfaces/dashboard.interfaces";

export const statusCards: IstatusCards[] = [
    {
        id:1,
        count: 0,
        status: 'Total',
        color: 'text-blue-500',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    },
    {
        id:2,
        count: 0,
        status: 'Idle',
        color: 'text-yellow-500',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    },
    {
        id:3,
        count: 0,
        status: 'Stopped',
        color: 'text-red-500',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    },
    {
        id:4,
        count: 0,
        status: 'Running',
        color: 'text-green-500',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    },
    {
        id:5,
        count: 0,
        status: 'Offline',
        color: 'text-gray-500',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    },
    {
        id:6,
        count: 0,
        status: 'Never Connected',
        color: '',
        avatarUrl: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png'
    }
];
