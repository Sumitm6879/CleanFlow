import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-40 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#121717] mb-6">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#121717] mb-4">Data Collection</h2>
              <p className="text-[#61808A] leading-relaxed">
                CleanFlow Mumbai collects information you provide when reporting pollution incidents, 
                participating in cleanup drives, or creating an account. This includes location data, 
                photos, and contact information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#121717] mb-4">Data Usage</h2>
              <p className="text-[#61808A] leading-relaxed">
                We use your data to coordinate cleanup efforts, track pollution patterns, 
                and improve our services. Your information helps us create a cleaner Mumbai 
                and connect you with relevant volunteer opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#121717] mb-4">Data Protection</h2>
              <p className="text-[#61808A] leading-relaxed">
                We implement security measures to protect your personal information and 
                only share data with partner organizations when necessary for cleanup coordination. 
                You can request data deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#121717] mb-4">Contact</h2>
              <p className="text-[#61808A] leading-relaxed">
                For privacy concerns or data requests, contact us at privacy@cleanflowmumbai.org
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
