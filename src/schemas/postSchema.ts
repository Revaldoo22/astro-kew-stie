export const postDetailSchema = {
    uuid: "uuid",
    title: "title",
    slug: "slug",
    content: "content",
    date: "date",
    categories: "categories",
    author: "author",
    authorUUID: "author_uuid",
    authorUsername: "author_username",
    keywords: "tags",
    views: "view",
    image: "image",
    nextPost: "next_post",
    prevPost: "prev_post"
}

export const postListSchema = {
    title: "title",
    slug: "slug",
    content: "content",
    views: "view",
    date: "date",
    categories: "categories",
    author: "author",
    authorUsername: "author_username",
    image_1200_690: "image_1200_690",
    image_400_400: "image_400_400"
}

export const authorPostsSchema = {
    avatar: "avatar",
    fullName: "name",
    authorUsername: "author_username",
    description: "description",
    email: "email",
    institutions: "institutions",
    address: "address",
    job: "job",
    statistik: {
        totalArticle: "total_article",
        totalNews: "total_news",
        totalView: "total_view",
        totalLike: "total_like",
        totalMember: "total_member"
    }
}

export const pageSchema = {
    title: "title",
    slug: "slug",
    content: "content",
    keywords: "tags",
    date: "date",
    author: "author",
    image: "image",
    views: "total_view"
};
  