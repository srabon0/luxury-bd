import {
  concepts,
  categories,
  products,
  filterProducts,
  normalizeIds,
} from "./catalog.mjs";
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (v) => "৳ " + v.toLocaleString("en-BD");
let shortlist = [],
  comparison = [];
try {
  shortlist = normalizeIds(
    JSON.parse(localStorage.getItem("luxurry-demo-shortlist") || "[]"),
  );
} catch {}
const icon = (name) => {
  const paths = {
    arrow: "M4 12h16M13 5l7 7-7 7",
    up: "M5 19 19 5M5 5h14v14",
    search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    bag: "M5 7h14l1 14H4L5 7ZM8 8V6a4 4 0 0 1 8 0v2",
    close: "m6 6 12 12M6 18 18 6",
    plus: "M12 5v14M5 12h14",
    check: "m5 12 4 4L19 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${
    name === "search"
      ? '<path d="m21 21-5-5"/><circle cx="10" cy="10" r="8"/>'
      : `<path d="${paths[name] || paths.arrow}"/>`
  }</svg>`;
};
function state() {
  const q = new URLSearchParams(location.search);
  return {
    concept: concepts[q.get("concept")] ? q.get("concept") : "architectural",
    view: [
      "home",
      "products",
      "inspiration",
      "professionals",
      "contact",
    ].includes(q.get("view"))
      ? q.get("view")
      : "home",
    category: q.get("category") || "",
    search: q.get("search") || "",
    sort: q.get("sort") || "featured",
  };
}
function url(patch = {}) {
  const next = { ...state(), ...patch };
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(next))
    if (
      value &&
      !(key === "view" && value === "home") &&
      !(key === "sort" && value === "featured")
    )
      q.set(key, value);
  return "?" + q.toString();
}
function go(patch) {
  history.pushState({}, "", url(patch));
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}
const link = (text, patch, cls = "") =>
  `<a class="${cls}" href="${url(patch)}" data-route>${text}</a>`;
function productImage(p, cls = "") {
  return `<div class="product-image sprite p${
    p.image
  } ${cls}" role="img" aria-label="${esc(
    p.name,
  )} — illustrative product photo"></div>`;
}
function card(p) {
  return `<article class="product-card"><button class="image-button" data-product="${
    p.id
  }" aria-label="View ${esc(p.name)}">${productImage(
    p,
  )}<span class="card-open">${icon(
    "up",
  )}</span></button><div class="card-topline"><span>${esc(
    p.collection,
  )} collection</span><button class="compare-toggle ${
    comparison.includes(p.id) ? "chosen" : ""
  }" data-compare="${p.id}" aria-label="${
    comparison.includes(p.id) ? "Remove" : "Add"
  } ${esc(p.name)} ${
    comparison.includes(p.id) ? "from" : "to"
  } comparison" aria-pressed="${comparison.includes(p.id)}">${icon(
    comparison.includes(p.id) ? "check" : "plus",
  )} Compare</button></div><h3><button data-product="${p.id}">${esc(
    p.name,
  )}</button></h3><div class="product-bottom"><span>${money(
    p.price,
  )}</span><span class="finish"><i class="${
    p.finish === "Chrome" ? "chrome" : ""
  }"></i>${p.finish}</span></div></article>`;
}
function header(s, c) {
  return `<div class="concept-bar"><div class="concept-label"><b>CONCEPT STUDIO</b><span>Explore three directions</span></div><div class="concept-tabs" aria-label="Design concepts">${Object.entries(
    concepts,
  )
    .map(
      ([key, v]) =>
        `<a href="${url({ concept: key })}" data-route class="${
          s.concept === key ? "selected" : ""
        }" ${s.concept === key ? 'aria-current="true"' : ""}><span>${
          v.number
        }</span>${v.name}</a>`,
    )
    .join(
      "",
    )}</div><span class="demo-label">DEMO · SAMPLE PRODUCTS & PRICES</span></div><div class="topline"><span>Considered spaces. Everyday living.</span><button data-enquiry>Planning a bathroom? Let’s talk ${icon(
    "arrow",
  )}</button></div><header class="site-header"><a class="logo" href="${url({
    view: "home",
    category: "",
    search: "",
  })}" data-route>LUXURRY<span>BATHROOMS, CONSIDERED.</span></a><nav class="desktop-nav" aria-label="Main navigation">${[
    ["products", "Products"],
    ["home", "Collections"],
    ["inspiration", "Inspiration"],
    ["professionals", "For professionals"],
  ]
    .map(([v, t]) =>
      link(
        t,
        { view: v, category: "", search: "" },
        s.view === v ? "active" : "",
      ),
    )
    .join(
      "",
    )}</nav><div class="header-actions"><a class="search-link" aria-label="Search products" href="${url(
    { view: "products" },
  )}" data-route>${icon(
    "search",
  )}</a><button class="shortlist-button" data-enquiry aria-label="Open enquiry shortlist with ${
    shortlist.length
  } products">${icon("bag")}<span class="shortlist-count">${
    shortlist.length
  }</span></button><button class="mobile-toggle" aria-label="Open navigation" aria-expanded="false">${icon(
    "menu",
  )}</button>${link(
    "Contact us " + icon("up"),
    { view: "contact" },
    "contact-link",
  )}</div></header><nav class="mobile-nav" aria-label="Mobile navigation" hidden>${[
    ["home", "Home"],
    ["products", "Products"],
    ["inspiration", "Inspiration"],
    ["professionals", "For professionals"],
    ["contact", "Contact"],
  ]
    .map(([v, t]) => link(t, { view: v, category: "", search: "" }))
    .join("")}</nav>`;
}
function hero(s, c) {
  return `<section class="hero hero-${
    s.concept
  }"><div class="hero-photo" style="background-image:url('./assets/${
    c.image
  }.webp')" role="img" aria-label="${
    s.concept === "boutique"
      ? "Dark stone bathroom with white freestanding bath and brass fittings"
      : s.concept === "showroom"
        ? "Bright contemporary bathroom with basin and wall hung toilet"
        : "Sunlit travertine bathroom with countertop basin"
  }"></div><div class="hero-content"><p class="eyebrow">${c.eyebrow}</p><h1>${
    c.headline
  }</h1><p class="hero-description">${
    c.description
  }</p><div class="hero-ctas">${link(
    "Explore products " + icon("arrow"),
    { view: "products", category: "", search: "" },
    "button primary",
  )}${link(
    s.concept === "showroom"
      ? "Find your inspiration"
      : "Discover the collection",
    { view: "inspiration" },
    "hero-secondary",
  )}</div>${
    s.concept === "showroom"
      ? `<form class="hero-search" data-search><label class="sr-only" for="hero-search">Find a product</label>${icon(
          "search",
        )}<input id="hero-search" name="search" placeholder="Search basins, toilets, faucets…"><button aria-label="Search products">${icon(
          "arrow",
        )}</button></form>`
      : ""
  }</div><div class="hero-foot"><span>${
    c.collection
  }</span><span>FORM. FUNCTION. FEELING.</span></div></section>`;
}
function home(s, c) {
  return `${hero(
    s,
    c,
  )}<div class="service-strip"><span>Thoughtful design</span><i></i><span>Product specifications</span><i></i><span>Project enquiries</span><i></i><span>Bathroom inspiration</span></div><section class="section"><div class="section-heading"><div><p class="eyebrow">FIND YOUR EVERYDAY</p><h2>Every detail has its place.</h2></div>${link(
    "Explore all products " + icon("up"),
    { view: "products", category: "" },
    "text-link",
  )}</div><div class="category-grid">${categories
    .map(
      (cat) =>
        `<a class="category-card" href="${url({
          view: "products",
          category: cat.slug,
          search: "",
        })}" data-route><div class="sprite p${
          cat.image
        }" role="img" aria-label="${cat.name}"></div><div><span>${
          cat.description
        }</span><h3>${cat.name}</h3>${icon("up")}</div></a>`,
    )
    .join(
      "",
    )}</div></section><section class="section featured-section"><div class="section-heading"><div><p class="eyebrow">A CONSIDERED COLLECTION</p><h2>${
    s.concept === "showroom"
      ? "Find your perfect fit."
      : "Simple forms. Lasting presence."
  }</h2></div><p class="section-aside">Explore a sample of our concept range.<br>Designed to help you find your direction.</p></div><div class="product-grid">${products
    .slice(0, 4)
    .map(card)
    .join("")}</div><div class="center">${link(
    "View the collection " + icon("arrow"),
    { view: "products", category: "" },
    "button outline",
  )}</div></section><section class="editorial"><div class="editorial-photo" style="background-image:url('./assets/${
    s.concept === "boutique" ? "architecture" : "boutique"
  }.webp')" role="img" aria-label="Bathroom inspiration interior"></div><div class="editorial-copy"><p class="eyebrow">SPACES WITH A POINT OF VIEW</p><h2>A moment of calm.<br>A space of your own.</h2><p>A bathroom is more than the sum of its fittings. Explore how materials, light and form come together to shape the way a space feels.</p>${link(
    "Find your inspiration " + icon("up"),
    { view: "inspiration" },
    "text-link",
  )}</div></section><section class="section professionals-banner"><div><p class="eyebrow">FOR ARCHITECTS & DESIGNERS</p><h2>Consider every dimension.</h2><p>Compare product details, explore sample specifications and prepare a project enquiry.</p></div>${link(
    "Explore professional resources " + icon("arrow"),
    { view: "professionals" },
    "button outline",
  )}</section>`;
}
function catalog(s) {
  const list = filterProducts(s);
  return `<section class="page-intro section"><p class="eyebrow">LUXURRY / PRODUCT COLLECTION</p><h1>Find your next detail.</h1><p>From the first idea to the finishing touch. Explore your bathroom, one piece at a time.</p></section><section class="section catalog-section"><div class="catalog-layout"><aside class="catalog-sidebar"><h2>Product categories</h2>${link(
    `All products <span>${products.length}</span>`,
    { category: "", view: "products" },
    !s.category ? "current" : "",
  )}${categories
    .map((cat) =>
      link(
        `${cat.name}<span>${
          products.filter((p) => p.category === cat.slug).length
        }</span>`,
        { category: cat.slug, view: "products" },
        s.category === cat.slug ? "current" : "",
      ),
    )
    .join(
      "",
    )}<div class="help-card"><p class="eyebrow">A LITTLE GUIDANCE</p><h3>Planning a project?</h3><p>Shortlist your favourite pieces and prepare an enquiry.</p><button class="text-link" data-enquiry>Let’s talk ${icon(
    "arrow",
  )}</button></div></aside><div class="catalog-results"><div class="catalog-toolbar"><form data-search role="search">${icon(
    "search",
  )}<input name="search" aria-label="Search products" value="${esc(
    s.search,
  )}" placeholder="Search products or collections"><button type="submit" aria-label="Search">${icon(
    "arrow",
  )}</button></form><label>Sort by<select id="sort"><option value="featured" ${
    s.sort === "featured" ? "selected" : ""
  }>Featured</option><option value="price-up" ${
    s.sort === "price-up" ? "selected" : ""
  }>Price: low to high</option><option value="price-down" ${
    s.sort === "price-down" ? "selected" : ""
  }>Price: high to low</option><option value="name" ${
    s.sort === "name" ? "selected" : ""
  }>Name: A–Z</option></select></label></div><div class="results-count"><span>${
    list.length
  } ${list.length === 1 ? "product" : "products"}${
    s.search ? " for “" + esc(s.search) + "”" : ""
  }</span>${
    s.search || s.category
      ? link("Clear filters ×", { search: "", category: "" }, "text-link")
      : ""
  }</div>${
    list.length
      ? `<div class="product-grid">${list.map(card).join("")}</div>`
      : `<div class="empty-state"><p class="eyebrow">A DIFFERENT DIRECTION?</p><h2>No products match your search.</h2><p>Try “basin”, “chrome” or “Forma”, or explore all categories.</p>${link(
          "Reset filters",
          { search: "", category: "" },
          "button primary",
        )}</div>`
  }<p class="sample-note">Concept catalog: all products, dimensions and prices on this demo are illustrative. Confirm the final range before purchase or specification.</p></div></div></section>`;
}
function inspiration() {
  return `<section class="page-intro section"><p class="eyebrow">LUXURRY / INSPIRATION</p><h1>Space to imagine.</h1><p>Three different moods. One beautifully considered bathroom.</p></section><section class="section inspiration-grid">${Object.entries(
    concepts,
  )
    .map(
      ([key, c]) =>
        `<article><img src="./assets/${c.image}.webp" alt="${
          c.full
        } bathroom inspiration" width="1200" height="800" loading="lazy"><div><p class="eyebrow">${
          c.number
        } / ${c.full.toUpperCase()}</p><h2>${
          key === "architectural"
            ? "Warmth in simplicity."
            : key === "boutique"
              ? "An evening sanctuary."
              : "Clarity in every detail."
        }</h2><p>${c.description}</p>${link(
          "Explore this direction " + icon("up"),
          { concept: key, view: "home" },
          "text-link",
        )}</div></article>`,
    )
    .join("")}</section>`;
}
function professionals() {
  return `<section class="page-intro section"><p class="eyebrow">LUXURRY / FOR PROFESSIONALS</p><h1>From vision<br>to specification.</h1><p>A clear view of the details, for architects, designers and project teams.</p></section><section class="section resource-grid"><article><span>01</span><h2>Compare the details.</h2><p>Add up to three products to comparison. Review dimensions, finishes and concept prices side by side.</p>${link(
    "Explore the catalog " + icon("arrow"),
    { view: "products" },
    "text-link",
  )}</article><article><span>02</span><h2>Keep a specification.</h2><p>Open a product to download a clearly marked sample specification PDF for your design review.</p><button data-product="forma-oval" class="text-link">View a sample product ${icon(
    "arrow",
  )}</button></article><article><span>03</span><h2>Bring it all together.</h2><p>Shortlist products, add project notes and export an enquiry brief. Demo enquiries are not sent to a server.</p><button data-enquiry class="text-link">Prepare an enquiry ${icon(
    "arrow",
  )}</button></article></section><section class="section professional-note"><p class="eyebrow">DEMO RESOURCE NOTICE</p><h2>A place for the real details.</h2><p>The production website can host verified technical drawings, installation guides and product certificates supplied by your team. This demo contains sample specifications only; they must not be used for installation or purchasing decisions.</p></section>`;
}
function contact() {
  return `<section class="page-intro section"><p class="eyebrow">LUXURRY / CONTACT</p><h1>Let’s shape<br>your next space.</h1><p>Choosing a single fitting or planning a complete bathroom? Start with a considered conversation.</p></section><section class="section contact-layout"><div><p class="eyebrow">CLASSIC GROUP · LUXURRY</p><h2>Every project begins<br>with a detail.</h2><p>Prepare a product shortlist and a project brief. In this review demo, your enquiry stays in your browser until you download it.</p><button class="button primary" data-enquiry>Prepare a project enquiry ${icon(
    "arrow",
  )}</button></div><div class="contact-details"><h3>Talk to the team</h3><a href="tel:+8801711542678">+880 1711 542678 ${icon(
    "up",
  )}</a><a href="tel:+8801763547691">+880 1763 547691 ${icon(
    "up",
  )}</a><a href="mailto:hrtamim7@gmail.com">hrtamim7@gmail.com ${icon(
    "up",
  )}</a><p>Contact details carried over from the current Luxurry website. Showroom address and opening hours will be added after verification.</p></div></section>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-top"><div><a class="logo" href="${url(
    { view: "home" },
  )}" data-route>LUXURRY<span>BATHROOMS, CONSIDERED.</span></a><p>Thoughtful forms for the<br>spaces you call your own.</p></div><div><h2>Explore</h2>${link(
    "Products",
    { view: "products" },
  )}${link("Inspiration", { view: "inspiration" })}${link("For professionals", {
    view: "professionals",
  })}${link("Contact", {
    view: "contact",
  })}</div><div><h2>Collections</h2>${categories
    .map((cat) =>
      link(cat.name, { view: "products", category: cat.slug, search: "" }),
    )
    .join(
      "",
    )}</div><div class="footer-enquiry"><p class="eyebrow">YOUR NEXT SPACE STARTS HERE</p><h2>Make it your own.</h2><button class="text-link" data-enquiry>Start an enquiry ${icon(
    "up",
  )}</button></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Classic Group · Luxurry concept demo</span><span>Sample products & prices. No orders or enquiries are submitted.</span></div></footer>`;
}
function render() {
  const s = state(),
    c = concepts[s.concept];
  document.body.dataset.concept = s.concept;
  document.title = `Luxurry — ${c.full} | Concept Demo`;
  $("#app").innerHTML =
    header(s, c) +
    `<main id="main" tabindex="-1">${
      s.view === "home"
        ? home(s, c)
        : s.view === "products"
          ? catalog(s)
          : s.view === "inspiration"
            ? inspiration()
            : s.view === "professionals"
              ? professionals()
              : contact()
    }</main>` +
    footer() +
    (comparison.length
      ? `<div class="compare-tray"><span>${comparison.length} ${
          comparison.length === 1 ? "product" : "products"
        } selected</span><button class="button primary" data-open-compare>Compare products ${icon(
          "arrow",
        )}</button><button data-clear-compare aria-label="Clear comparison">${icon(
          "close",
        )}</button></div>`
      : "");
  bind();
}
function notice(message) {
  $("#notice").textContent = message;
  $("#notice").classList.add("show");
  clearTimeout(window.noticeTimer);
  window.noticeTimer = setTimeout(
    () => $("#notice").classList.remove("show"),
    3200,
  );
}
function addShortlist(id) {
  if (!shortlist.includes(id)) {
    shortlist.push(id);
    try {
      localStorage.setItem("luxurry-demo-shortlist", JSON.stringify(shortlist));
    } catch {}
    render();
    notice("Product added to your enquiry shortlist.");
  } else notice("This product is already in your shortlist.");
}
function showProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const d = $("#product-dialog");
  d.innerHTML = `<button class="dialog-close" data-close aria-label="Close product">${icon(
    "close",
  )}</button><div class="detail-layout">${productImage(
    p,
  )}<div class="detail-content"><p class="eyebrow">${p.collection.toUpperCase()} COLLECTION · SAMPLE PRODUCT</p><h2 id="dialog-title">${
    p.name
  }</h2><p class="detail-price">${money(
    p.price,
  )} <small>Illustrative price</small></p><p>${p.description}</p><dl>${[
    ["Finish", p.finish],
    ["Dimensions", p.size],
    ["Material", p.material],
    ["Product reference", p.id.toUpperCase()],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("")}</dl><button class="button primary" data-add="${p.id}">${icon(
    "plus",
  )} Add to enquiry shortlist</button><button class="download-link" data-spec="${
    p.id
  }">${icon(
    "download",
  )} Download sample specification (PDF)</button><p class="sample-note">Concept product and illustrative image. Final specifications, prices and availability require confirmation.</p></div></div>`;
  bind(d);
  d.showModal();
}
function showCompare() {
  const chosen = products.filter((p) => comparison.includes(p.id));
  if (!chosen.length) return;
  const d = $("#compare-dialog");
  d.innerHTML = `<button class="dialog-close" data-close aria-label="Close comparison">${icon(
    "close",
  )}</button><p class="eyebrow">FIND YOUR FIT</p><h2 id="compare-title">The details, side by side.</h2><div class="comparison-scroll"><table><caption class="sr-only">Sample product comparison</caption><thead><tr><th scope="col">Product</th>${chosen
    .map(
      (p) =>
        `<th scope="col">${productImage(p)}<h3>${
          p.name
        }</h3><button class="text-link" data-add="${
          p.id
        }">Add to enquiry +</button></th>`,
    )
    .join("")}</tr></thead><tbody>${[
    ["Concept price", (p) => money(p.price)],
    ["Finish", (p) => p.finish],
    ["Dimensions", (p) => p.size],
    ["Material", (p) => p.material],
    ["Collection", (p) => p.collection],
  ]
    .map(
      ([label, fn]) =>
        `<tr><th scope="row">${label}</th>${chosen
          .map((p) => `<td>${fn(p)}</td>`)
          .join("")}</tr>`,
    )
    .join(
      "",
    )}</tbody></table></div><p class="sample-note">All details shown are sample data for concept review.</p>`;
  bind(d);
  d.showModal();
}
function showEnquiry() {
  const chosen = products.filter((p) => shortlist.includes(p.id));
  const d = $("#enquiry-dialog");
  d.innerHTML = `<button class="dialog-close" data-close aria-label="Close enquiry">${icon(
    "close",
  )}</button><p class="eyebrow">YOUR NEXT SPACE</p><h2 id="enquiry-title">Bring your ideas together.</h2><p class="dialog-intro">Prepare a brief for your project. This demo does not send messages or place orders.</p><div class="enquiry-products">${
    chosen.length
      ? chosen
          .map(
            (p) =>
              `<div>${productImage(p)}<div><h3>${p.name}</h3><span>${
                p.finish
              } · ${money(p.price)}</span></div><button data-remove="${
                p.id
              }" aria-label="Remove ${p.name}">${icon("close")}</button></div>`,
          )
          .join("")
      : "<p>No products shortlisted yet. You can still prepare a project enquiry, or browse the catalog to add products.</p>"
  }</div><form id="enquiry-form"><div class="form-row"><label>Your name<input name="name" autocomplete="name" placeholder="Name" maxlength="120"></label><label>Email address<input type="email" name="email" autocomplete="email" placeholder="you@example.com" maxlength="200"></label></div><label>Project notes<textarea name="notes" rows="4" placeholder="Tell us about your space, quantities and preferred finishes…" maxlength="3000"></textarea></label><button type="submit" class="button primary">${icon(
    "download",
  )} Download enquiry brief</button><p class="sample-note">Your contact details are used only to create the downloaded brief. They are not saved or submitted by this demo. The product shortlist is stored on this device; clear it anytime.</p></form>${
    chosen.length
      ? '<button class="text-link" data-clear-shortlist>Clear shortlist</button>'
      : ""
  }`;
  bind(d);
  d.showModal();
  $("#enquiry-form").onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const text = [
      "LUXURRY — DEMO PROJECT ENQUIRY",
      "Not submitted. Sample products, specifications and prices.",
      `Name: ${data.get("name") || "Not provided"}`,
      `Email: ${data.get("email") || "Not provided"}`,
      "",
      "SHORTLIST",
      ...chosen.map(
        (p) =>
          `${p.name} | ${p.id} | ${p.finish} | Sample price BDT ${p.price}`,
      ),
      "",
      "PROJECT NOTES",
      data.get("notes") || "Not provided",
    ].join("\n");
    download(text, "luxurry-demo-enquiry.txt", "text/plain");
    notice("Enquiry brief downloaded. Nothing has been sent.");
  };
}
function download(content, name, type) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}
function spec(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const rows = [
    "LUXURRY / SAMPLE SPECIFICATION",
    "CONCEPT DEMO - NOT FOR INSTALLATION",
    "",
    p.name,
    `Reference: ${p.id.toUpperCase()}`,
    `Collection: ${p.collection}`,
    `Finish: ${p.finish}`,
    `Dimensions: ${p.size.replaceAll("×", "x")}`,
    `Material: ${p.material}`,
    `Illustrative price: BDT ${p.price}`,
    "",
    "All data and imagery in this demo are illustrative.",
    "Verify actual technical drawings and specifications",
    "with the supplier before procurement or installation.",
  ];
  const safe = (s) =>
    s.replace(/[^\x20-\x7E]/g, " ").replace(/[\\()]/g, "\\$&");
  let stream =
    "BT /F1 13 Tf 55 780 Td 22 TL\n" +
    rows.map((x, i) => (i ? "T* " : "") + `(${safe(x)}) Tj`).join("\n") +
    "\nET";
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let out = "%PDF-1.4\n",
    offsets = [0];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const start = out.length;
  out +=
    `xref\n0 6\n0000000000 65535 f \n` +
    offsets
      .slice(1)
      .map((n) => `${String(n).padStart(10, "0")} 00000 n \n`)
      .join("") +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  download(out, `${p.id}-sample-specification.pdf`, "application/pdf");
}
function bind(root = document) {
  root.querySelectorAll("[data-route]").forEach(
    (a) =>
      (a.onclick = (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        history.pushState({}, "", a.getAttribute("href"));
        render();
        window.scrollTo({ top: 0, behavior: "instant" });
      }),
  );
  root.querySelectorAll("[data-search]").forEach(
    (f) =>
      (f.onsubmit = (e) => {
        e.preventDefault();
        go({ view: "products", search: new FormData(f).get("search").trim() });
      }),
  );
  root
    .querySelectorAll("[data-product]")
    .forEach((b) => (b.onclick = () => showProduct(b.dataset.product)));
  root
    .querySelectorAll("[data-enquiry]")
    .forEach((b) => (b.onclick = showEnquiry));
  root.querySelectorAll("[data-compare]").forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.compare;
        if (comparison.includes(id))
          comparison = comparison.filter((x) => x !== id);
        else {
          if (comparison.length >= 3) {
            notice("Compare up to three products. Remove one to add another.");
            return;
          }
          comparison.push(id);
        }
        render();
      }),
  );
  root
    .querySelectorAll("[data-open-compare]")
    .forEach((b) => (b.onclick = showCompare));
  root.querySelectorAll("[data-clear-compare]").forEach(
    (b) =>
      (b.onclick = () => {
        comparison = [];
        render();
      }),
  );
  root
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = () => b.closest("dialog").close()));
  root
    .querySelectorAll("[data-add]")
    .forEach((b) => (b.onclick = () => addShortlist(b.dataset.add)));
  root
    .querySelectorAll("[data-spec]")
    .forEach((b) => (b.onclick = () => spec(b.dataset.spec)));
  root.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        shortlist = shortlist.filter((x) => x !== b.dataset.remove);
        try {
          localStorage.setItem(
            "luxurry-demo-shortlist",
            JSON.stringify(shortlist),
          );
        } catch {}
        $("#enquiry-dialog").close();
        render();
        showEnquiry();
      }),
  );
  root.querySelectorAll("[data-clear-shortlist]").forEach(
    (b) =>
      (b.onclick = () => {
        shortlist = [];
        try {
          localStorage.removeItem("luxurry-demo-shortlist");
        } catch {}
        $("#enquiry-dialog").close();
        render();
        showEnquiry();
      }),
  );
  const sort = root.querySelector("#sort");
  if (sort) sort.onchange = () => go({ sort: sort.value });
  const menu = root.querySelector(".mobile-toggle");
  if (menu)
    menu.onclick = () => {
      const nav = $(".mobile-nav");
      nav.hidden = !nav.hidden;
      menu.setAttribute("aria-expanded", String(!nav.hidden));
      menu.setAttribute(
        "aria-label",
        nav.hidden ? "Open navigation" : "Close navigation",
      );
    };
}
window.addEventListener("popstate", render);
document.querySelectorAll("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
render();
