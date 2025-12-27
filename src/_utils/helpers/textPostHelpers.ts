// Base text data structure
const textData = {
    "article": {
        "home": {
            "title": {
                "id": "Artikel",
                "en": "Article"
            },
            "description": {
                "id": "Temukan artikel-artikel terbaik tentang disabilitas, aksesibilitas, dan inklusi",
                "en": "Find the best articles about disabilities, accessibility, and inclusion"
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },
        "related": {
            "title": {
                "id": "Artikel Terkait",
                "en": "Related Article"
            },
            "description": {
                "id": "Baca juga artikel terkait yang mungkin menarik untuk Anda.",
                "en": "Read also related articles that might interest you."
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },
        "recent": {
            "title": {
                "id": "Artikel Terbaru",
                "en": "Recent Article"
            },
            "description": {
                "id": "Baca juga artikel terbaru yang mungkin menarik untuk Anda.",
                "en": "Read also recent articles that might interest you."
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },
        "popular": {
            "title": {
                "id": "Artikel Populer",
                "en": "Popular Article"
            },
            "description": {
                "id": "Baca juga artikel populer yang mungkin menarik untuk Anda.",
                "en": "Read also popular articles that might interest you."
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },  
        "category": {	
            "title": {
                "id": "Kategori Artikel",
                "en": "Article Category"
            },
            "description": {
                "id": "Baca juga artikel berdasarkan kategori yang Anda minati.",
                "en": "Read also articles by category that you are interested in."
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },
        'listnews': {
            "title": {
                "id": "Kumpulan Artikel",
                "en": "Article Collection"
            },
            "description": {
                "id": "Kumpulan artikel terbaru tentang disabilitas, aksesibilitas, dan inklusi",
                "en": "Collection of latest articles about disabilities, accessibility, and inclusion"
            },
            "link": {
                "id": "/artikel",
                "en": "/en/article"
            }
        },
        "pagination": {
            "previous": {
                "id": "Sebelumnya",
                "en": "Previous"
            },
            "next": {
                "id": "Selanjutnya", 
                "en": "Next"
            }
        }
    },
    "news": {
        "home": {
            "title": {
                "id": "Berita",
                "en": "News"
            },
            "description": {
                "id": "Temukan berita-berita terbaru seputar disabilitas, teknologi asistif, dan inklusi",
                "en": "Find the latest news about disabilities, assistive technology, and inclusion"
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "related": {
            "title": {
                "id": "Berita Terkait",
                "en": "Related News"
            },
            "description": {
                "id": "Baca juga berita terkait yang mungkin menarik untuk Anda.",
                "en": "Read also related news that might interest you."
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "recent": {
            "title": {
                "id": "Berita Terbaru",
                "en": "Recent News"
            },
            "description": {
                "id": "Baca juga berita terbaru yang mungkin menarik untuk Anda.",
                "en": "Read also recent news that might interest you."
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "popular": {
            "title": {
                "id": "Berita Populer",
                "en": "Popular News"
            },
            "description": {
                "id": "Baca juga berita populer yang mungkin menarik untuk Anda.",
                "en": "Read also popular news that might interest you."
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "category": {	
            "title": {
                "id": "Kategori Berita",
                "en": "News Category"
            },
            "description": {
                "id": "Baca juga berita berdasarkan kategori yang Anda minati.",
                "en": "Read also news by category that you are interested in."
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "listnews": {
            "title": {
                "id": "Kumpulan Berita",
                "en": "News Collection"
            },
            "description": {
                "id": "Kumpulan berita terbaru tentang disabilitas, aksesibilitas, dan inklusi",
                "en": "Collection of latest news about disabilities, accessibility, and inclusion"
            },
            "link": {
                "id": "/berita",
                "en": "/en/news"
            }
        },
        "pagination": {
            "previous": {
                "id": "Sebelumnya",
                "en": "Previous"
            },
            "next": {
                "id": "Selanjutnya",
                "en": "Next"
            }
        }
    }
};

// Helper function to get localized text
const getLocalizedText = (textObj: any, en: number): string => {
    return textObj?.[en === 1 ? 'en' : 'id'] || '';
};

// Main helper function - returns only requested sections
export const textPostHelpers = (group: string, en: number, sections?: string[]) => {
    const selectedGroup = textData[group as keyof typeof textData];
    
    if (!selectedGroup) {
        return {};
    }

    // If no sections specified, return all
    if (!sections || sections.length === 0) {
        const result: any = {};
        Object.keys(selectedGroup).forEach(section => {
            result[section] = {};
            Object.keys(selectedGroup[section as keyof typeof selectedGroup]).forEach(key => {
                result[section][key] = getLocalizedText(selectedGroup[section as keyof typeof selectedGroup][key as keyof typeof selectedGroup[keyof typeof selectedGroup]], en);
            });
        });
        return result;
    }

    // Return only requested sections
    const result: any = {};
    sections.forEach(section => {
        if (selectedGroup[section as keyof typeof selectedGroup]) {
            result[section] = {};
            Object.keys(selectedGroup[section as keyof typeof selectedGroup]).forEach(key => {
                result[section][key] = getLocalizedText(selectedGroup[section as keyof typeof selectedGroup][key as keyof typeof selectedGroup[keyof typeof selectedGroup]], en);
            });
        }
    });
    
    return result;
};

export const getHomeText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['home']);
};

// Convenience functions for specific use cases
export const getRelatedText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['related']);
};

export const getRecentText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['recent']);
};

export const getPopularText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['popular']);
};

export const getCategoryText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['category']);
};

export const getListText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['listnews']);
};


export const getPaginationText = (group: string, en: number) => {
    return textPostHelpers(group, en, ['pagination']);
};