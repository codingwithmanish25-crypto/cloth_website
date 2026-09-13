export const WEBSITE_CATEGORIES = [
  {
    group: "MEN",
    items: [
      ["Shirts", "men-shirts"],
      ["Henley", "men-henley"],
      ["Denim", "men-denim"],
      ["Korean pants", "men-korean-pants"],
      ["Trousers", "men-trousers"],
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
];

export const WEBSITE_CATEGORY_ROWS = WEBSITE_CATEGORIES.flatMap(({ group, items }) =>
  items.map(([name, slug]) => ({ group, name, slug }))
);
