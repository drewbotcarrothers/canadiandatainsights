import { getAllLocations, getLocationBySlug, generateSlug, getLocationsByProvince } from "@/lib/data-utils";
import { formatNumber, formatPercent, formatCurrency } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SortableLocationTable from "@/components/location/SortableLocationTable";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map((loc) => ({
    slug: generateSlug(loc.GEO_NAME),
  }));
}

/* ─── Reusable sub-components ─── */

function StatRow({ label, value, sub }: { label: string; value: string | number | null | undefined; sub?: string }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-outline-variant/10 last:border-0">
      <span className="text-on_surface-variant font-inter text-base">{label}</span>
      <div className="text-right">
        <span className="font-manrope font-bold text-base text-primary">{value}</span>
        {sub && <span className="block text-on_surface-variant font-inter text-xs uppercase tracking-wider mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

function DistributionBar({ label, value, max, total, color = "bg-primary" }: { label: string; value: number; max: number; total?: number; color?: string }) {
  const barPct = max > 0 ? (value / max) * 100 : 0;
  const totalPct = total && total > 0 ? (value / total) * 100 : null;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-on_surface-variant font-inter text-sm w-24 shrink-0 text-right">{label}</span>
      <div className="flex-grow h-5 bg-surface-container-low rounded-sm overflow-hidden">
        <div className={`h-full ${color} rounded-sm transition-all`} style={{ width: `${Math.max(barPct, 1)}%` }} />
      </div>
      <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
        <span className="font-inter font-bold text-sm text-right text-primary">{formatNumber(value)}</span>
        {totalPct !== null && (
          <span className="text-on_surface-variant font-inter text-xs opacity-60 w-14 text-right">({totalPct.toFixed(1)}%)</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, id }: { title: string; id: string }) {
  return (
    <h2 id={id} className="text-primary font-manrope text-headline-sm mb-8 accent-bar pl-6 scroll-mt-24">
      {title}
    </h2>
  );
}

/* ─── Helper to compute safe percentage ─── */
function pct(part: number | null, total: number | null): string {
  if (!part || !total || total === 0) return "—";
  return ((part / total) * 100).toFixed(1) + "%";
}

/* ─── Main Page Component ─── */

export default async function LocationProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const isProvince = location.GEO_LEVEL === "Province" || location.GEO_LEVEL === "Territory";
  const provinceCities = isProvince ? await getLocationsByProvince(location.PROVINCE || location.GEO_NAME.split(",")[0]) : [];

  const displayName = location.GEO_NAME.split(",")[0];
  const d = location; // shorthand

  /* ─── Pre-compute derived values ─── */
  const ageBrackets = [
    { label: "0–4", value: d.POP_AGE_0_4 },
    { label: "5–9", value: d.POP_AGE_5_9 },
    { label: "10–14", value: d.POP_AGE_10_14 },
    { label: "15–19", value: d.POP_AGE_15_19 },
    { label: "20–24", value: d.POP_AGE_20_24 },
    { label: "25–29", value: d.POP_AGE_25_29 },
    { label: "30–34", value: d.POP_AGE_30_34 },
    { label: "35–39", value: d.POP_AGE_35_39 },
    { label: "40–44", value: d.POP_AGE_40_44 },
    { label: "45–49", value: d.POP_AGE_45_49 },
    { label: "50–54", value: d.POP_AGE_50_54 },
    { label: "55–59", value: d.POP_AGE_55_59 },
    { label: "60–64", value: d.POP_AGE_60_64 },
    { label: "65–69", value: d.POP_AGE_65_69 },
    { label: "70–74", value: d.POP_AGE_70_74 },
    { label: "75–79", value: d.POP_AGE_75_79 },
    { label: "80–84", value: d.POP_AGE_80_84 },
    { label: "85+", value: d.POP_AGE_85_PLUS },
  ].filter((b) => b.value != null);
  const maxAgeBracket = Math.max(...ageBrackets.map((b) => b.value || 0));

  const hhTotal = d.HH_SIZE_TOTAL || d.HH_TYPE_TOTAL || 1;
  const hhTypes = [
    { label: "Couples with children", value: d.HH_TYPE_COUPLE_WITH_CHILDREN },
    { label: "Couples without children", value: d.HH_TYPE_COUPLE_WITHOUT_CHILDREN },
    { label: "One-parent families", value: d.HH_TYPE_ONE_PARENT },
    { label: "One-person households", value: d.HH_TYPE_ONE_PERSON },
    { label: "Multigenerational", value: d.HH_TYPE_MULTIGENERATIONAL },
    { label: "Multiple-family", value: d.HH_TYPE_MULTIPLE_FAMILY },
  ].filter((h) => h.value != null && h.value > 0);

  const incomeDistBrackets = [
    { label: "Under $10k", value: d.INCOME_DIST_UNDER_10K },
    { label: "$10k–$20k", value: d.INCOME_DIST_10K_20K },
    { label: "$20k–$30k", value: d.INCOME_DIST_20K_30K },
    { label: "$30k–$40k", value: d.INCOME_DIST_30K_40K },
    { label: "$40k–$50k", value: d.INCOME_DIST_40K_50K },
    { label: "$50k–$60k", value: d.INCOME_DIST_50K_60K },
    { label: "$60k–$70k", value: d.INCOME_DIST_60K_70K },
    { label: "$70k–$80k", value: d.INCOME_DIST_70K_80K },
    { label: "$80k–$90k", value: d.INCOME_DIST_80K_90K },
    { label: "$90k–$100k", value: d.INCOME_DIST_90K_100K },
    { label: "$100k+", value: d.INCOME_DIST_100K_PLUS },
  ].filter((b) => b.value != null);
  const incomeDistTotal = incomeDistBrackets.reduce((acc, b) => acc + (b.value || 0), 0);
  const maxIncomeBracket = Math.max(...incomeDistBrackets.map((b) => b.value || 0));

  // Language knowledge
  const langTotal = d.LANG_KNOWLEDGE_TOTAL || 1;
  const motherTongueTotal = d.MOTHER_TONGUE_TOTAL || 1;

  // Top mother-tongue languages (non-official)
  const langBreakdown = [
    { label: "English", value: d.MOTHER_TONGUE_EN },
    { label: "French", value: d.MOTHER_TONGUE_FR },
    { label: "Arabic", value: d.LANG_ARABIC },
    { label: "Tagalog", value: d.LANG_TAGALOG },
    { label: "Mandarin", value: d.LANG_MANDARIN },
    { label: "Cantonese", value: d.LANG_CANTONESE },
    { label: "Punjabi", value: d.LANG_PUNJABI },
    { label: "Spanish", value: d.LANG_SPANISH },
    { label: "Italian", value: d.LANG_ITALIAN },
    { label: "Hindi", value: d.LANG_HINDI },
    { label: "Urdu", value: d.LANG_URDU },
    { label: "Portuguese", value: d.LANG_PORTUGUESE },
    { label: "Polish", value: d.LANG_POLISH },
    { label: "German", value: d.LANG_GERMAN },
    { label: "Vietnamese", value: d.LANG_VIETNAMESE },
    { label: "Korean", value: d.LANG_KOREAN },
    { label: "Tamil", value: d.LANG_TAMIL },
    { label: "Greek", value: d.LANG_GREEK },
    { label: "Russian", value: d.LANG_RUSSIAN },
    { label: "Gujarati", value: d.LANG_GUJARATI },
    { label: "Persian", value: d.LANG_PERSIAN },
    { label: "Bengali", value: d.LANG_BENGALI },
  ]
    .filter((l) => l.value != null && l.value > 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 10);
  const maxLang = Math.max(...langBreakdown.map((l) => l.value || 0), 1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* ════════════════════ Hero ════════════════════ */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-on_surface-variant font-inter text-[10px] uppercase tracking-widest mb-6">
              <span className="hover:text-primary transition-colors cursor-pointer">Canada</span>
              <span className="opacity-30">/</span>
              <span className="text-primary font-bold">{displayName}</span>
            </nav>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="max-w-2xl">
                <h1 className="font-manrope text-5xl font-bold text-primary mb-4 leading-tight">
                  {displayName} <span className="text-tertiary">Profile</span>
                </h1>
                <p className="text-on_surface-variant font-inter text-lg leading-relaxed mb-8">
                  A comprehensive demographic breakdown using data from the 2021 Statistics Canada Census.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="glass px-4 py-2 rounded-md shadow-sm">
                    <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold mr-2">National Rank:</span>
                    <span className="text-primary font-manrope font-bold text-sm">
                      {d.RANK_POPULATION} of {d.RANK_TOTAL_IN_GEO_LEVEL}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 aspect-video bg-surface-dim rounded-xl overflow-hidden relative shadow-ambient">
                <iframe
                  title={`Map of ${displayName}, Canada`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(displayName + ', ' + (d.PROVINCE || 'Canada'))}&zoom=${isProvince ? 4 : 10}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ 1. POPULATION ════════════════════ */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={`${displayName} Population`} id="population" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: key stats */}
              <div id="pop-card-stats" className="lg:col-span-1 card-tonal p-6 rounded-xl border border-outline-variant/10">
                <StatRow label="Total Population (2021)" value={formatNumber(d.POP_2021)} />
                <StatRow label="Total Population (2016)" value={formatNumber(d.POP_2016)} />
                <StatRow
                  label="Population Growth"
                  value={`${formatPercent(d.POP_CHANGE_PCT)} (${d.POP_CHANGE_ABS > 0 ? "+" : ""}${formatNumber(d.POP_CHANGE_ABS)})`}
                />
                <StatRow label="Growth Rank" value={d.RANK_POP_GROWTH ? `#${d.RANK_POP_GROWTH} of ${d.RANK_TOTAL_IN_GEO_LEVEL}` : null} sub="Same geo level" />
                <div className="h-px bg-outline-variant/20 my-3" />
                <StatRow label="Male" value={d.POP_MALE_PCT != null ? `${d.POP_MALE_PCT.toFixed(1)}%` : null} sub={d.POP_MALE ? formatNumber(d.POP_MALE) : undefined} />
                <StatRow label="Female" value={d.POP_FEMALE_PCT != null ? `${d.POP_FEMALE_PCT.toFixed(1)}%` : null} sub={d.POP_FEMALE ? formatNumber(d.POP_FEMALE) : undefined} />
                <StatRow label="Male-to-Female Ratio" value={d.POP_MALE_TO_FEMALE_RATIO?.toFixed(3)} />
                <div className="h-px bg-outline-variant/20 my-3" />
                <StatRow label="Average Age" value={d.POP_AVG_AGE} />
                <StatRow label="Median Age" value={d.POP_MEDIAN_AGE} />
                <StatRow label="Age Rank" value={d.RANK_AVG_AGE ? `#${d.RANK_AVG_AGE} of ${d.RANK_TOTAL_IN_GEO_LEVEL}` : null} sub="Same geo level" />
              </div>

              {/* Right: age distribution chart */}
              <div className="lg:col-span-2">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Population Age Distribution</h3>
                {ageBrackets.length > 0 ? (
                  <div id="pop-card-chart" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                    {ageBrackets.map((b) => (
                      <DistributionBar key={b.label} label={b.label} value={b.value} max={maxAgeBracket} total={d.POP_2021} />
                    ))}
                  </div>
                ) : (
                  <p className="text-on_surface-variant font-inter text-sm italic">Age distribution data not available.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ 2. HOUSEHOLDS ════════════════════ */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={`${displayName} Households`} id="households" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Average household size + size distribution */}
              <div id="hh-card-stats" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Household Size</h3>
                <StatRow label="Average Household Size" value={d.HH_AVG_SIZE?.toFixed(1)} />
                <StatRow label="Total Private Dwellings" value={d.TOTAL_PRIVATE_DWELLINGS ? formatNumber(d.TOTAL_PRIVATE_DWELLINGS) : null} />
                <StatRow label="Occupied Private Dwellings" value={d.OCCUPIED_PRIVATE_DWELLINGS ? formatNumber(d.OCCUPIED_PRIVATE_DWELLINGS) : null} />

                {d.HH_SIZE_TOTAL && (
                  <>
                    <div className="h-px bg-outline-variant/20 my-4" />
                    <h4 className="text-on_surface-variant font-inter text-xs uppercase tracking-wider font-bold mb-3">Size Distribution</h4>
                    <StatRow label="1 Person" value={d.HH_SIZE_1_PERSON ? `${formatNumber(d.HH_SIZE_1_PERSON)} (${pct(d.HH_SIZE_1_PERSON, d.HH_SIZE_TOTAL)})` : null} />
                    <StatRow label="2 Persons" value={d.HH_SIZE_2_PERSONS ? `${formatNumber(d.HH_SIZE_2_PERSONS)} (${pct(d.HH_SIZE_2_PERSONS, d.HH_SIZE_TOTAL)})` : null} />
                    <StatRow label="3 Persons" value={d.HH_SIZE_3_PERSONS ? `${formatNumber(d.HH_SIZE_3_PERSONS)} (${pct(d.HH_SIZE_3_PERSONS, d.HH_SIZE_TOTAL)})` : null} />
                    <StatRow label="4 Persons" value={d.HH_SIZE_4_PERSONS ? `${formatNumber(d.HH_SIZE_4_PERSONS)} (${pct(d.HH_SIZE_4_PERSONS, d.HH_SIZE_TOTAL)})` : null} />
                    <StatRow label="5+ Persons" value={d.HH_SIZE_5_PLUS_PERSONS ? `${formatNumber(d.HH_SIZE_5_PLUS_PERSONS)} (${pct(d.HH_SIZE_5_PLUS_PERSONS, d.HH_SIZE_TOTAL)})` : null} />
                  </>
                )}
              </div>

              {/* Household composition */}
              <div id="hh-card-chart" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Household Composition</h3>
                {hhTypes.length > 0 ? (
                  <div>
                    {hhTypes.map((h) => (
                      <div key={h.label} className="flex justify-between items-center py-2.5 border-b border-outline-variant/10 last:border-0">
                        <span className="text-on_surface-variant font-inter text-base">{h.label}</span>
                        <div className="text-right">
                          <span className="font-manrope font-bold text-base text-primary">{formatNumber(h.value)}</span>
                          <span className="text-on_surface-variant font-inter text-xs ml-2">({pct(h.value, hhTotal)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on_surface-variant font-inter text-sm italic">Household composition data not available.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ 3. INCOMES ════════════════════ */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={`${displayName} Incomes`} id="incomes" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Key income stats */}
              <div id="income-card-stats" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Summary</h3>
                <StatRow label="Avg. Household Income" value={d.HH_INCOME_AVG_AFTER_TAX ? formatCurrency(d.HH_INCOME_AVG_AFTER_TAX) : null} sub="After tax" />
                <StatRow label="Median Household Income" value={d.HH_INCOME_MEDIAN_AFTER_TAX ? formatCurrency(d.HH_INCOME_MEDIAN_AFTER_TAX) : null} sub="After tax" />
                <StatRow label="Avg. Individual Income" value={d.INCOME_AVG_AFTER_TAX ? formatCurrency(d.INCOME_AVG_AFTER_TAX) : null} sub="After tax" />
                <StatRow label="Median Individual Income" value={d.INCOME_MEDIAN_AFTER_TAX ? formatCurrency(d.INCOME_MEDIAN_AFTER_TAX) : null} sub="After tax" />
                <StatRow label="Income Rank" value={d.RANK_HH_INCOME ? `#${d.RANK_HH_INCOME} of ${d.RANK_TOTAL_IN_GEO_LEVEL}` : null} sub="Same geo level" />

                <div className="h-px bg-outline-variant/20 my-4" />
                <h4 className="text-on_surface-variant font-inter text-xs uppercase tracking-wider font-bold mb-3">Income Composition</h4>
                <StatRow label="Market Income" value={d.INCOME_COMP_MARKET_PCT != null ? `${d.INCOME_COMP_MARKET_PCT.toFixed(1)}%` : null} />
                <StatRow label="Employment Income" value={d.INCOME_COMP_EMPLOYMENT_PCT != null ? `${d.INCOME_COMP_EMPLOYMENT_PCT.toFixed(1)}%` : null} />
                <StatRow label="Government Transfers" value={d.INCOME_COMP_GOVT_TRANSFERS_PCT != null ? `${d.INCOME_COMP_GOVT_TRANSFERS_PCT.toFixed(1)}%` : null} />
              </div>

              {/* Income distribution chart */}
              <div className="lg:col-span-2">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Individual Income Distribution</h3>
                {incomeDistBrackets.length > 0 ? (
                  <div id="income-card-chart" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                    {incomeDistBrackets.map((b) => (
                      <DistributionBar key={b.label} label={b.label} value={b.value} max={maxIncomeBracket} total={incomeDistTotal} color="bg-tertiary" />
                    ))}
                  </div>
                ) : (
                  <p className="text-on_surface-variant font-inter text-sm italic">Income distribution data not available.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ 4. EMPLOYMENT ════════════════════ */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={`${displayName} Employment`} id="employment" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div id="employment-card-stats" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Labour Force</h3>
                <StatRow label="Employment Rate" value={d.LABOUR_EMPLOYMENT_RATE != null ? `${d.LABOUR_EMPLOYMENT_RATE.toFixed(1)}%` : null} />
                <StatRow label="Unemployment Rate" value={d.LABOUR_UNEMPLOYMENT_RATE != null ? `${d.LABOUR_UNEMPLOYMENT_RATE.toFixed(1)}%` : null} />
                <StatRow label="Total Labour Force" value={d.LABOUR_IN_FORCE ? formatNumber(d.LABOUR_IN_FORCE) : null} />
                <StatRow label="Employed" value={d.LABOUR_EMPLOYED ? formatNumber(d.LABOUR_EMPLOYED) : null} />
                <StatRow label="Unemployed" value={d.LABOUR_UNEMPLOYED ? formatNumber(d.LABOUR_UNEMPLOYED) : null} />
                <StatRow label="Not in Labour Force" value={d.LABOUR_NOT_IN_FORCE ? formatNumber(d.LABOUR_NOT_IN_FORCE) : null} />
              </div>

              <div id="low-income-card-stats" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Low Income Prevalence</h3>
                <StatRow label="Overall Low-Income Rate" value={d.LOW_INCOME_PCT != null ? `${d.LOW_INCOME_PCT.toFixed(1)}%` : null} />
                <StatRow label="Children (0–17)" value={d.LOW_INCOME_0_17_PCT != null ? `${d.LOW_INCOME_0_17_PCT.toFixed(1)}%` : null} />
                <StatRow label="Adults (18–64)" value={d.LOW_INCOME_18_64_PCT != null ? `${d.LOW_INCOME_18_64_PCT.toFixed(1)}%` : null} />
                <StatRow label="Seniors (65+)" value={d.LOW_INCOME_65_PLUS_PCT != null ? `${d.LOW_INCOME_65_PLUS_PCT.toFixed(1)}%` : null} />
                <div className="h-px bg-outline-variant/20 my-4" />
                <StatRow label="Gini Coefficient (Total)" value={d.GINI_TOTAL_INCOME?.toFixed(3)} sub="0 = perfect equality" />
                <StatRow label="Gini Coefficient (After-Tax)" value={d.GINI_AFTER_TAX_INCOME?.toFixed(3)} />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ 5. LANGUAGES ════════════════════ */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={`${displayName} Languages`} id="languages" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Language knowledge */}
              <div id="lang-card-stats" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Language Knowledge</h3>
                <StatRow label="English Only" value={d.LANG_KNOWLEDGE_EN_ONLY ? `${formatNumber(d.LANG_KNOWLEDGE_EN_ONLY)} (${pct(d.LANG_KNOWLEDGE_EN_ONLY, langTotal)})` : null} />
                <StatRow label="French Only" value={d.LANG_KNOWLEDGE_FR_ONLY ? `${formatNumber(d.LANG_KNOWLEDGE_FR_ONLY)} (${pct(d.LANG_KNOWLEDGE_FR_ONLY, langTotal)})` : null} />
                <StatRow label="English & French" value={d.LANG_KNOWLEDGE_EN_AND_FR ? `${formatNumber(d.LANG_KNOWLEDGE_EN_AND_FR)} (${pct(d.LANG_KNOWLEDGE_EN_AND_FR, langTotal)})` : null} />
                <StatRow label="Neither" value={d.LANG_KNOWLEDGE_NEITHER ? `${formatNumber(d.LANG_KNOWLEDGE_NEITHER)} (${pct(d.LANG_KNOWLEDGE_NEITHER, langTotal)})` : null} />

                <div className="h-px bg-outline-variant/20 my-4" />
                <h4 className="text-on_surface-variant font-inter text-xs uppercase tracking-wider font-bold mb-3">Mother Tongue</h4>
                <StatRow label="English" value={d.MOTHER_TONGUE_EN ? `${formatNumber(d.MOTHER_TONGUE_EN)} (${pct(d.MOTHER_TONGUE_EN, motherTongueTotal)})` : null} />
                <StatRow label="French" value={d.MOTHER_TONGUE_FR ? `${formatNumber(d.MOTHER_TONGUE_FR)} (${pct(d.MOTHER_TONGUE_FR, motherTongueTotal)})` : null} />
                <StatRow label="Non-official languages" value={d.MOTHER_TONGUE_NON_OFFICIAL ? `${formatNumber(d.MOTHER_TONGUE_NON_OFFICIAL)} (${pct(d.MOTHER_TONGUE_NON_OFFICIAL, motherTongueTotal)})` : null} />
              </div>

              {/* Top languages chart */}
              <div className="lg:col-span-2">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Top Mother Tongue Languages</h3>
                {langBreakdown.length > 0 ? (
                  <div id="lang-card-chart" className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                    {langBreakdown.map((l) => (
                      <DistributionBar key={l.label} label={l.label} value={l.value} max={maxLang} total={motherTongueTotal} color="bg-primary/60" />
                    ))}
                  </div>
                ) : (
                  <p className="text-on_surface-variant font-inter text-sm italic">Language breakdown data not available.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ Province Cities Table ════════════════════ */}
        {isProvince && provinceCities.length > 0 && (
          <SortableLocationTable
            cities={provinceCities.map((c) => ({
              ALT_GEO_CODE: c.ALT_GEO_CODE,
              GEO_NAME: c.GEO_NAME,
              slug: generateSlug(c.GEO_NAME),
              POP_2021: c.POP_2021,
              POP_CHANGE_PCT: c.POP_CHANGE_PCT,
              POP_AVG_AGE: c.POP_AVG_AGE,
              HH_INCOME_MEDIAN_AFTER_TAX: c.HH_INCOME_MEDIAN_AFTER_TAX,
              LABOUR_EMPLOYMENT_RATE: c.LABOUR_EMPLOYMENT_RATE,
            }))}
            provinceName={displayName}
          />
        )}

        {/* ════════════════════ CTA ════════════════════ */}
        <section className="bg-surface-container py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-primary font-manrope text-headline-sm mb-6">Discover More Insights</h2>
            <p className="text-on_surface-variant font-inter text-sm mb-8 max-w-xl mx-auto">
              Compare {displayName} with other Canadian locations to see how it stacks up against similar population centers.
            </p>
            <button className="bg-primary text-white font-manrope font-bold px-8 py-3 rounded-md hover:bg-primary-container transition-all shadow-ambient">
              Open Comparison Tool
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
