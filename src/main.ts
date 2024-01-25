const XML_DECLARATION = `<?xml version="1.0" encoding="UTF-8"?>`;

const XML_ESCAPE: Record<number, string> = {
  34: "&quot;", // ""
  38: "&amp;", // &
  39: "&apos;", // '
  60: "&lt;", // <
  62: "&gt;", // >
};

class XmlItem {
  constructor(
    private readonly type: string,
    private readonly attributes: Record<string, string> | null = null,
    private readonly children: string | XmlItem[] | null = null
  ) {}

  private static encode(str: string): string {
    let s = "";

    for (const char of str) {
      const code = char.charCodeAt(0);
      if (code && XML_ESCAPE[code]) {
        s += XML_ESCAPE[code];
      } else {
        s += char;
      }
    }

    return s;
  }

  public toXml(
    opts: { minified?: boolean; indent?: number } = {
      minified: true,
      indent: 2,
    }
  ): string {
    const nl = (isEmpty: boolean = false) =>
      opts.minified ? "" : isEmpty ? "" : "\n";
    const sp = (
      args: { additional?: number; isEmpty?: boolean } = {
        additional: 0,
        isEmpty: false,
      }
    ) =>
      opts.minified
        ? ""
        : args.isEmpty
          ? ""
          : " ".repeat((opts.indent ?? 0) + (args.additional ?? 0));

    const attributes = this.attributes
      ? Object.keys(this.attributes)
          .map((w) => `${w}="${XmlItem.encode(this.attributes![w])}"`)
          .join(" ")
      : "";

    const content = this.children
      ? Array.isArray(this.children)
        ? this.children
            .map((w) => w.toXml({ ...opts, indent: (opts.indent ?? 0) + 2 }))
            .join(nl())
        : this.children
      : "";

    const isChildrenIsNotString = !Array.isArray(this.children);
    const innerText = `${nl(isChildrenIsNotString)}${content}${nl(isChildrenIsNotString)}`;
    return `${sp()}<${this.type}${attributes === "" ? "" : ` ${attributes}`}>${this.children?.length ? innerText : nl()}${sp({ isEmpty: isChildrenIsNotString })}</${this.type}>`;
  }
}

class XmlBuilder {
  private readonly items: XmlItem[] = [];

  public add(...items: XmlItem[]): void {
    this.items.push(...items);
  }

  public toStr(opts: { minified?: boolean } = { minified: true }): string {
    return `${XML_DECLARATION}${opts.minified ? "" : "\n"}${this.items.map((w) => w.toXml(opts)).join("\n")}`;
  }
}

class SitemapBuilder {
  private constructor(public readonly baseUrl: string) {}

  public static create(baseUrl: string): SitemapBuilder {
    return new SitemapBuilder(baseUrl);
  }

  public asIndex(): SitemapIndexBuilder {
    return SitemapIndexBuilder.createWithRoot(this);
  }

  public asUrlSet(): SitemapUrlSetBuilder {
    return SitemapUrlSetBuilder.createWithRoot(this);
  }
}

type SitemapLocation = { url: string; lastMod?: Date };

class SitemapIndexBuilder {
  private constructor(
    private readonly root: SitemapBuilder,
    private readonly locations: SitemapLocation[] = []
  ) {}

  public static createWithRoot(root: SitemapBuilder): SitemapIndexBuilder {
    return new SitemapIndexBuilder(root, []);
  }

  public addLocation(arg: SitemapLocation): SitemapIndexBuilder {
    const newLocations = [...this.locations, arg];
    return new SitemapIndexBuilder(this.root, newLocations);
  }

  public build(opts?: Parameters<XmlBuilder["toStr"]>[0]): string {
    const index = new XmlItem(
      "sitemapindex",
      {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
      },
      this.locations.map((w) => this.toContent(w))
    );
    const sb = new XmlBuilder();
    sb.add(index);

    return sb.toStr(opts);
  }

  private toContent(loc: SitemapLocation): XmlItem {
    const url =
      loc.url.startsWith("http://") || loc.url.startsWith("https://")
        ? loc.url
        : `${this.root.baseUrl}${loc.url}`;

    const children: XmlItem[] = [new XmlItem("loc", null, url)];

    if (loc.lastMod) {
      children.push(new XmlItem("lastmod", null, loc.lastMod.toISOString()));
    }

    return new XmlItem("sitemap", null, children);
  }
}

type SitemapUrl = {
  loc: string;
  lastMod?: Date;
  changeFreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

class SitemapUrlSetBuilder {
  private constructor(
    private readonly root: SitemapBuilder,
    private readonly urls: SitemapUrl[] = []
  ) {}

  public static createWithRoot(root: SitemapBuilder): SitemapUrlSetBuilder {
    return new SitemapUrlSetBuilder(root, []);
  }

  public addUrl(arg: SitemapUrl): SitemapUrlSetBuilder {
    const newUrls = [...this.urls, arg];
    return new SitemapUrlSetBuilder(this.root, newUrls);
  }

  public build(opts?: Parameters<XmlBuilder["toStr"]>[0]): string {
    const set = new XmlItem(
      "urlset",
      {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
      },
      this.urls.map((w) => this.toContent(w))
    );
    const sb = new XmlBuilder();
    sb.add(set);

    return sb.toStr(opts);
  }

  private toContent(url: SitemapUrl): XmlItem {
    const loc =
      url.loc.startsWith("http://") || url.loc.startsWith("https://")
        ? url.loc
        : `${this.root.baseUrl}${url.loc}`;

    const children: XmlItem[] = [new XmlItem("loc", null, loc)];

    if (url.lastMod) {
      children.push(new XmlItem("lastmod", null, url.lastMod.toISOString()));
    }

    if (url.changeFreq) {
      children.push(new XmlItem("changefreq", null, url.changeFreq));
    }

    if (url.priority) {
      children.push(new XmlItem("priority", null, `${url.priority}`));
    }

    return new XmlItem("url", null, children);
  }
}

export { SitemapBuilder };
