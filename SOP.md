# Canadian Data Insights — Standard Operating Procedure

Personal reference for building, maintaining, and updating CanadianDataInsights.com.

---

## 1. Project Overview

**Brand:** Canadian Data Insights
**URL:** canadiandatainsights.com
**Purpose:** Educate viewers on Canadian census demographic data with location-specific insights.
**Data Source:** Statistics Canada 2021 Census (plan to update with 2026 Census when available).
**Repository:** https://github.com/drewbotcarrothers/canadiandatainsights.git

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (React) with static export (`next export`) |
| Styling | Tailwind CSS |
| Hosting | Hostinger shared hosting (canadiandatainsights.com) |
| Deployment | GitHub Actions → FTP to Hostinger |
| Data Pipeline | Python (pandas), run locally or in CI |
| Maps (Home) | Custom SVG map of Canada with circle markers |
| Maps (Profile) | Google Maps Embed API (zoom to location) |
| Version Control | Git / GitHub |

---

## 3. Repository Structure

```
canadiandatainsights/
├── Data/
│   ├── Census_Data_CD.csv          # Raw 2021 census (~2.5 GB, gitignored)
│   └── locations.csv               # Processed output (244 columns, 702 locations)
├── Design/
│   ├── design/DESIGN.md            # Visual identity & design system spec
│   ├── home_page/                  # Home page mockup (HTML + screenshot)
│   ├── location_profile_page/      # Profile page mockup (HTML + screenshot)
│   └── location_comparison_page/   # Comparison page mockup (HTML + screenshot)
├── Legacy Code/
│   ├── Census Data Location Demographics.ipynb  # Original notebook (reference only)
│   ├── locations-geo-name-formated-v2.csv       # Geo-name lookup (source of truth for locations)
│   └── locations.csv                            # Legacy output (superseded by Data/locations.csv)
├── Map_Images/                     # Location images (to be replaced by Google Maps Embed)
├── census_demographics.py          # Data extraction script
├── SOP.md                          # This file
└── [Next.js project files]         # src/, pages/, components/, etc.
```

---

## 4. Data Pipeline

### 4.1 Source Files

| File | Location | Description |
|---|---|---|
| Census_Data_CD.csv | `Data/` | Raw Statistics Canada 2021 Census. ~2.5 GB, ~14M rows. Too large for git — keep local or in cloud storage. |
| locations-geo-name-formated-v2.csv | `Legacy Code/` | Lookup table mapping ALT_GEO_CODE → human-readable location name + geo level. Source of truth for which locations get pages. |

### 4.2 Extraction Script: `census_demographics.py`

**What it does:** Reads the raw census CSV in memory-efficient chunks, extracts ~200 characteristics per location, computes derived fields and within-geo-level rankings, filters to locations with population ≥ 5,000, and writes `Data/locations.csv`.

**How to run:**
```bash
python3 census_demographics.py
```
Requires: Python 3.10+, pandas. Runs in ~15 seconds.

**Output:** `Data/locations.csv` — 702 rows × 244 columns.

### 4.3 Data Categories (244 columns)

| Category | Columns | Description |
|---|---|---|
| Population | 47 | Totals (2021/2016), growth, density, land area, sex breakdown, detailed 5-year age brackets, broad age groups with male/female, percentages |
| Household | 40 | Average size, size distribution (1–5+ persons), household type (couple, one-parent, multigenerational, one-person), census family composition |
| Income (Individual) | 24 | Median/average (total, after-tax, market, employment), income composition %, distribution brackets |
| Income (Household) | — | Median/average household income, full distribution brackets (under $5K through $200K+) |
| Languages | 33 | Official language knowledge, mother tongue, home language, top 20 non-official languages by count |
| Education | 11 | Full attainment ladder: no certificate → high school → trades → college → bachelor → master → professional |
| Labour & Industry | 39 | Employment/unemployment rates, 10 occupation categories (NOC), 20 industry sectors (NAICS), commuting |
| Dwelling Types | 9 | Single-detached, semi-detached, row house, duplex, apartments, movable |
| Marital Status | 9 | Married, common-law, never married, separated, divorced, widowed |
| Other | 12 | Gini coefficients, low-income prevalence, derived fields (M:F ratio, absolute growth, male/female %) |
| Rankings | 5 | Within-geo-level ranks for population, growth, avg age, household income + count of peers |

