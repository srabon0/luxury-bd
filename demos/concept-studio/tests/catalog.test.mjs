import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterProducts,
  normalizeIds,
  products,
  concepts,
} from "../dist/catalog.mjs";
test("all three concepts share a complete eight-product catalog", () => {
  assert.equal(Object.keys(concepts).length, 3);
  assert.equal(filterProducts().length, 8);
  assert.equal(new Set(products.map((p) => p.id)).size, 8);
});
test("category and case-insensitive search intersect correctly", () => {
  assert.deepEqual(
    filterProducts({ category: "faucets", search: " CHROME " }).map(
      (p) => p.id,
    ),
    ["arc-mixer", "arc-tall"],
  );
  assert.equal(
    filterProducts({ category: "basins", search: "Chrome" }).length,
    0,
  );
});
test("sorting does not mutate the shared catalog", () => {
  const before = products.map((p) => p.id);
  const ascending = filterProducts({ sort: "price-up" });
  assert.equal(ascending[0].id, "arc-mixer");
  assert.equal(filterProducts({ sort: "price-down" })[0].id, "linea-wall");
  assert.deepEqual(
    products.map((p) => p.id),
    before,
  );
});
test("untrusted persisted shortlist is deduplicated and validated", () => {
  assert.deepEqual(
    normalizeIds(["forma-oval", "unknown", "forma-oval", null]),
    ["forma-oval"],
  );
  assert.deepEqual(normalizeIds({}), []);
});
test("unmatched search returns an honest empty result", () => {
  assert.deepEqual(filterProducts({ search: "not-a-real-product" }), []);
});
