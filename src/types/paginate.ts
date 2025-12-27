import type { PostListType } from "./postType";
import type { EventType } from "./eventType";
import type { GalleryPhotoByCategoryType } from "./galleryType";


export interface PaginatedPostListType {
    posts: PostListType[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedEventListType {
    events: EventType[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedGalleryPhotoByCategoryListType {
    gallery: GalleryPhotoByCategoryType[];
    total: number;
    totalPages: number;
    currentPage: number;
}
