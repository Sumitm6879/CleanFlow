import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NGOFooter } from "@/components/Footer";

export default function NGOInfo() {
  const upcomingDrives = [
    {
      id: 1,
      title: "Bandra River Cleanup",
      date: "July 15, 2024 | 9 AM - 12 PM",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Juhu Beach Cleanup",
      date: "August 5, 2024 | 7 AM - 10 AM",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Powai Lake Cleanup",
      date: "September 2, 2024 | 8 AM - 11 AM",
      image: "https://images.unsplash.com/photo-1502138330085-dead8a18d8e1?w=400&h=300&fit=crop"
    }
  ];

  const pastDrives = [
    { event: "Versova Beach Cleanup", date: "May 20, 2024", impact: "150 kg waste collected" },
    { event: "Mithi River Cleanup", date: "April 10, 2024", impact: "200 kg waste collected" },
    { event: "Powai Lake Cleanup", date: "March 5, 2024", impact: "180 kg waste collected" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="flex justify-between items-center px-10 py-3">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-4 h-4 bg-[#121717]" style={{
              clipPath: "polygon(50% 0%, 100% 29%, 100% 71%, 50% 100%, 0% 71%, 0% 29%)"
            }} />
            <h1 className="text-lg font-bold text-[#121717]">CleanFlow Mumbai</h1>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-9">
              <Link to="/maps" className="text-sm font-medium text-[#121717]">Map</Link>
              <Link to="/partner" className="text-sm font-medium text-[#121717]">Partner With Us</Link>
              <Link to="/privacy" className="text-sm font-medium text-[#121717]">Privacy Policy</Link>
            </nav>

            <div className="flex items-center gap-2 bg-[#F0F5F2] rounded-xl px-3 py-2">
              <svg className="w-5 h-5 text-[#121717]" fill="currentColor" viewBox="0 0 16 18">
                <path fillRule="evenodd" d="M15.3281 12.7453C14.8945 11.9984 14.25 9.88516 14.25 7.125C14.25 3.67322 11.4518 0.875 8 0.875C4.54822 0.875 1.75 3.67322 1.75 7.125C1.75 9.88594 1.10469 11.9984 0.671094 12.7453C0.445722 13.1318 0.444082 13.6092 0.666796 13.9973C0.889509 14.3853 1.30261 14.6247 1.75 14.625H4.93828C5.23556 16.0796 6.51529 17.1243 8 17.1243C9.48471 17.1243 10.7644 16.0796 11.0617 14.625H14.25C14.6972 14.6244 15.1101 14.3849 15.3326 13.9969C15.5551 13.609 15.5534 13.1317 15.3281 12.7453Z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-8 lg:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          {/* NGO Header */}
          <div className="p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1558618047-b2c4ea1f5c33?w=200&h=200&fit=crop"
                  alt="EcoGuardians Mumbai logo"
                  className="w-32 h-32 rounded-xl object-cover"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-[#121717]">EcoGuardians Mumbai</h1>
                  <p className="text-lg text-[#618A80]">Partner since March 2022 | Bandra, Mumbai</p>
                  <p className="text-lg text-[#618A80]">Verified</p>
                </div>
              </div>
              <Button className="bg-[#F0F5F2] hover:bg-[#e8f1ef] text-[#121717] text-sm font-bold px-4 h-10 rounded-xl">
                Follow NGO
              </Button>
            </div>
          </div>

          {/* About Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#121717] mb-3 px-4">About EcoGuardians Mumbai</h2>

            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-6 rounded-xl">
                <div className="lg:w-2/3 space-y-1">
                  <p className="text-sm text-[#618A80]">Mission</p>
                  <h3 className="text-lg font-bold text-[#121717]">Protecting Mumbai's Waterways</h3>
                  <p className="text-sm text-[#618A80] leading-relaxed">
                    EcoGuardians Mumbai is dedicated to preserving the health of Mumbai's rivers and water bodies through community-driven cleanup initiatives, educational programs, and sustainable waste management practices. Our focus is on creating a cleaner, healthier environment for all.
                  </p>
                </div>
                <div className="lg:w-1/3">
                  <img
                    src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop"
                    alt="River cleanup activity"
                    className="w-full h-44 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Focus Areas */}
          <div className="px-3 mb-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 h-8 bg-[#F0F5F2] rounded-xl text-sm font-medium text-[#121717]">
                River Cleanup
              </span>
              <span className="px-4 py-2 h-8 bg-[#F0F5F2] rounded-xl text-sm font-medium text-[#121717]">
                Waste Management
              </span>
              <span className="px-4 py-2 h-8 bg-[#F0F5F2] rounded-xl text-sm font-medium text-[#121717]">
                Community Awareness
              </span>
            </div>
          </div>

          {/* Upcoming Drives */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#121717] mb-3 px-4">Upcoming Drives</h2>

            <div className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {upcomingDrives.map((drive) => (
                  <div key={drive.id} className="space-y-4 rounded-lg">
                    <img
                      src={drive.image}
                      alt={drive.title}
                      className="w-full h-28 object-cover rounded-xl"
                    />
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-[#121717]">{drive.title}</h3>
                      <p className="text-sm text-[#618A80]">{drive.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Past Drives */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#121717] mb-3 px-4">Past Drives</h2>

            <div className="px-3 mb-3">
              <div className="border border-[#DBE5E3] rounded-xl bg-white overflow-hidden">
                {/* Table Header */}
                <div className="bg-white border-b border-[#E5E8EB] flex">
                  <div className="flex-1 px-4 py-3">
                    <span className="text-sm font-medium text-[#121717]">Event</span>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="text-sm font-medium text-[#121717]">Date</span>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="text-sm font-medium text-[#121717]">Impact</span>
                  </div>
                </div>

                {/* Table Rows */}
                {pastDrives.map((drive, index) => (
                  <div key={index} className="border-t border-[#E5E8EB] flex">
                    <div className="flex-1 px-4 py-2 flex items-center">
                      <span className="text-sm text-[#121717]">{drive.event}</span>
                    </div>
                    <div className="flex-1 px-4 py-2 flex items-center">
                      <span className="text-sm text-[#618A80]">{drive.date}</span>
                    </div>
                    <div className="flex-1 px-4 py-2 flex items-center">
                      <span className="text-sm text-[#618A80]">{drive.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Impact Statistics */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#121717] mb-3 px-4">Impact Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
              <div className="bg-[#F0F5F2] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Total Drives Organized</h3>
                <p className="text-2xl font-bold text-[#121717]">25</p>
              </div>
              <div className="bg-[#F0F5F2] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Total Volunteers Mobilized</h3>
                <p className="text-2xl font-bold text-[#121717]">500+</p>
              </div>
              <div className="bg-[#F0F5F2] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Total Waste Collected (kg)</h3>
                <p className="text-2xl font-bold text-[#121717]">5000</p>
              </div>
              <div className="bg-[#F0F5F2] rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-medium text-[#121717]">Total Reports Resolved</h3>
                <p className="text-2xl font-bold text-[#121717]">100</p>
              </div>
            </div>
          </section>

          {/* Contact & Social Links */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#121717] mb-3 px-4">Contact & Social Links</h2>

            <div className="px-3 mb-6">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="bg-[#F0F5F2] text-[#121717] text-sm font-bold px-4 h-10 rounded-xl"
                >
                  Email
                </Button>
                <Button className="bg-[#12EDB5] hover:bg-[#10d4a3] text-[#121717] text-sm font-bold px-4 h-10 rounded-xl">
                  Contact NGO
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="px-4">
              <div className="flex gap-2">
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="w-10 h-10 bg-[#F0F5F2] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#121717]" fill="currentColor" viewBox="0 0 18 18">
                      <path fillRule="evenodd" d="M9 0.875C4.51269 0.875 0.875 4.51269 0.875 9C0.875 13.4873 4.51269 17.125 9 17.125C13.4873 17.125 17.125 13.4873 17.125 9C17.1203 4.51465 13.4853 0.879737 9 0.875ZM15.875 9C15.8757 9.88201 15.7059 10.7558 15.375 11.5734L11.8828 9.42578C11.7343 9.33416 11.5682 9.2748 11.3953 9.25156L9.6125 9.01094C9.11023 8.94545 8.61764 9.18743 8.3625 9.625H7.68125L7.38437 9.01094C7.21805 8.66443 6.90078 8.41436 6.525 8.33359L5.9 8.19844L6.51094 7.125H7.81641C8.02765 7.12459 8.23537 7.07084 8.42031 6.96875L9.37734 6.44063C9.46142 6.39376 9.54003 6.33768 9.61172 6.27344L11.7141 4.37187C12.1483 3.98276 12.2541 3.34437 11.9688 2.83594L11.9406 2.78516C14.3417 3.92369 15.8731 6.34263 15.875 9ZM10.1961 2.22969L10.875 3.44531L8.77266 5.34688L7.81641 5.875H6.51094C6.0637 5.87434 5.65018 6.11268 5.42656 6.5L4.74453 7.68984L3.95156 5.57734L4.80625 3.55625C6.33597 2.37428 8.29315 1.89208 10.1969 2.22813L10.1961 2.22969ZM2.125 9C2.12396 7.97814 2.35194 6.96904 2.79219 6.04688L3.67812 8.41172C3.82815 8.80959 4.17015 9.10391 4.58594 9.19297L6.26016 9.55313L6.55781 10.1719C6.76854 10.6012 7.20459 10.8737 7.68281 10.875H7.79844L7.23359 12.143C7.03017 12.5993 7.11804 13.133 7.45703 13.5L7.46797 13.5109L9 15.0891L8.84844 15.8703C5.11458 15.7834 2.1312 12.7349 2.125 9ZM10.1391 15.7797L10.2273 15.3258C10.3009 14.9347 10.185 14.532 9.91484 14.2398C9.91101 14.2364 9.90735 14.2327 9.90391 14.2289L8.375 12.6516L9.44531 10.25L11.2281 10.4906L14.8 12.6875C13.7535 14.331 12.0601 15.4544 10.1391 15.7797Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#121717]">Website</span>
                </div>

                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="w-10 h-10 bg-[#F0F5F2] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#121717]" fill="currentColor" viewBox="0 0 18 18">
                      <path fillRule="evenodd" d="M9 5.25C6.92893 5.25 5.25 6.92893 5.25 9C5.25 11.0711 6.92893 12.75 9 12.75C11.0711 12.75 12.75 11.0711 12.75 9C12.7478 6.92982 11.0702 5.25215 9 5.25ZM9 11.5C7.61929 11.5 6.5 10.3807 6.5 9C6.5 7.61929 7.61929 6.5 9 6.5C10.3807 6.5 11.5 7.61929 11.5 9C11.5 10.3807 10.3807 11.5 9 11.5ZM12.75 0.875H5.25C2.83483 0.877584 0.877584 2.83483 0.875 5.25V12.75C0.877584 15.1652 2.83483 17.1224 5.25 17.125H12.75C15.1652 17.1224 17.1224 15.1652 17.125 12.75V5.25C17.1224 2.83483 15.1652 0.877584 12.75 0.875ZM15.875 12.75C15.875 14.4759 14.4759 15.875 12.75 15.875H5.25C3.52411 15.875 2.125 14.4759 2.125 12.75V5.25C2.125 3.52411 3.52411 2.125 5.25 2.125H12.75C14.4759 2.125 15.875 3.52411 15.875 5.25V12.75ZM16 5.125C16 5.74632 15.4963 6.25 14.875 6.25C14.2537 6.25 13.75 5.74632 13.75 5.125C13.75 4.41973 14.2537 4 14.875 4C15.4963 4 16 4.41973 16 5.125Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#121717]">Instagram</span>
                </div>

                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="w-10 h-10 bg-[#F0F5F2] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#121717]" fill="currentColor" viewBox="0 0 18 18">
                      <path fillRule="evenodd" d="M9 0.875C4.51269 0.875 0.875 4.51269 0.875 9C0.875 13.4873 4.51269 17.125 9 17.125C13.4873 17.125 17.125 13.4873 17.125 9C17.1203 4.51465 13.4853 0.879737 9 0.875ZM9.625 15.8461V10.875H11.5C11.8452 10.875 12.125 10.5952 12.125 10.25C12.125 9.90482 11.8452 9.625 11.5 9.625H9.625V7.75C9.625 7.05964 10.1846 6.5 10.875 6.5H12.125C12.4702 6.5 12.75 6.22018 12.75 5.875C12.75 5.52982 12.4702 5.25 12.125 5.25H10.875C9.49429 5.25 8.375 6.36929 8.375 7.75V9.625H6.5C6.15482 9.625 5.875 9.90482 5.875 10.25C5.875 10.5952 6.15482 10.875 6.5 10.875H8.375V15.8461C4.7149 15.512 1.96489 12.3582 2.13212 8.68674C2.29935 5.01523 5.32468 2.12456 9 2.12456C12.6753 2.12456 15.7006 5.01523 15.8679 8.68674C16.0351 12.3582 13.2851 15.512 9.625 15.8461Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#121717]">Facebook</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <NGOFooter />
    </div>
  );
}
