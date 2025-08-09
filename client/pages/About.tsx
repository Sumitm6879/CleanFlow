import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-20 bg-gradient-to-br from-[#F0F2F5] to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-[#121717] mb-6">
              About CleanFlow Mumbai
            </h1>
            <p className="text-xl text-[#61808A] leading-relaxed max-w-3xl mx-auto">
              Empowering Mumbai's communities to restore and protect our precious water bodies 
              through technology-driven collective action.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#121717] mb-4">Our Mission</h2>
                  <p className="text-lg text-[#61808A] leading-relaxed">
                    To create a unified platform where citizens, NGOs, and local authorities 
                    collaborate to monitor, report, and actively address water pollution across 
                    Mumbai's rivers, lakes, and coastal areas.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#121717] mb-4">Our Vision</h2>
                  <p className="text-lg text-[#61808A] leading-relaxed">
                    A Mumbai where every water body is clean, healthy, and sustainable for 
                    future generations through the power of community-driven environmental action.
                  </p>
                </div>
              </div>
              <div className="bg-[#F0F2F5] rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-[#121717]">Impact So Far</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#12B5ED]">1,250+</div>
                    <div className="text-sm text-[#61808A]">Reports Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#12B5ED]">75+</div>
                    <div className="text-sm text-[#61808A]">Cleanup Drives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#12B5ED]">500+</div>
                    <div className="text-sm text-[#61808A]">Active Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#12B5ED]">25</div>
                    <div className="text-sm text-[#61808A]">NGO Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16 bg-[#F0F2F5]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#121717] mb-12 text-center">How CleanFlow Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Report Issues</h3>
                <p className="text-[#61808A]">
                  Citizens use our platform to report pollution incidents with location data, 
                  photos, and detailed descriptions.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Organize Action</h3>
                <p className="text-[#61808A]">
                  NGOs and community leaders organize cleanup drives and 
                  mobilize volunteers to address reported issues.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Track Progress</h3>
                <p className="text-[#61808A]">
                  Real-time tracking of cleanup efforts, impact measurement, 
                  and transparent reporting of environmental improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#121717] mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Community</h3>
                <p className="text-[#61808A]">Building stronger communities through shared environmental responsibility.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Transparency</h3>
                <p className="text-[#61808A]">Open data and clear reporting on all environmental initiatives.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Sustainability</h3>
                <p className="text-[#61808A]">Long-term solutions for lasting environmental impact.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#12B5ED] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">💡</span>
                </div>
                <h3 className="text-xl font-bold text-[#121717]">Innovation</h3>
                <p className="text-[#61808A]">Leveraging technology to create smarter environmental solutions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16 bg-gradient-to-br from-[#12B5ED] to-[#0ea5e1]">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of the solution. Every report, every cleanup, every action counts 
              towards a cleaner Mumbai.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-white text-[#12B5ED] hover:bg-gray-100 text-lg font-bold px-8 py-3">
                <Link to="/signup">Get Started Today</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#12B5ED] text-lg font-bold px-8 py-3">
                <Link to="/maps">Explore the Map</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
