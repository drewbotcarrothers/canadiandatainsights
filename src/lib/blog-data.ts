export interface ChartDataPoint {
  name: string;
  value: number;
  full?: number;
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  heroImage: string;
  chartType?: 'bar' | 'area' | 'pie';
  chartData?: ChartDataPoint[];
  chartTitle?: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Canada's Shift to Secondary Cities: 2021 Census Trends",
    slug: "canada-shift-to-secondary-cities",
    date: "September 25, 2025",
    category: "Urban Planning",
    readTime: "8 min read",
    heroImage: "/images/blog/urban-shift.png",
    chartType: 'bar',
    chartTitle: "Population Growth 2016-2021: Major Hubs vs. Secondary Cities",
    chartData: [
      { name: "Toronto (CMA)", value: 4.6 },
      { name: "Montreal (CMA)", value: 4.6 },
      { name: "Vancouver (CMA)", value: 7.3 },
      { name: "Kelowna (CMA)", value: 14.0 },
      { name: "Milton (T)", value: 20.7 },
      { name: "Airdrie (CY)", value: 20.3 },
    ],
    excerpt: "Analyzing how mid-sized Canadian cities outpaced major hubs in growth during the last census cycle, and what it means for the future of remote work.",
    content: `
      <p>The 2021 Census revealed a profound shift in where Canadians choose to live. While Toronto, Vancouver, and Montreal continue to be the economic heartbeats of the nation, the fastest growth rates aren't happening in the downtown cores. Instead, they are found in 'secondary' cities—places like Kelowna, BC, and Milton, ON.</p>
      
      <h2>The Rise of the Mid-Sized Hub</h2>
      <p>According to Statistics Canada, the population of census metropolitan areas (CMAs) grew by 5.2% from 2016 to 2021. However, smaller urban centers adjacent to these CMAs grew at nearly double that rate in some cases. This trend suggests a 'desire for space' that was accelerated by the global pandemic and the subsequent rise of remote-first employment.</p>
      
      <p>Cities like <strong>Kelowna</strong> and <strong>Milton</strong> represent a new frontier in Canadian urbanism. These are no longer just bedroom communities; they are becoming self-sustaining hubs of economic activity with their own burgeoning tech sectors and service economies.</p>
      
      <blockquote>"The pandemic didn't create the migration to secondary cities, but it acted as a massive catalyst, decoupling employment from physical office locations."</blockquote>
      
      <h2>What the Data Tells Us</h2>
      <p>When we look at the population growth rankings, we see a clear pattern. Municipalities within a 1-2 hour commute of a major center have seen a surge in property values and local resource demand. For policymakers, this means a shift in focus toward regional transit and decentralized infrastructure.</p>
      
      <p>In our data visualization below, notice the stark difference between the growth of traditional CMAs and the explosive expansion of cities like Airdrie and Milton. This isn't just a housing story—it's a fundamental restructuring of the Canadian demographic landscape.</p>
      
      <p>As we move toward the next census cycle, we expect to see these secondary cities develop more robust local service sectors, further reducing the reliance on the traditional 'Big Three' metropolitan areas.</p>
    `,
  },
  {
    title: "The Income Breakdown: Exploring Regional Disparities",
    slug: "income-breakdown-regional-disparities",
    date: "October 12, 2025",
    category: "Economy",
    readTime: "7 min read",
    heroImage: "/images/blog/income-disparity.png",
    chartType: 'area',
    chartTitle: "Median After-Tax Household Income by Selected Region",
    chartData: [
      { name: "Canada Total", value: 73000 },
      { name: "Alberta", value: 83000 },
      { name: "Ontario", value: 77000 },
      { name: "BC", value: 76000 },
      { name: "Quebec", value: 64000 },
      { name: "Nova Scotia", value: 63000 },
    ],
    excerpt: "A side-by-side look at median household incomes and low-income prevalence across the provinces, revealing the hidden layers of Canadian prosperity.",
    content: `
      <p>National averages often mask the stark realities of regional economic health. By diving into the 2021 Census income data, we can see how the cost of living and industry specialization create a complex map of wealth across Canada.</p>
      
      <h2>Median vs. Average: Why it Matters</h2>
      <p>In regions with high concentrations of resource-based wealth, the difference between average and median income can be significant. Our data shows that while the average income might be skewed high by a small percentage of top earners, the median income provides a more grounded view of what the 'typical' household is actually bringing home.</p>
      
      <p>For instance, in <strong>Alberta</strong>, the median household income remains significantly higher than the national average, driven by the energy sector. However, the volatility of these industries often leads to greater fluctuations in employment rates compared to the service-driven economy of <strong>Ontario</strong>.</p>
      
      <h2>Low-Income Prevalence</h2>
      <p>One of the most critical metrics we track at Canadian Data Insights is the prevalence of low income (LIM-AT). Interestingly, some of the wealthiest provinces by average income also struggle with high rates of low-income prevalence in their urban centers, highlighting the ongoing challenge of income inequality.</p>
      
      <p>The gap between the top earners and the lowest deciles is widening in cities like Toronto and Vancouver, where high housing costs erode the purchasing power of even median-income households.</p>
      
      <p>Understanding these disparities is the first step toward targeted economic intervention. You can explore these metrics side-by-side using our <a href="/compare">Comparison Tool</a>.</p>
    `,
  },
  {
    title: "Multicultural Horizons: The Languages Shaping Modern Canada",
    slug: "multicultural-horizons-languages-shaping-canada",
    date: "November 02, 2025",
    category: "Society",
    readTime: "6 min read",
    heroImage: "/images/blog/multicultural-languages.png",
    chartType: 'pie',
    chartTitle: "Top Mother Tongues in Canada (Census 2021)",
    chartData: [
      { name: "English", value: 58.1 },
      { name: "French", value: 21.4 },
      { name: "Mandarin", value: 3.5 },
      { name: "Punjabi", value: 2.8 },
      { name: "Cantonese", value: 1.9 },
      { name: "Other", value: 12.3 },
    ],
    excerpt: "Moving beyond the English-French bilingual identity to look at the growth of non-official mother tongues and their impact on local communities.",
    content: `
      <p>Canada's identity has long been defined by its two official languages. However, the 2021 Census data paints a picture of a nation that is rapidly diversifying far beyond English and French.</p>
      
      <h2>The Growth of Non-Official Languages</h2>
      <p>Over 4.6 million Canadians speak a language other than English or French at home. Languages like <strong>Mandarin</strong>, <strong>Punjabi</strong>, and <strong>Tagalog</strong> have seen double-digit growth rates, reflecting the changing patterns of global migration and Canada's role as a multicultural destination.</p>
      
      <p>This linguistic diversity is a core strength of the Canadian economy, facilitating international trade and cultural exchange. However, it also presents unique challenges for public service delivery and social cohesion.</p>
      
      <h2>Impact on Urban Centers</h2>
      <p>In major hubs like Toronto and Vancouver, non-official languages are increasingly the primary mother tongue for large segments of the population. This has profound implications for how services are delivered, from healthcare to education and retail.</p>
      
      <p>As the 'neither' category (those who speak neither English nor French) remains low, it indicates that Canada’s multiculturalism is additive—new arrivals are maintaining their heritage languages while successfully integrating into the broader Canadian economic fabric.</p>
      
      <p>In our chart below, we visualize the current breakdown of mother tongues. While the official languages still dominate, the 'Other' category is a mosaic of hundreds of languages that define the modern Canadian experience.</p>
    `,
  },
];
