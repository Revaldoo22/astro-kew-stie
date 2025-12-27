export interface MenuItem {
    label: string;
    href: string;
    submenuId?: string;
    isHome?: boolean;
    hasSubmenu?: boolean;
    items?: Array<{
        label: string;
        href: string;
    }>;
}

export const menuItems: MenuItem[] = [
    {
        label: "Home",
        href: "/",
        submenuId: "menu-home",
        isHome: true
    },
    {
        label: "Biaya Kuliah Kelas Karyawan",
        href: "/biaya-kuliah-kelas-karyawan",
        submenuId: "menu-biaya"
    },
    {
        label: "Program Studi Kelas Karyawan",
        href: "/program-studi-kelas-karyawan",
        submenuId: "menu-program"
    },
    {
        label: "Blog",
        href: "/blog",
        submenuId: "menu-blog"
    },
    {
        label: "Hubungi Kami",
        href: "/hubungi-kami",
        submenuId: "menu-hubungi"
    }
];
