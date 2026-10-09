import {
    AlertTriangle,
    BarChart3,
    Boxes,
    CassetteTape,
    ClipboardList,
    History,
    LayoutDashboard,
    PackagePlus,
    Settings,
    Users,
    Utensils,
} from "lucide-react";

export const ROLES = {
    OWNER: "owner",
    MANAGER: "manager",
    STOREKEEPER: "storekeeper",
    CASHIER: "cashier",
} as const;

const { OWNER, MANAGER, STOREKEEPER, CASHIER } = ROLES;

export const navItems = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        access: [OWNER, MANAGER],
    },
    {
        to: "/categories",
        label: "Categories",
        icon: CassetteTape,
        access: [OWNER, MANAGER],
    },
    {
        to: "/menu",
        label: "Menu",
        icon: Utensils,
        access: [OWNER, MANAGER],
    },
    {
        to: "/new-order",
        label: "New Order",
        icon: Utensils,
        access: [OWNER, MANAGER, CASHIER],
    },
    {
        to: "/orders",
        label: "Orders",
        icon: ClipboardList,
        access: [OWNER, MANAGER, CASHIER],
    },
    {
        to: "/inventory",
        label: "Inventory",
        icon: Boxes,
        access: [OWNER, MANAGER, STOREKEEPER],
    },
    {
        to: "/stock-in",
        label: "Stock In",
        icon: PackagePlus,
        access: [OWNER, MANAGER, STOREKEEPER],
    },
    {
        to: "/low-stock",
        label: "Low Stock",
        icon: AlertTriangle,
        access: [OWNER, MANAGER, STOREKEEPER],
    },
    {
        to: "/stock-history",
        label: "Stock History",
        icon: History,
        access: [OWNER, MANAGER, STOREKEEPER],
    },
    {
        to: "/reports",
        label: "Reports",
        icon: BarChart3,
        access: [OWNER, MANAGER],
    },
    {
        to: "/staff",
        label: "Staff",
        icon: Users,
        access: [OWNER, MANAGER],
    },
    {
        to: "/settings",
        label: "Settings",
        icon: Settings,
        access: [OWNER, MANAGER, STOREKEEPER, CASHIER],
    },
];

export const navForRole = (role: string) => {
    const normalizedRole = role?.toLowerCase();

    return navItems.filter((item) =>
        item.access.includes(normalizedRole as typeof OWNER)
    );
};

export const accessFor = (to: string) => {
    return navItems.find((item) => item.to === to)?.access;
};

export const homePathFor = (role: string) => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === STOREKEEPER) {
        return "/inventory";
    }

    if (normalizedRole === CASHIER) {
        return "/new-order";
    }

    return "/dashboard";
};