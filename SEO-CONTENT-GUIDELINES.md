# Motokah SEO Content Guidelines

All landing pages and blog posts must follow these rules without exception.
No content ships without passing every rule in the relevant section.

---

## 1. Purpose

Motokah is East Africa's car marketplace. Content exists to:
- Rank on Google for car-buying queries in East Africa
- Bring in real buyers and sellers
- Build trust with genuine, useful information

Content is NOT: keyword stuffing, AI filler, tourism copy, or generic automotive text
copy-pasted from a Western market.

---

## 2. Core Content Rules (all pages)

### 2.1 Specificity over generality
Every page must contain at least THREE of:
- Specific price ranges in local currency (KES, TZS, UGX, RWF, ETB)
- Specific city neighbourhoods, roads, or dealer areas
- Specific model years relevant to that market
- Specific import regulations, taxes, or documentation required
- Specific makes/models popular in that city/country

BAD: "You can find many great cars in Nairobi at affordable prices."
GOOD: "Toyota Probox prices in Nairobi range from KES 400,000 to KES 900,000. Most dealers
are on Kirinyaga Road and Ngong Road. Look for 2010-2016 models with under 150,000km."

### 2.2 No em dashes, ever
Use commas, colons, or full stops instead. No — anywhere.

### 2.3 No filler phrases
Remove on sight:
- "whether you're looking for..."
- "look no further"
- "your dream car"
- "the perfect vehicle"
- "wide range of"
- "competitive prices"
- "we've got you covered"
- "in today's fast-paced world"
- Any phrase that could appear on any car site anywhere in the world

### 2.4 East Africa specificity
Every piece of content must reference something that ONLY applies to East Africa:
- TRA (Tanzania Revenue Authority) for Tanzania import pages
- NTSA / KRA for Kenya pages
- URA for Uganda pages
- Vehicle age restrictions in Rwanda (max 10 years for most categories)
- Right-hand drive preference across the region
- Japanese import market as primary source
- Specific road conditions (upcountry, highland, safari routes)

### 2.5 Minimum word counts
- City landing page: 200 words body text (not counting listings)
- Model landing page: 400 words guide
- Country landing page: 300 words guide
- City x make page: 150 words combined (city context + make notes)
- Model x city page: 150 words combined
- Blog post: 800 words minimum, 1,200-1,800 words target

### 2.6 Prices must be real ranges
Do not invent precise prices. Use ranges based on the actual East Africa market:
- State the currency clearly (KES, TZS, UGX)
- Give a low-end and high-end based on year/condition spread
- Add context (e.g. "2015 models start from X, 2020 models reach Y")

---

## 3. Page Title Rules

Format: `[Primary Keyword] | Motokah`

Rules:
- Max 60 characters
- Primary keyword first (not brand)
- Include location where relevant
- No clickbait, no all-caps
- Must match what the page actually delivers

GOOD: `Toyota Land Cruiser for Sale in Nairobi | Motokah`
BAD: `Find AMAZING Toyota Deals You Won't Believe | Motokah`

---

## 4. Meta Description Rules

- 140-160 characters
- Include primary keyword
- Include location
- Include one specific detail (price range, listing count, popular model)
- No em dashes
- End with a soft call to action (not "click here")

GOOD: `Buy a used Toyota Land Cruiser in Nairobi. Prices from KES 2M to 15M.
Verified dealers on Kirinyaga Road. Browse listings and contact sellers direct.`

BAD: `Find the best Toyota Land Cruisers in Nairobi at amazing prices.
Check out our wide selection today!`

---

## 5. Heading Structure

```
H1: One per page. Primary keyword + location. No em dashes.
H2: Section headings. Descriptive. Can include secondary keywords.
H3: Sub-sections only. Not for decorative use.
```

H1 must exactly match (or closely match) the page title keyword intent.
H2s should target secondary queries ("Toyota Land Cruiser price Kenya",
"buying guide", "what to check before buying").

---

## 6. Internal Linking Rules

Every new page must link to at least THREE related pages:
- Parent page (e.g. city page or model page)
- At least one sibling page (e.g. same make different city)
- At least one child/deeper page where it exists

