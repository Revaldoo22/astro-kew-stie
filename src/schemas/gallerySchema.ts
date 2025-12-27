export const galleryPhotoCategorySchema = {
    uuid: "uuid",
    name: "name",
    slug: "slug",
    total: "total_posts"
}

export const galleryPhotoByCategorySchema = {
    uuid: "uuid",
    title: "title",
    slug: "slug",
    image_1200_690: "image_1200_690",
    image_1024_512: "image_1024_512",
    image_400_400: "image_400_400",
    created_at: "created_at"
}

export const galleryPhotoDetailByCategorySchema = {
    title: "title",
    slug: "slug",
    post_date: "post_date",
    image_url: "image_url",
    gallery: "gallery"
}