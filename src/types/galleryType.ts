export interface GalleryPhotoCategoryType {
    uuid: string;
    name: string;
    slug: string;
    total: number;
}

export interface GalleryPhotoByCategoryType {
    uuid: string;
    title: string;
    slug: string;
    image_1200_690: string;
    image_1024_512: string;
    image_400_400: string;
    created_at: string;
}

export interface GalleryPhotoDetailByCategoryType {
    title: string;
    slug: string;
    post_date: string;
    image_url: string;
    gallery: string[];
}