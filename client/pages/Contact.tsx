import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-40 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#121717] mb-6">Contact Us</h1>
          <p className="text-lg text-[#61808A] leading-relaxed mb-8">
            Get in touch with CleanFlow Mumbai to learn more about our initiatives 
            or to get involved in our mission to clean Mumbai's waterways.
          </p>
          <div className="text-left max-w-md mx-auto space-y-4">
            <p className="text-[#121717]">
              <strong>Email:</strong> info@cleanflowmumbai.org
            </p>
            <p className="text-[#121717]">
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p className="text-[#121717]">
              <strong>Address:</strong> Mumbai, Maharashtra, India
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
