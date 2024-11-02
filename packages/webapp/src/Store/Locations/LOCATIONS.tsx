import { ILocation } from "@way-to-bot/shared/interfaces/location.interface";

const LOCATIONS: ILocation[] = [
  {
    id: 1,
    address: "Киселёва, 12",
    title: "Ресторан 'Дуэты'",
    url: "https://duety.relax.by/",
    preview: {
      id: 1,
      url: "https://ms1.relax.by/images/5da23058500fe4a6857e31cd0906d449/resize/w=1200,h=800,q=80,watermark=true/place_gallery_photo/ae/91/ea/ae91eafe7152b3e1cde7352a07f58e2f.jpg",
    },
    createdAt: 1234,
    updatedAt: 1234,
  },
  {
    id: 2,
    address: "ТЦ GREENCITY, улица Притыцкого, 156, эт. 1",
    title: "Ресторан «Литвины»",
    url: "https://restoran-litviny-1.relax.by/",
    preview: {
      id: 2,
      url: "https://ms1.relax.by/images/c5e2a8a821045549711568b4e10ff8ec/resize/w=1200,h=800,q=80,watermark=false/place_review_image/2f/71/5a/2f715a0661c47f63d5ddc778b0614c2a.jpg",
    },
    createdAt: 1234,
    updatedAt: 1234,
  },
];

export { LOCATIONS };
