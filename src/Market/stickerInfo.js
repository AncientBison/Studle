const stickerInfo = {
  apple: {
    image: "src/images/stickers/apple.png",
    tier: "common",
  },
  pineapple: {
    image: "src/images/stickers/pineapple.png",
    tier: "rare",
  },
  book: {
    image: "src/images/stickers/book.png",
    tier: "uncommon",
  },
  cookie: {
    image: "src/images/stickers/cookie.png",
    tier: "uncommon",
  },
  dev: {
    image: "src/images/stickers/dev.png",
    tier: "special",
  },
  smile: {
    image: "src/images/stickers/smile.png",
    tier: "common",
  },
  studle: {
    image: "src/images/stickers/studle.png",
    tier: "uncommon",
  },
  palmTree: {
    image: "src/images/stickers/palmTree.png",
    tier: "rare",
  },
  frown: {
    image: "src/images/stickers/frown.png",
    tier: "common",
  },
  perfectScore: {
    image: "src/images/stickers/perfectScore.png",
    tier: "legendary",
  },
  fail: {
    image: "src/images/stickers/fail.png",
    tier: "epic",
  },
  coconut: {
    image: "src/images/stickers/coconut.png",
    tier: "mythical",
  },
}

const tierOrder = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythical: 5,
  special: 6,
}

const tierPrices = {
  common: 200,
  uncommon: 500,
  rare: 800,
  epic: 1200,
  legendary: 2000,
  mythical: 6000
}


export { stickerInfo, tierOrder, tierPrices };