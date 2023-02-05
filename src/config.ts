import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://amarchenko.dev/",
  author: "Andrei Marchenko",
  desc: "Blog about IT and other stuff",
  title: "Andrei Marchenko",
  ogImage: "",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/Tom910",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/andrey-marchenko-48b44b151/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:tom910ru@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/Tom910ru",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/tom910",
    linkTitle: `${SITE.title} on Telegram`,
    active: true,
  },
];
