export interface Animal {
  id: number;
  name: string;
  sciName: string;
  description: string[];
  images: string[];
  video: string;
  events: Array<{
    name: string;
    date: string;
    url: string;
  }>;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  isAdmin: boolean;
  createdAnimals: number[];
}

export const animals: Animal[] = [
  {
    id: 1,
    name: "Bunny Harvestman",
    sciName: "Metagryne bicolumnata",
    description: [
      "The Bunny Harvestman (Metagryne bicolumnata) is a unique arachnid species found in the Amazon rainforest.",
      "Despite its spider-like appearance, it's actually a type of harvestman, distinguished by its unusual body shape that resembles a rabbit's head."
    ],
    images: [
      "/images/bunny-harvestman/1.jpg",
      "/images/bunny-harvestman/2.jpg",
      "/images/bunny-harvestman/3.jpg"
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    events: [
      {
        name: "Bunny Harvestman Exhibit",
        date: "06/15/2024",
        url: "https://www.nationalgeographic.com"
      }
    ]
  },
  {
    id: 2,
    name: "Narwhal",
    sciName: "Monodon monoceros",
    description: [
      "The narwhal is a medium-sized toothed whale that possesses a large 'tusk' from a protruding canine tooth.",
      "They are known as the 'unicorns of the sea' and live in Arctic waters."
    ],
    images: [
      "/images/narwhal/1.jpg",
      "/images/narwhal/2.jpg",
      "/images/narwhal/3.jpg"
    ],
    video: "https://www.youtube.com/embed/ykwqXuMPsoc",
    events: [
      {
        name: "Narwhal Arctic Expedition",
        date: "07/22/2024",
        url: "https://www.nationalgeographic.com"
      }
    ]
  },
  {
    id: 3,
    name: "Pygmy Hippopotamus",
    sciName: "Choeropsis liberiensis",
    description: [
      "The pygmy hippopotamus is a small hippopotamid native to the forests and swamps of West Africa.",
      "They are reclusive and nocturnal, and about half the size of their larger relatives."
    ],
    images: [
      "/images/pygmy-hippo/1.jpg",
      "/images/pygmy-hippo/2.jpg",
      "/images/pygmy-hippo/3.jpg"
    ],
    video: "https://www.youtube.com/embed/a-vbFA-s1vs",
    events: [
      {
        name: "Pygmy Hippo Conservation Talk",
        date: "08/05/2024",
        url: "https://www.nationalgeographic.com"
      }
    ]
  },
  {
    id: 4,
    name: "Red Kangaroo",
    sciName: "Osphranter rufus",
    description: [
      "The red kangaroo is the largest of all kangaroos and the largest terrestrial mammal native to Australia.",
      "Males have red-brown fur, while females are blue-grey with a brown tinge."
    ],
    images: [
      "/images/red-kangaroo/1.jpg",
      "/images/red-kangaroo/2.jpg",
      "/images/red-kangaroo/3.jpg"
    ],
    video: "https://www.youtube.com/embed/8BbZTCdBly4",
    events: [
      {
        name: "Australian Outback Experience",
        date: "09/12/2024",
        url: "https://www.nationalgeographic.com"
      }
    ]
  }
];

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "Admin User",
    isAdmin: true,
    createdAnimals: [1, 2, 3, 4]
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    name: "Regular User",
    isAdmin: false,
    createdAnimals: []
  }
];