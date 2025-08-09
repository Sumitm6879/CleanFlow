import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import heroImg from "../assets/images/mumbai_city.png"
import user1 from '../assets/images/user1.png'
import user2 from '../assets/images/user2.png'
import user3 from '../assets/images/user3.png'
import meethi_river_cleanup  from '../assets/images/meethi_river_cleanup.png'

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 py-10">
              {/* Hero Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src={heroImg}
                  alt="Mumbai waterfront"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>

              {/* Hero Content */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black text-[#121717] leading-tight -tracking-wider">
                    Let's Restore Mumbai's Waters Together
                  </h1>
                  <p className="text-lg text-[#121717] leading-relaxed">
                    Join our mission to clean rivers — one report at a time.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-[#121717] text-lg font-bold px-5 h-12 rounded-xl"
                  >
                    <Link to="/signup">Join the Movement</Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-lg font-bold px-5 h-12 rounded-xl"
                  >
                    <Link to="/maps">See the Map</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About CleanFlow Mumbai */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 px-4">About CleanFlow Mumbai</h2>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-10">
              <div className="space-y-4 max-w-4xl">
                <h2 className="text-4xl font-black text-[#121717] leading-tight -tracking-wide">Our Mission</h2>
                <p className="text-lg text-[#121717] leading-relaxed">
                  CleanFlow Mumbai is dedicated to restoring the health of Mumbai's rivers and water bodies through community engagement and technology. We believe that by working together, we can make a significant impact on the cleanliness of our city's waterways.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-3 pb-3">
                  <img
                    src={meethi_river_cleanup}
                    alt="Report Pollution"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-[#121717]">Report Pollution</h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Easily report pollution incidents with our app, providing real-time data for effective action.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pb-3">
                  <img
                    src={meethi_river_cleanup}
                    alt="Organize Cleanup Drives"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-[#121717]">Organize Cleanup Drives</h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Create and manage cleanup drives, mobilizing volunteers to tackle pollution hotspots.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pb-3">
                  <img
                    src={meethi_river_cleanup}
                    alt="Track Progress"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-[#121717]">Track Progress</h3>
                    <p className="text-sm text-[#61808A] leading-relaxed">
                      Monitor the progress of cleanup efforts and see the positive impact of your contributions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 px-4">Our Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Reports Submitted</h3>
                <p className="text-2xl font-bold text-[#121717]">1,250</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Cleanups Organized</h3>
                <p className="text-2xl font-bold text-[#121717]">75</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Volunteers Joined</h3>
                <p className="text-2xl font-bold text-[#121717]">500</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Drives */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 px-4">Upcoming Drives</h2>

            <div className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl shadow-sm border p-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=300&fit=crop"
                    alt="Meethi River Cleanup"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-[#121717]">Meethi River Cleanup</h3>
                      <p className="text-sm text-[#61808A]">Location: Bandra, Date: July 15th</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full bg-[#F0F2F5] text-[#121717] text-sm font-bold h-10 rounded-xl"
                    >
                      Join Now
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop"
                    alt="Juhu Beach Cleanup"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-[#121717]">Juhu Beach Cleanup</h3>
                      <p className="text-sm text-[#61808A]">Location: Juhu, Date: July 22nd</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full bg-[#F0F2F5] text-[#121717] text-sm font-bold h-10 rounded-xl"
                    >
                      Join Now
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1502138330085-dead8a18d8e1?w=500&h=300&fit=crop"
                    alt="Community Cleanup Drive"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-[#121717]">Community Cleanup Drive</h3>
                      <p className="text-sm text-[#61808A]">Location: Powai, Date: July 29th</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full bg-[#F0F2F5] text-[#121717] text-sm font-bold h-10 rounded-xl"
                    >
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#121717] mb-5 px-4">Testimonials</h2>

            <div className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4 pt-4">
                  <div className="w-25 h-25 mx-auto rounded-full overflow-hidden">
                    <img
                      src={user1}
                      alt="Anya Sharma"
                      className="w-25 h-25 object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-[#121717] leading-relaxed">
                      "CleanFlow Mumbai has made it so easy to contribute to a cleaner city. The app is user-friendly, and the community is incredibly supportive."
                    </p>
                    <p className="text-sm text-[#61808A]">Anya Sharma, Volunteer</p>
                  </div>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <div className="w-25 h-25 mx-auto rounded-full overflow-hidden">
                    <img
                      src={user2}
                      alt="Rajesh Patel"
                      className="w-25 h-25 object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-[#121717] leading-relaxed">
                      "Our NGO has seen a significant increase in volunteer participation thanks to CleanFlow Mumbai. It's a powerful tool for environmental action."
                    </p>
                    <p className="text-sm text-[#61808A]">Rajesh Patel, NGO Representative</p>
                  </div>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <div className="w-25 h-25 mx-auto rounded-full overflow-hidden">
                    <img
                      src={user3}
                      alt="Priya Verma"
                      className="w-25 h-25 object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-[#121717] leading-relaxed">
                      "I love being able to track the progress of cleanup efforts and see the tangible impact we're making. It's truly inspiring."
                    </p>
                    <p className="text-sm text-[#61808A]">Priya Verma, Community Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}