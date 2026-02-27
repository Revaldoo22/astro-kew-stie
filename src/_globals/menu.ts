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
        label: "RPL",
        href: "/promo-kuliah-cepat-rpl",
        submenuId: "menu-promo-rpl"
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
        href: "http://link.stekom.ac.id/ads?text=Halo%20Admin,%20Saya%20ingin%20konsultasi%20terkait%20pendaftaran%20kuliah%20kelas%20karyawan",
        submenuId: "menu-hubungi"
    }
];
