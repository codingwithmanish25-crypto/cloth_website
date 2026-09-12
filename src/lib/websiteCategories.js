export const WEBSITE_CATEGORIES = [
  {
    group: "MEN",
    items: [
      ["Shirts", "men-shirts"],
      ["Polos", "men-polos"],
      ["Trousers", "men-trousers"],
      ["Blazers", "men-blazers"],
      ["Jackets", "men-jackets"],
      ["Knitwear", "men-knitwear"],
      ["Co-ords", "men-co-ords"],
      ["Accessories", "men-accessories"],
    ],
  },
  {
    group: "WOMEN",
    items: [
      ["Shirts & Blouses", "women-shirts-blouses"],
      ["Trousers", "women-trousers"],
      ["Dresses", "women-dresses"],
      ["Blazers", "women-blazers"],
      ["Jackets", "women-jackets"],
      ["Knitwear", "women-knitwear"],
      ["Co-ords", "women-co-ords"],
      ["Accessories", "women-accessories"],
    ],
  },
  {
    group: "FOOTWEAR",
    items: [
      ["Loafers", "footwear-loafers"],
      ["Sneakers", "footwear-sneakers"],
      ["Formal Shoes", "footwear-formal-shoes"],
    ],
  },
  {
    group: "ACCESSORIES",
    items: [
      ["Belts", "accessories-belts"],
      ["Wallets", "accessories-wallets"],
      ["Watches", "accessories-watches"],
      ["Sunglasses", "accessories-sunglasses"],
      ["Bags", "accessories-bags"],
    ],
  },
];

export const WEBSITE_CATEGORY_ROWS = WEBSITE_CATEGORIES.flatMap(({ group, items }) =>
  items.map(([name, slug]) => ({ group, name, slug }))
);