City x make pages must link back to:
- The city landing page (`/city/:slug`)
- The model landing page (`/cars/:make/:model`)
- At least 3 related city x make pages for the same make

Model x city pages must link to:
- The model page (`/cars/:make/:model`)
- The city page (`/city/:slug`)
- At least 2 other cities for the same model

---

## 7. Structured Data Requirements

### Listing pages (already implemented)
- `@type: "Car"` with full schema
- Offer, brand, model, year, mileage, condition, transmission, fuelType

### Landing pages (must add where missing)
- `BreadcrumbList` — all landing pages
- `FAQPage` — all pages with FAQ sections
- `CollectionPage` — city, country, make pages with listing grids

### Blog posts (required)
- `Article` with `datePublished`, `dateModified`, `author`, `publisher`
- `BreadcrumbList`
- `FAQPage` where FAQ section exists

---

## 8. Blog Post Standards

### Topic qualification
A blog topic qualifies if it passes at least TWO of:
- Targets a question real East African car buyers ask
- Has zero or near-zero competing content from authoritative sites
- Supports a high-value transactional page (links naturally to a listing or landing page)
- Provides information not easily found elsewhere in East Africa context

### Required sections in every blog post
1. Direct answer to the question in first paragraph (no preamble)
2. At least one specific price example in local currency
3. At least one East Africa-specific regulation, tip, or market insight
4. At least one internal link to a relevant landing page
5. FAQ section with 2-4 questions (for FAQ JSON-LD)
6. Conclusion with a clear next step (link to search/category)

### What blog posts must NOT do
- Start with "In today's world..." or any time filler
- Define obvious terms ("A car is a vehicle with four wheels...")
- Pad with generic car-buying advice that applies anywhere in the world
- Make up statistics without a real source
- Exaggerate ("Kenya's BEST car market EVER")

### Author
All blog posts: author name "Motokah Editorial Team", no fake personal bylines.

---

## 9. Quality Check Before Committing

Run through this checklist before every commit of new content:

- [ ] Title under 60 characters?
- [ ] Meta description 140-160 characters?
- [ ] No em dashes anywhere?
- [ ] At least 3 East Africa-specific facts?
- [ ] Prices in local currency with realistic ranges?
- [ ] Minimum word count met?
- [ ] At least 3 internal links?
- [ ] H1 matches primary keyword intent?
- [ ] No filler phrases?
- [ ] Structured data present (breadcrumb minimum)?

---

## 10. Country-Specific Notes

### Tanzania
- Import authority: TRA (Tanzania Revenue Authority)
- Registration: SUMATRA handles vehicle registration
- Right-hand drive only
- Popular: Toyota (dominant), Nissan, Suzuki
- Key cities for content: Dar es Salaam, Arusha, Mwanza
- Duty can be 25-100%+ of vehicle value depending on age/cc

### Kenya
- Import authority: KRA (Kenya Revenue Authority)
- Roadworthiness: NTSA
- Right-hand drive, max vehicle age 8 years for imports
- Popular: Toyota, Subaru, Nissan (Subaru stronger here than anywhere else in Africa)
- Key cities: Nairobi (Kirinyaga Road), Mombasa (port city)
- Strong secondhand Japanese import market via Mombasa port

### Uganda
- Import authority: URA (Uganda Revenue Authority)
- Right-hand drive
- Popular: Toyota (Harrier, Land Cruiser, Hiace), Nissan
- Key areas: Kampala Industrial Area, Kireka, Jinja Road
- No age restriction on imports (unlike Kenya's 8-year rule)

### Rwanda
- Strict vehicle age restrictions (max 10 years most categories, 5 years some)
- Cleaner, newer average fleet than neighbours
- Kigali is main market
- Popular: Toyota, Honda, Volkswagen
- Hilly terrain is important buying consideration

### Ethiopia
- High import duties historically
- Mexico Square / Kazanchis area in Addis Ababa
- Toyota Land Cruiser dominates for highland/rural use
- ERCA handles customs clearance
- Chinese brands gaining market share

---

*Last updated: 2026-11-03*
*Apply to all content in D:\MOTOKAH\src\pages\ and D:\MOTOKAH\content\*
