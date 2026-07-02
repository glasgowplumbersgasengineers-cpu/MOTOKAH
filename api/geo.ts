const COUNTRY_NAMES: Record<string, string> = {
  TZ: "Tanzania",
  KE: "Kenya",
  UG: "Uganda",
  RW: "Rwanda",
  BI: "Burundi",
  ET: "Ethiopia",
  NG: "Nigeria",
};

const SUPPORTED_COUNTRIES = new Set(Object.keys(COUNTRY_NAMES));

function headerValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function decodeHeader(value: string | string[] | undefined) {
  const raw = headerValue(value);
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function sendJson(res: any, status: number, body: Record<string, unknown>) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.motokah.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const vercelCountry = decodeHeader(req.headers["x-vercel-ip-country"]).toUpperCase();
  const vercelCity = decodeHeader(req.headers["x-vercel-ip-city"]);

  if (SUPPORTED_COUNTRIES.has(vercelCountry)) {
    sendJson(res, 200, {
      country_code: vercelCountry,
      country_name: COUNTRY_NAMES[vercelCountry],
      city: vercelCity,
      source: "vercel",
    });
    return;
  }

  try {
    const upstream = await fetch("https://ipapi.co/json/", {
      headers: { "User-Agent": "Motokah/1.0" },
      signal: AbortSignal.timeout(4000),
    });

    if (!upstream.ok) throw new Error(`ipapi ${upstream.status}`);
    const data = await upstream.json();
    const countryCode = String(data.country_code || "").toUpperCase();

    if (SUPPORTED_COUNTRIES.has(countryCode)) {
      sendJson(res, 200, {
        country_code: countryCode,
        country_name: COUNTRY_NAMES[countryCode],
        city: data.city || "",
        source: "ipapi",
      });
      return;
    }
  } catch {
    // Fall through to the deterministic default below.
  }

  sendJson(res, 200, {
    country_code: "TZ",
    country_name: "Tanzania",
    city: "Dar es Salaam",
    source: "fallback",
  });
}
