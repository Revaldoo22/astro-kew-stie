export interface PostDetailType {
    uuid: string;
    title: string;
    slug: string;
    content: string;
    date: string;
    categories: string[];
    keywords: string[];
    author: string;
    authorUUID: string;
    authorUsername: string;
    views: number;
    image: string;
    nextPost: {
        title: string;
        slug: string;
        image: string;
    } | null;
    prevPost: {
        title: string;
        slug: string;
        image: string;
    } | null;
}

export interface PostListType {
    title: string;
    slug: string;
    content?: string;
    views?: number;
    date: string;
    categories?: string[];
    author: string;
    authorUsername: string;
    image_1200_690: string;
    image_400_400: string;
}

export interface AuthorPostsType {
    avatar: string;
    fullName: string;
    authorUsername: string;
    description: string;
    email: string;
    institutions: string;
    address: string;
    job: string;
    statistik: {
        totalArticle: number;
        totalNews: number;
        totalView: number;
        totalLike: number;
        totalMember: number;
    };
}

export interface PageType {
    title: string;
    slug: string;
    content: string;
    keywords: string[];
    date: string;
    author: string;
    image: string;
    views: number;
}