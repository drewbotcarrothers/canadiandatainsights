import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="font-manrope text-5xl font-bold text-primary mb-4">
              Terms of <span className="text-tertiary">Service</span>
            </h1>
            <p className="text-on_surface-variant font-inter text-lg leading-relaxed max-w-2xl">
              By using Canadian Data Insights, you agree to these terms.
            </p>
          </div>
          
          <div className="space-y-8 font-inter text-on_surface leading-relaxed">
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and utilizing Canadian Data Insights ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this site.
              </p>
            </div>
            
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">2. Use of Data & Limitations</h2>
              <p className="mb-4">
                The demographic data provided is sourced from Statistics Canada and is presented for informational and educational purposes only. While we strive to ensure the accuracy of our data parsing pipelines, Canadian Data Insights makes no warranties, expressed or implied, regarding the absolute accuracy, reliability, or completeness of the visualizations.
              </p>
              <p>
                You agree not to hold Canadian Data Insights liable for any business, financial, or personal decisions made based on the information provided on this platform. 
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">3. Intellectual Property</h2>
              <p className="mb-4">
                The layout, design, UI components, code, and proprietary parsing mechanisms of this website are the property of Canadian Data Insights. The underlying demographic data is the property of the Government of Canada under the Open Government Licence - Canada.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">4. Open Government Licence</h2>
              <p className="mb-4">
                Users are free to copy, modify, publish, translate, adapt, distribute or otherwise use the data visualizations presented as long as they comply with the standard terms of the Open Government Licence - Canada, which includes acknowledging Statistics Canada as the source of the raw data.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
