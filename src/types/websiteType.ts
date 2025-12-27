export interface InfoMenuType {
    menuName: string;
    url: string;
    sub: string;
    submenus: InfoMenuType[];
}

export interface InfoWebsiteType {
    name: string;
    description: string;
    keywords: string;
    phone: string;
    address: string;
    email: string;
    logoDark: string;
    logoLight: string;
    aboutShow: boolean;
    aboutDescription: string;
    aboutImage: string;
    aboutUrl: string;
    aboutUrlVideo: string;
}

export interface SlideType {
    title: string;
    slug: string;
    description?: string;
    image: string;
    link?: string;
    showDescription?: boolean;
}