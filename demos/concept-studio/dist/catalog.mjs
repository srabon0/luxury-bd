export const concepts = {
  architectural: {
    name: "Architectural",
    number: "01",
    full: "Architectural Minimalism",
    eyebrow: "THE SHAPE OF EVERYDAY LIVING",
    headline: "Designed around<br>your everyday.",
    description:
      "Considered forms. Honest materials. Bathroom essentials that make room for a little more calm.",
    image: "architecture",
    collection: "The Forma collection",
    font: "editorial",
  },
  boutique: {
    name: "Boutique",
    number: "02",
    full: "Boutique Luxury",
    eyebrow: "A MORE PERSONAL SANCTUARY",
    headline: "A quieter kind<br>of luxury.",
    description:
      "Sculptural silhouettes and beautifully considered finishes. Create a space that feels entirely your own.",
    image: "boutique",
    collection: "The Nocturne collection",
    font: "editorial",
  },
  showroom: {
    name: "Showroom",
    number: "03",
    full: "Modern Showroom",
    eyebrow: "BEAUTIFUL SPACES. CLEAR CHOICES.",
    headline: "Better bathrooms<br>start here.",
    description:
      "Find the right basin, toilet, faucet or shower for your space. Explore every detail, all in one place.",
    image: "showroom",
    collection: "Explore the complete range",
    font: "modern",
  },
};
export const categories = [
  {
    name: "Basins",
    slug: "basins",
    image: 0,
    description: "A focal point, beautifully formed.",
  },
  {
    name: "Toilets",
    slug: "toilets",
    image: 1,
    description: "Clean lines. Considered comfort.",
  },
  {
    name: "Faucets",
    slug: "faucets",
    image: 2,
    description: "The finishing touch.",
  },
  {
    name: "Showers",
    slug: "showers",
    image: 3,
    description: "Make time for a moment of calm.",
  },
];
export const products = [
  {
    id: "forma-oval",
    name: "Forma Oval Basin",
    category: "basins",
    collection: "Forma",
    price: 12500,
    image: 0,
    finish: "Gloss White",
    size: "580 × 380 × 145 mm",
    material: "Vitreous ceramic",
    description:
      "A softly sculpted countertop basin with a generous oval bowl. An understated focal point for a considered bathroom.",
  },
  {
    id: "linea-wall",
    name: "Linea Wall-hung WC",
    category: "toilets",
    collection: "Linea",
    price: 28500,
    image: 1,
    finish: "Gloss White",
    size: "520 × 360 × 350 mm",
    material: "Vitreous ceramic",
    description:
      "A wall-hung silhouette that keeps the floor visually open. Designed as part of a clean, architectural bathroom concept.",
  },
  {
    id: "arc-mixer",
    name: "Arc Basin Mixer",
    category: "faucets",
    collection: "Arc",
    price: 8900,
    image: 2,
    finish: "Chrome",
    size: "165 mm overall height",
    material: "Brass body",
    description:
      "A balanced single-lever mixer with a gently curved spout. A versatile finishing detail for a contemporary basin.",
  },
  {
    id: "aero-rain",
    name: "Aero Rain Shower",
    category: "showers",
    collection: "Aero",
    price: 22900,
    image: 3,
    finish: "Chrome",
    size: "250 mm overhead head",
    material: "Metal shower assembly",
    description:
      "An overhead rain shower and handheld combination with a simple, considered profile.",
  },
  {
    id: "forma-soft",
    name: "Forma Soft Basin",
    category: "basins",
    collection: "Forma",
    price: 14200,
    image: 0,
    finish: "Gloss White",
    size: "600 × 400 × 150 mm",
    material: "Vitreous ceramic",
    description:
      "Soft edges and a wide bowl give this countertop basin a quiet, sculptural presence.",
  },
  {
    id: "linea-compact",
    name: "Linea Compact WC",
    category: "toilets",
    collection: "Linea",
    price: 24500,
    image: 1,
    finish: "Gloss White",
    size: "480 × 350 × 340 mm",
    material: "Vitreous ceramic",
    description:
      "A compact wall-hung concept for spaces where every proportion matters.",
  },
  {
    id: "arc-tall",
    name: "Arc Tall Mixer",
    category: "faucets",
    collection: "Arc",
    price: 11900,
    image: 2,
    finish: "Chrome",
    size: "290 mm overall height",
    material: "Brass body",
    description:
      "An elevated basin mixer concept, paired with countertop ceramics for a cohesive composition.",
  },
  {
    id: "aero-hand",
    name: "Aero Shower Set",
    category: "showers",
    collection: "Aero",
    price: 17900,
    image: 3,
    finish: "Chrome",
    size: "900 mm rail height",
    material: "Metal shower assembly",
    description:
      "A versatile shower assembly concept that pairs uncomplicated form with everyday usability.",
  },
];
export function filterProducts({
  category = "",
  search = "",
  sort = "featured",
} = {}) {
  let list = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!search ||
        `${p.name} ${p.collection} ${p.category} ${p.finish}`
          .toLowerCase()
          .includes(search.toLowerCase().trim())),
  );
  if (sort === "price-up") list.sort((a, b) => a.price - b.price);
  if (sort === "price-down") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
export function normalizeIds(ids) {
  return Array.isArray(ids)
    ? [...new Set(ids)].filter((id) => products.some((p) => p.id === id))
    : [];
}
