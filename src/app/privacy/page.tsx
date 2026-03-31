import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="font-manrope text-5xl font-bold text-primary mb-4">
              Privacy <span className="text-tertiary">Policy</span>
            </h1>
            <p className="text-on_surface-variant font-inter text-lg leading-relaxed max-w-2xl">
              Last updated: March 2026
            </p>
          </div>
          
          <div className="space-y-8 font-inter text-on_surface leading-relaxed">
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                Canadian Data Insights is fundamentally a data visualization and analysis platform. We do not require users to create an account, nor do we aggressively track personally identifiable information (PII) for the purpose of serving targeted advertisements.
              </p>
              <p>
                We may collect standard, anonymized web analytics (such as IP addresses, browser types, and referring URLs) purely to understand traffic patterns and improve the performance of our infrastructure.
              </p>
            </div>
            
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">2. External Data Sources</h2>
              <p className="mb-4">
                All demographic information displayed on this website is sourced from public federal datasets, specifically the 2021 Canadian Census by Statistics Canada. We do not collect or publish private, individual-level data. The demographic statistics are aggregated at the subdivision and metropolitan level.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">3. Cookies and Tracking</h2>
              <p className="mb-4">
                We may use essential cookies to maintain site functionality (such as remembering your search preferences or selected comparison locations during a browsing session). You can instruct your browser to refuse all cookies, however this may limit your ability to use certain features like the location comparison tool.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">4. Changes to this Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time to reflect changes in our infrastructure or legal requirements. Any changes will be posted on this page with an updated revision date.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
