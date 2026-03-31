import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="font-manrope text-5xl font-bold text-primary mb-4">
              About <span className="text-tertiary">Us</span>
            </h1>
            <p className="text-on_surface-variant font-inter text-lg leading-relaxed max-w-2xl">
              Understanding the mission behind Canadian Data Insights.
            </p>
          </div>
          
          <div className="space-y-8 font-inter text-on_surface leading-relaxed">
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="mb-4">
                Canadian Data Insights acts as a vital bridge between the extensive datasets of Statistics Canada and the everyday needs of researchers, policymakers, business owners, and inquisitive citizens. We transform complex official records into accessible, beautifully visualized profiles for every province, city, and town across the country.
              </p>
            </div>
            
            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">Data Integrity</h2>
              <p className="mb-4">
                Our platform relies strictly on the official 2021 Canadian Census. By avoiding estimations and third-party extrapolations, we maintain a high standard of accuracy.
              </p>
              <p>
                We process hundreds of distinct demographic variables ranging from granular income brackets and shifting age demographics, to language prevalence and household compositions in order to compute dynamic rankings across thousands of municipalities.
              </p>
            </div>

            <div>
              <h2 className="font-manrope text-2xl font-bold text-primary mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions regarding the application of this data, or require bespoke analysis capabilities, please reach out directly to our administration team.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
