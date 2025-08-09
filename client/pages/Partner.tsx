import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Partner() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-40 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#121717] mb-6">Partner With Us</h1>
          <p className="text-lg text-[#61808A] leading-relaxed mb-8">
            Join CleanFlow Mumbai as a partner organization and help us scale our impact 
            across Mumbai's waterways. Together, we can create a cleaner, healthier environment 
            for all communities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#121717]">For NGOs</h2>
              <ul className="space-y-2 text-[#61808A]">
                <li>• Access to volunteer networks</li>
                <li>• Shared resources and expertise</li>
                <li>• Coordinated cleanup drives</li>
                <li>• Impact tracking and reporting</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#121717]">For Corporations</h2>
              <ul className="space-y-2 text-[#61808A]">
                <li>• Corporate social responsibility</li>
                <li>• Employee engagement programs</li>
                <li>• Brand visibility in community</li>
                <li>• Measurable environmental impact</li>
              </ul>
            </div>
          </div>

          <Button className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-[#121717] text-lg font-bold px-8 h-12 rounded-xl">
            Get in Touch
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