### 4.4 Derived Fields (computed by the script)

- `POP_CHANGE_ABS` — absolute population change (2021 minus 2016)
- `POP_MALE_PCT` / `POP_FEMALE_PCT` — sex as percentage of total
- `POP_MALE_TO_FEMALE_RATIO` — males per female
- `RANK_POPULATION` — rank within same geo level (province vs province, city vs city, etc.)
- `RANK_POP_GROWTH` — rank by population growth % within geo level
- `RANK_AVG_AGE` — rank by average age within geo level (youngest = rank 1)
- `RANK_HH_INCOME` — rank by median household income within geo level
- `RANK_TOTAL_IN_GEO_LEVEL` — total peer count for "rank X of Y" display

### 4.5 Adding New Characteristics

1. Find the CHARACTERISTIC_ID in the raw census CSV (see the audit commands in the commit history or run a quick pandas filter)
2. Add a tuple to the `CHARACTERISTICS` list in `census_demographics.py`: `(ID, "C1_COUNT_TOTAL", "YOUR_COLUMN_NAME")`
3. Re-run the script
4. The new column appears automatically in `locations.csv`

### 4.6 Updating for 2026 Census

When the 2026 Census data is released:
1. Download the new CSV from Statistics Canada
2. Replace `Data/Census_Data_CD.csv`
3. Check if CHARACTERISTIC_IDs have changed (Statistics Canada sometimes renumbers)
4. Update `census_demographics.py` if needed
5. Re-run and verify output
6. Update any hardcoded "2021" references in the website copy

---

## 5. Site Pages

### 5.1 Home Page

- National-level statistics (total population, growth rate, median income)
- **SVG map** of Canada with circle markers for top 30 cities by population
- Province list with high-level demographics, each linking to its profile page
- "Demographic Shifts" editorial section
- Design reference: `Design/home_page/`

### 5.2 Location Profile Pages

One page per location in `locations-geo-name-formated-v2.csv` that has population ≥ 5,000 (702 locations total).

**URL pattern:** `/location/{geo-name-formatted-slug}`
- Provinces (10), Territories (3), Census divisions, Census subdivisions

