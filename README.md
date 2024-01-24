# @natsuneko-laboratory/smxml

Create valid sitemap with builder pattern, written in TypeScript.

## Install

```bash
$ npm install @natsuneko-laboratory/smxml
$ yarn add @natsuneko-laboratory/smxml
$ pnpm add @natsuneko-laboratory/smxml
```

## Usage

```typescript
import { SitemapBuilder } from "@natsuneko-laboratory/smxml";

// create base builder
const base = SitemapBuilder.create("https://www.natsuneko.blog");

// create sitemap index
const index = base.asIndex().addLocation({ url: "/sitemap-0.xml" });

console.log(index.build());
// <?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.natsuneko.blog/sitemap-0.xml</loc></sitemap></sitemapindex>

console.log(index.build({ minified: false }));
/*
 * <?xml version="1.0" encoding="UTF-8"?>
 * <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *   <sitemap>
 *     <loc>https://www.natsuneko.blog/sitemap-0.xml</loc>
 *   </sitemap>
 * </sitemapindex>
 */

// create sitemap index
const urls = base.asUrlSet().addUrl({
  loc: "/categories",
  lastMod: new Date(),
  changeFreq: "daily",
  priority: 0.7,
});

console.log(urls.build({ minified: false }));
/*
 * <?xml version="1.0" encoding="UTF-8"?>
 * <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *   <url>
 *     <loc>https://www.natsuneko.blog/categories</loc>
 *     <lastmod>2024-01-24T14:33:13.603Z</lastmod>
 *     <changefreq>daily</changefreq>
 *     <priority>0.7</priority>
 *   </url>
 * </urlset>
 */
```

## License

MIT by [@6jz](https://twitter.com/6jz)
