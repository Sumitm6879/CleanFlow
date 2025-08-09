import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import heroImg from "../assets/images/mumbai_city.png";
import user1 from "../assets/images/user1.jpeg";
import user2 from "../assets/images/user2.jpeg";
import user3 from "../assets/images/user3.jpeg";
import prog from "../assets/images/track_prog.webp";
import pollution_report from "../assets/images/pollution_report.webp";
import meethi_river_cleanup from "../assets/images/meethi_river_cleanup.png";

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#12B5ED]"></div>
      </div>
    );
  }

  // If user is logged in, redirect to maps page
  if (user) {
    return <Navigate to="/maps" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        {/* Hero Section - Full Viewport */}
<section className="relative w-full h-screen">
  {/* Background Image */}
  <img
    src={heroImg}
    alt="Mumbai waterfront during sunset"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

  {/* Hero Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
    {/* Main Heading */}
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl drop-shadow-lg">
      Together, We Can Restore Mumbai's Waters
    </h1>

    {/* Subheading */}
    <p className="mt-5 text-lg md:text-xl max-w-2xl text-gray-200 leading-relaxed">
      CleanFlow Mumbai unites citizens, volunteers, and technology to fight
      water pollution. By reporting problems, joining cleanup drives, and
      tracking our progress, you become part of the solution our city’s rivers need.
    </p>

    {/* Action Buttons */}
    <div className="flex flex-wrap gap-4 mt-8 justify-center">
      <Button
        asChild
        className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-[#121717] text-lg font-bold px-6 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
      >
        <Link to="/signup">Join the Movement</Link>
      </Button>
      <Button
        asChild
        variant="secondary"
        className="bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-lg font-bold px-6 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
      >
        <Link to="/maps">Explore the Map</Link>
      </Button>
    </div>

    {/* Stats (still visible in hero, optional) */}
    {/* <div className="mt-12 flex flex-wrap justify-center gap-8">
      <div className="text-center">
        <p className="text-3xl font-bold">1,250+</p>
        <p className="text-sm text-gray-300">Reports Submitted</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">75+</p>
        <p className="text-sm text-gray-300">Cleanups Organized</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">500+</p>
        <p className="text-sm text-gray-300">Volunteers Joined</p>
      </div>
    </div> */}
  </div>
</section>


        {/* About CleanFlow Mumbai */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 text-center">
              About CleanFlow Mumbai
            </h2>
            <p className="text-center text-[#61808A] max-w-3xl mx-auto">
              CleanFlow Mumbai connects citizens, NGOs, and local authorities
              through real-time pollution reports, cleanup drives, and
              transparent impact tracking.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-10">
              <div className="space-y-4 max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-black text-[#121717] leading-tight -tracking-wide">
                  Our Mission
                </h2>
                <p className="text-lg text-[#121717] leading-relaxed">
                  CleanFlow Mumbai is dedicated to restoring the health of
                  Mumbai's rivers and water bodies through community engagement
                  and technology. We believe that by working together, we can
                  make a significant impact on the cleanliness of our city's
                  waterways.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-3 pb-3">
                  <img
                    src={pollution_report}
                    alt="Report Pollution"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-medium text-[#121717]">
                      Report Pollution
                    </h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Easily report pollution incidents with our app, providing
                      real-time data for effective action.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pb-3">
                  <img
                    src={meethi_river_cleanup}
                    alt="Organize Cleanup Drives"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-medium text-[#121717]">
                      Organize Cleanup Drives
                    </h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Create and manage cleanup drives, mobilizing volunteers
                      to tackle pollution hotspots.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pb-3">
                  <img
                    src={prog}
                    alt="Track Progress"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-medium text-[#121717]">
                      Track Progress
                    </h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Monitor the progress of cleanup efforts and see the
                      positive impact of your contributions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 text-center">
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 text-center">
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">
                  Reports Submitted
                </h3>
                <p className="text-2xl font-bold text-[#121717]">1,250</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">
                  Cleanups Organized
                </h3>
                <p className="text-2xl font-bold text-[#121717]">75</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">
                  Volunteers Joined
                </h3>
                <p className="text-2xl font-bold text-[#121717]">500</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Drives */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 text-center">
              Upcoming Drives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <h3 className="text-lg font-medium text-[#121717]">
                  Meethi River Cleanup
                </h3>
                <p className="text-sm text-[#61808A] mt-2">
                  August 20, 2025 — Andheri, Mumbai
                </p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <h3 className="text-lg font-medium text-[#121717]">
                  Versova Beach Restoration
                </h3>
                <p className="text-sm text-[#61808A] mt-2">
                  August 28, 2025 — Versova, Mumbai
                </p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <h3 className="text-lg font-medium text-[#121717]">
                  Powai Lake Awareness Drive
                </h3>
                <p className="text-sm text-[#61808A] mt-2">
                  September 5, 2025 — Powai, Mumbai
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 text-center">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <img
                  src={user1}
                  alt="User"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <p className="mt-4 text-[#121717]">
                  “CleanFlow Mumbai made it so easy to report pollution in my
                  area. The response was quick and effective!”
                </p>
                <p className="mt-2 font-bold text-[#121717]">Amit Sharma</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <img
                  src={user2}
                  alt="User"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <p className="mt-4 text-[#121717]">
                  “I joined a cleanup drive through CleanFlow Mumbai and met so
                  many inspiring people dedicated to making a difference.”
                </p>
                <p className="mt-2 font-bold text-[#121717]">Priya Mehta</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 text-center">
                <img
                  src={user3}
                  alt="User"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <p className="mt-4 text-[#121717]">
                  “The progress tracking feature motivates me to keep
                  contributing. It’s great to see real impact!”
                </p>
                <p className="mt-2 font-bold text-[#121717]">Rahul Desai</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