**Content per page:**
- **Google Maps Embed** zoomed to the specific location (requires API key)
- **Population:** total, 2016 vs 2021 growth (absolute + %), rank, male/female split and ratio, average age + rank, age distribution chart
- **Households:** average size, size distribution, composition (couple, one-parent, one-person, multigenerational)
- **Income:** average/median individual and household, income distribution chart, income composition (market vs government transfers)
- **Education:** attainment distribution (no cert → master's)
- **Languages:** official language knowledge, mother tongue breakdown, top non-official languages
- **Labour:** employment/unemployment rates, occupation and industry sector breakdowns

Design reference: `Design/location_profile_page/`

### 5.3 Location Comparison Pages

**URL pattern:** `/compare` base page, updates to `/compare/{location-a}-vs-{location-b}` when two locations are selected (shareable URLs).

**Constraint:** Same geo level only — province vs province, census division vs census division, census subdivision vs census subdivision.

**UX flow:**
1. User lands on `/compare`
2. Selects a geo level (province / census division / census subdivision)
3. Picks two locations from filtered dropdowns
4. URL updates, comparison renders client-side from pre-built JSON data

Design reference: `Design/location_comparison_page/`

### 5.4 Shared Elements (all pages)

- Consistent header with navigation (Dashboard, Comparisons, Sources, About)
- Sticky header on mobile
- Breadcrumb navigation (e.g., Home > Ontario > Toronto)
- Consistent footer with links, copyright, data attribution
- Mobile-first responsive layout (4-col → 1-col stacking)
- Touch targets: minimum 44×44 px

---

## 6. Design System

Full spec in `Design/design/DESIGN.md`. Key points:

**Colors:**
- Primary: `#003461` (deep navy) — authority, headers, buttons
- Tertiary: `#6e000b` (maple red) — surgical accent only, critical data points and CTAs
- Background: `#f9f9fd` — the canvas
- Surface hierarchy: `#ffffff` → `#f3f3f7` → `#edeef1` → `#e2e2e6` (layered depth)
- Text: `#191c1e` (never pure black)

**Typography:**
- Headlines/display: **Manrope** (wide, editorial feel)
- Body/data/labels: **Inter** (legibility for tables and numbers)

**Key Rules:**
- No 1px borders — define sections through background color shifts only
- No traditional drop shadows — use tonal layering (white card on light gray section)
- Glassmorphism for floating overlays (80% opacity + 12px backdrop blur)
- Tertiary red is surgical — never decorative
- Generous whitespace between major sections (3.5–4.5rem)

---

## 7. SEO & LLM Optimization

- **Semantic HTML:** `<main>`, `<article>`, `<aside>`, `<nav>`, `<header>`, `<footer>`
- **Breadcrumbs:** structured navigation on every page
- **Schema markup:** JSON-LD for "Article" on profile pages
- **Alt text:** every image gets descriptive alt text
- **Meta tags:** unique title and description per location page
- **Thin content mitigation:** pages are data-driven initially; plan to add AI-generated editorial content per location over time to increase uniqueness

---

## 8. Deployment

### 8.1 Build Process

```bash
# Install dependencies
npm install

# Build static site
npm run build    # runs next build && next export

# Output goes to /out directory
```

### 8.2 GitHub Actions Workflow

The workflow builds the Next.js site and deploys via FTP to Hostinger.

**GitHub Secrets required:**

| Secret | Description |
|---|---|
| `FTP_ADDRESS` | Hostinger FTP server address |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `FTP_DIRECTORY` | Remote directory (e.g., `/public_html`) |
| `FTP_PORT` | FTP port (typically 21) |

**Trigger:** Push to `main` branch.

### 8.3 Hosting

- Provider: Hostinger (shared hosting)
- Domain: canadiandatainsights.com
- Static files served via Apache
- No server-side Node.js — everything is pre-rendered at build time

---

## 9. Data Flow Summary

```
Statistics Canada 2021 Census
        │
        ▼
Data/Census_Data_CD.csv (2.5 GB raw, local only)
        │
        ▼
census_demographics.py (chunked extraction + pivot)
        │
        ▼
Data/locations.csv (702 locations × 244 columns)
        │
        ▼
Next.js build (static generation)
  ├── /index.html (home page with SVG map)
  ├── /location/{slug}.html (702 profile pages)
  ├── /compare/index.html (comparison tool)
  └── /data/*.json (pre-built JSON for client-side comparison)
        │
        ▼
GitHub Actions → FTP → Hostinger
        │
        ▼
canadiandatainsights.com (live site)
```

---

## 10. Monetization

| Method | Notes |
|---|---|
| Google AdSense | Display ads. Apply after site has sufficient content and traffic. |
| Affiliate links | Embedded in relevant content sections. |

---

## 11. Content Update Workflow

### Adding/Updating Location Data
1. Update `census_demographics.py` if new characteristics are needed
2. Re-run the script to regenerate `Data/locations.csv`
3. Rebuild the Next.js site (`npm run build`)
4. Push to `main` — GitHub Actions deploys automatically

### Adding Editorial Content per Location
1. Create/update content in a data file or CMS (TBD)
2. Rebuild and deploy

### Updating for New Census Year
1. Download new Census CSV from Statistics Canada
2. Replace `Data/Census_Data_CD.csv`
3. Audit CHARACTERISTIC_IDs for changes
4. Update script and re-run
5. Update "2021" references in UI copy
6. Full rebuild and deploy

---

## 12. Key Files Reference

| File | Purpose |
|---|---|
| `census_demographics.py` | Data extraction pipeline — raw census → locations.csv |
| `Data/locations.csv` | Processed data consumed by the website |
| `Legacy Code/locations-geo-name-formated-v2.csv` | Source of truth for location names and URL slugs |
| `Design/design/DESIGN.md` | Visual identity specification |
| `Design/home_page/` | Home page design reference (HTML + screenshot) |
| `Design/location_profile_page/` | Profile page design reference |
| `Design/location_comparison_page/` | Comparison page design reference |
| `SOP.md` | This document |
