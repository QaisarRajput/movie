const SEARCH_BOT_UA = /(googlebot|google-inspectiontool|bingbot|duckduckbot|yandexbot|baiduspider|applebot)/i;
const PREVIEW_BOT_UA = /(facebookexternalhit|facebot|twitterbot|xbot|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|skypeuripreview|pinterest|vkshare)/i;

function isCrawler(ua) {
  return SEARCH_BOT_UA.test(ua) || PREVIEW_BOT_UA.test(ua);
}

function parseBool(value, defaultValue = false) {
  if (value == null) return defaultValue;
  return String(value).toLowerCase() === "true" || String(value) === "1";
}

function isHtmlRequest(req) {
  const accept = req.headers.get("accept") || "";
  if (!accept) return true;
  return accept.includes("text/html") || accept.includes("*/*");
}

function getMovieIdFromUrl(url) {
  const full = `${url.pathname}${url.search}${url.hash || ""}`;
  const hashMatch = full.match(/#\/movie\/([^/?#]+)/);
  if (hashMatch) {
    const segment = hashMatch[1];
    if (/^\d+$/.test(segment)) return segment;
    const hashEndId = segment.match(/-(\d+)$/);
    if (hashEndId) return hashEndId[1];
  }

  const pathMatch = url.pathname.match(/^\/movie\/([^/?#]+)/);
  if (pathMatch) {
    const segment = pathMatch[1];
    if (/^\d+$/.test(segment)) return segment;
    const pathEndId = segment.match(/-(\d+)$/);
    if (pathEndId) return pathEndId[1];
  }

  const queryId = url.searchParams.get("movie_id");
  if (queryId && /^\d+$/.test(queryId)) return queryId;

  return null;
}

function isAssetPath(pathname) {
  if (
    pathname.startsWith("/static/") ||
    pathname.startsWith("/favicons/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json"
  ) {
    return true;
  }

  return /\.(css|js|map|png|jpg|jpeg|webp|svg|ico|txt|xml|webmanifest|json)$/i.test(pathname);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchMovie(ytsBase, movieId) {
  const endpoint = `${ytsBase}/movie_details.json?movie_id=${encodeURIComponent(movieId)}`;
  const res = await fetch(endpoint, {
    headers: {
      "user-agent": "movie-social-preview-worker/1.0",
      accept: "application/json",
    },
  });

  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json || json.status !== "ok" || !json.data?.movie) return null;

  return json.data.movie;
}

function buildMetaTags({ title, description, image, canonicalUrl }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeCanonical = escapeHtml(canonicalUrl);

  return [
    `<meta property=\"og:title\" content=\"${safeTitle}\" />`,
    `<meta property=\"og:description\" content=\"${safeDesc}\" />`,
    `<meta property=\"og:image\" content=\"${safeImage}\" />`,
    `<meta property=\"og:type\" content=\"video.movie\" />`,
    `<meta property=\"og:url\" content=\"${safeCanonical}\" />`,
    `<meta name=\"twitter:card\" content=\"summary_large_image\" />`,
    `<meta name=\"twitter:title\" content=\"${safeTitle}\" />`,
    `<meta name=\"twitter:description\" content=\"${safeDesc}\" />`,
    `<meta name=\"twitter:image\" content=\"${safeImage}\" />`,
    `<meta name=\"description\" content=\"${safeDesc}\" />`,
    `<link rel=\"canonical\" href=\"${safeCanonical}\" />`,
    `<meta name=\"robots\" content=\"index,follow\" />`,
    `<title>${safeTitle} | Movie Download Online</title>`,
  ].join("\n");
}

function injectIntoHead(html, injected) {
  const closeHead = html.indexOf("</head>");
  if (closeHead === -1) return html;
  return `${html.slice(0, closeHead)}\n${injected}\n${html.slice(closeHead)}`;
}

function stripExistingSeoTags(html) {
  if (!html) return html;

  // Remove static/default SEO tags so crawlers don't prefer earlier generic tags.
  const patterns = [
    /<title[\s\S]*?<\/title>/gi,
    /<meta[^>]+name=["'](?:description|title|robots|twitter:card|twitter:title|twitter:description|twitter:image|twitter:url)["'][^>]*>/gi,
    /<meta[^>]+property=["'](?:og:title|og:description|og:image|og:type|og:url|twitter:title|twitter:description|twitter:image|twitter:url)["'][^>]*>/gi,
    /<link[^>]+rel=["']canonical["'][^>]*>/gi,
  ];

  return patterns.reduce((out, regex) => out.replace(regex, ""), html);
}

function getCanonicalUrl(appOrigin, url) {
  return `${appOrigin}${url.pathname}${url.search}`;
}

function getMetaPayload({ movie, defaultImage, canonicalUrl }) {
  const title = movie?.title_long || movie?.title || "Movie Download Online";
  const description =
    movie?.description_full ||
    movie?.summary ||
    "Discover and download movies with rich metadata and magnet links.";
  const image = movie?.large_cover_image || movie?.medium_cover_image || defaultImage;

  return { title, description, image, canonicalUrl };
}

async function handleSeoDebug(url, env, userAgent) {
  const appOrigin = env.APP_ORIGIN || "https://movie.hubs.dpdns.org";
  const ytsBase = env.YTS_API_BASE || "https://yts.gg/api/v2";
  const defaultImage = env.DEFAULT_OG_IMAGE || `${appOrigin}/cover.png`;

  const requestedPath = url.searchParams.get("path") || "/";
  const normalizedPath = requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`;
  const requestedUrl = new URL(normalizedPath, appOrigin);

  const movieId = getMovieIdFromUrl(requestedUrl);
  const movie = movieId ? await fetchMovie(ytsBase, movieId) : null;
  const canonicalUrl = getCanonicalUrl(appOrigin, requestedUrl);
  const payload = getMetaPayload({ movie, defaultImage, canonicalUrl });

  const response = {
    ok: true,
    mode: "seo-debug",
    crawlerDetected: isCrawler(userAgent),
    targetPath: `${requestedUrl.pathname}${requestedUrl.search}`,
    movieId,
    movieFound: Boolean(movie),
    metadata: payload,
    injectedTags: buildMetaTags(payload),
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("user-agent") || "";

    const appOrigin = env.APP_ORIGIN || "https://movie.hubs.dpdns.org";
    const ytsBase = env.YTS_API_BASE || "https://yts.gg/api/v2";
    const defaultImage = env.DEFAULT_OG_IMAGE || `${appOrigin}/cover.png`;

    const debugEnabled = parseBool(env.SEO_DEBUG_ENDPOINT_ENABLED, true);
    const debugLogsEnabled = parseBool(env.SEO_DEBUG_LOGS, false);
    const isBot = isCrawler(userAgent);

    if (debugEnabled && url.pathname === "/__seo-debug") {
      return handleSeoDebug(url, env, userAgent);
    }

    const upstreamUrl = new URL(url);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = new URL(appOrigin).hostname;
    upstreamUrl.port = "";

    // BrowserRouter support on static origin: serve SPA shell for non-asset paths.
    if (!isAssetPath(upstreamUrl.pathname)) {
      upstreamUrl.pathname = "/";
      upstreamUrl.search = "";
    }

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        accept: request.headers.get("accept") || "text/html,application/xhtml+xml",
      },
    });

    if (request.method !== "GET" || !isBot || !isHtmlRequest(request) || upstreamRes.status >= 400) {
      return upstreamRes;
    }

    const movieId = getMovieIdFromUrl(url);
    const movie = movieId ? await fetchMovie(ytsBase, movieId) : null;

    const canonicalUrl = getCanonicalUrl(appOrigin, url);
    const payload = getMetaPayload({ movie, defaultImage, canonicalUrl });

    const html = stripExistingSeoTags(await upstreamRes.text());
    const injected = buildMetaTags(payload);
    const rewritten = injectIntoHead(html, injected);

    const headers = new Headers(upstreamRes.headers);
    headers.set("content-type", "text/html; charset=UTF-8");
    headers.set("cache-control", "public, max-age=120");
    headers.set("x-seo-meta-injected", movie ? "movie" : "fallback");
    headers.set("x-seo-movie-id", movieId || "none");

    if (debugLogsEnabled) {
      console.log(
        JSON.stringify({
          at: "seo-injection",
          path: `${url.pathname}${url.search}`,
          userAgent,
          movieId,
          movieFound: Boolean(movie),
          canonicalUrl,
          title: payload.title,
        }),
      );
    }

    return new Response(rewritten, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    });
  },
};
