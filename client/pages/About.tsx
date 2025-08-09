import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-40 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#121717] mb-6">About CleanFlow Mumbai</h1>
          <p className="text-lg text-[#61808A] leading-relaxed">
            CleanFlow Mumbai is dedicated to restoring the health of Mumbai's rivers and water bodies 
            through community engagement and technology. We believe that by working together, we can 
            make a significant impact on the cleanliness of our city's waterways.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
