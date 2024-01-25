import { describe, expect, it } from "vitest";

import { SitemapBuilder } from "./main";

const context = describe;

const base = SitemapBuilder.create("https://www.natsuneko.blog");

describe("index", () => {
  const index = base.asIndex();

  context("build with empty", () => {
    it("returns empty sitemapindex", () => {
      expect(index.build()).toMatchInlineSnapshot(
        `"<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>"`
      );
      expect(index.build({ minified: false })).toMatchInlineSnapshot(`
        "<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        </sitemapindex>"
      `);
    });
  });

  context("build with items", () => {
    const LOC = (rel: string) => `<loc>https://www.natsuneko.blog${rel}</loc>`;
    const WRAP_SM = (content: string) => `<sitemap>${content}</sitemap>`;
    const LAST_MOD = "<lastmod>2024-01-25T11:00:00.000Z</lastmod>";

    context("with one item", () => {
      context("with relative url", () => {
        context("without lastMod", () => {
          it("returns sitemap > loc", () => {
            const a = index.addLocation({
              url: "/sitemap-0.xml",
            });

            expect(a.build()).contain(WRAP_SM(LOC("/sitemap-0.xml")));
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.natsuneko.blog/sitemap-0.xml</loc></sitemap></sitemapindex>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <sitemap>
                  <loc>https://www.natsuneko.blog/sitemap-0.xml</loc>
                </sitemap>
              </sitemapindex>"
            `);
          });
        });

        context("with lastMod", () => {
          it("returns sitemap > loc + lastmod", () => {
            const a = index.addLocation({
              url: "/sitemap-0.xml",
              lastMod: new Date("2024-01-25 20:00:00"),
            });

            expect(a.build()).contain(LOC("/sitemap-0.xml"));
            expect(a.build()).contain(LAST_MOD);
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.natsuneko.blog/sitemap-0.xml</loc><lastmod>2024-01-25T11:00:00.000Z</lastmod></sitemap></sitemapindex>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <sitemap>
                  <loc>https://www.natsuneko.blog/sitemap-0.xml</loc>
                  <lastmod>2024-01-25T11:00:00.000Z</lastmod>
                </sitemap>
              </sitemapindex>"
            `);
          });
        });
      });

      context("with absolute url", () => {
        it("returns sitemap > loc", () => {
          const a = index.addLocation({
            url: "https://www.natsuneko.blog/sitemap-0.xml",
          });

          expect(a.build()).contain(WRAP_SM(LOC("/sitemap-0.xml")));
          expect(a.build()).toMatchInlineSnapshot(
            `"<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.natsuneko.blog/sitemap-0.xml</loc></sitemap></sitemapindex>"`
          );
          expect(a.build({ minified: false })).toMatchInlineSnapshot(`
            "<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <sitemap>
                <loc>https://www.natsuneko.blog/sitemap-0.xml</loc>
              </sitemap>
            </sitemapindex>"
          `);
        });
      });
    });

    context("with two or more items", () => {
      it("returns sitemap > loc", () => {
        const a = index
          .addLocation({
            url: "https://www.natsuneko.blog/sitemap-0.xml",
          })
          .addLocation({
            url: "https://www.natsuneko.blog/sitemap-1.xml",
          });

        expect(a.build()).contain(WRAP_SM(LOC("/sitemap-0.xml")));
        expect(a.build()).contain(WRAP_SM(LOC("/sitemap-1.xml")));
        expect(a.build()).toMatchInlineSnapshot(
          `"<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.natsuneko.blog/sitemap-0.xml</loc></sitemap><sitemap><loc>https://www.natsuneko.blog/sitemap-1.xml</loc></sitemap></sitemapindex>"`
        );
        expect(a.build({ minified: false })).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <sitemap>
              <loc>https://www.natsuneko.blog/sitemap-0.xml</loc>
            </sitemap>
            <sitemap>
              <loc>https://www.natsuneko.blog/sitemap-1.xml</loc>
            </sitemap>
          </sitemapindex>"
        `);
      });
    });
  });
});

describe("url sets", () => {
  const sets = base.asUrlSet();

  context("build with empty", () => {
    it("returns empty urlset", () => {
      expect(sets.build()).toMatchInlineSnapshot(
        `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>"`
      );
      expect(sets.build({ minified: false })).toMatchInlineSnapshot(`
        "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        </urlset>"
      `);
    });
  });

  context("build with items", () => {
    const LOC = (rel: string) => `<loc>https://www.natsuneko.blog${rel}</loc>`;
    const WRAP_URL = (content: string) => `<url>${content}</url>`;
    const LAST_MOD = "<lastmod>2024-01-25T11:00:00.000Z</lastmod>";
    const CHANGE_FREQ = "<changefreq>daily</changefreq>";
    const PRIORITY = "<priority>0.7</priority>";

    context("with one item", () => {
      context("with relative url", () => {
        context("without lastMod", () => {
          it("returns url > loc", () => {
            const a = sets.addUrl({
              loc: "/about",
            });

            expect(a.build()).contain(WRAP_URL(LOC("/about")));
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc></url></urlset>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>https://www.natsuneko.blog/about</loc>
                </url>
              </urlset>"
            `);
          });
        });

        context("with lastMod", () => {
          it("returns url > loc + lastmod", () => {
            const a = sets.addUrl({
              loc: "/about",
              lastMod: new Date("2024-01-25 20:00:00"),
            });

            expect(a.build()).contain(LOC("/about"));
            expect(a.build()).contain(LAST_MOD);
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc><lastmod>2024-01-25T11:00:00.000Z</lastmod></url></urlset>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>https://www.natsuneko.blog/about</loc>
                  <lastmod>2024-01-25T11:00:00.000Z</lastmod>
                </url>
              </urlset>"
            `);
          });
        });

        context("with frequency", () => {
          it("returns url > loc + changefreq", () => {
            const a = sets.addUrl({
              loc: "/about",
              changeFreq: "daily",
            });

            expect(a.build()).contain(LOC("/about"));
            expect(a.build()).contain(CHANGE_FREQ);
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc><changefreq>daily</changefreq></url></urlset>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>https://www.natsuneko.blog/about</loc>
                  <changefreq>daily</changefreq>
                </url>
              </urlset>"
            `);
          });
        });

        context("with priority", () => {
          it("returns url > loc + priority", () => {
            const a = sets.addUrl({
              loc: "/about",
              priority: 0.7,
            });

            expect(a.build()).contain(LOC("/about"));
            expect(a.build()).contain(PRIORITY);
            expect(a.build()).toMatchInlineSnapshot(
              `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc><priority>0.7</priority></url></urlset>"`
            );
            expect(a.build({ minified: false })).toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>https://www.natsuneko.blog/about</loc>
                  <priority>0.7</priority>
                </url>
              </urlset>"
            `);
          });
        });
      });

      context("with absolute url", () => {
        it("returns url > loc", () => {
          const a = sets.addUrl({
            loc: "https://www.natsuneko.blog/about",
          });

          expect(a.build()).contain(WRAP_URL(LOC("/about")));
          expect(a.build()).toMatchInlineSnapshot(
            `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc></url></urlset>"`
          );
          expect(a.build({ minified: false })).toMatchInlineSnapshot(`
            "<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <url>
                <loc>https://www.natsuneko.blog/about</loc>
              </url>
            </urlset>"
          `);
        });
      });
    });

    context("with two or more items", () => {
      it("returns sitemap > loc", () => {
        const a = sets
          .addUrl({
            loc: "https://www.natsuneko.blog/about",
          })
          .addUrl({
            loc: "https://www.natsuneko.blog/categories",
          });

        expect(a.build()).contain(WRAP_URL(LOC("/about")));
        expect(a.build()).contain(WRAP_URL(LOC("/categories")));
        expect(a.build()).toMatchInlineSnapshot(
          `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.natsuneko.blog/about</loc></url><url><loc>https://www.natsuneko.blog/categories</loc></url></urlset>"`
        );
        expect(a.build({ minified: false })).toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
              <loc>https://www.natsuneko.blog/about</loc>
            </url>
            <url>
              <loc>https://www.natsuneko.blog/categories</loc>
            </url>
          </urlset>"
        `);
      });
    });
  });
});
