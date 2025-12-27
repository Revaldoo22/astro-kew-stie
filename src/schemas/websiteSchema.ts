export const infoMenuSchema = {
    menuName: "menu_name",
    url: "url",
    sub: "sub",
    submenus: [
      "self", // reference to itself for recursive mapping
      "submenus"
    ]
};

export const infoWebsiteSchema = {
    name: "website_name",
    description: "description",
    keywords: "keywords",
    address: "address",
    phone: "phone",
    email: "email",
    logoDark: "logo_dark",
    logoLight: "logo_white",
    aboutShow: "show_about",
    aboutDescription: "about",
    aboutUrl: "url_about",
    aboutImage: "image_about",
    aboutUrlVideo: "url_video"
};

export const slideSchema = {
  title: "title",
  slug: "slug",
  description: "description",
  image: "image",
  link: "link",
  showDescription: "show_description",
}