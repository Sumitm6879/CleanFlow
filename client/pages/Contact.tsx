import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-20 bg-gradient-to-br from-[#F0F2F5] to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-[#121717] mb-6">
              Contact CleanFlow Mumbai
            </h1>
            <p className="text-xl text-[#61808A] leading-relaxed max-w-3xl mx-auto">
              Have questions, suggestions, or want to get involved? We'd love to hear from you. 
              Let's work together to make Mumbai's water bodies cleaner and healthier.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-[#121717] mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[#121717] font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 border-gray-300 focus:border-[#12B5ED] focus:ring-[#12B5ED]"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#121717] font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 border-gray-300 focus:border-[#12B5ED] focus:ring-[#12B5ED]"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-[#121717] font-medium">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-2 border-gray-300 focus:border-[#12B5ED] focus:ring-[#12B5ED]"
                      placeholder="What is your message about?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-[#121717] font-medium">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="mt-2 border-gray-300 focus:border-[#12B5ED] focus:ring-[#12B5ED]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#12B5ED] hover:bg-[#0ea5e1] text-white font-bold py-3 text-lg"
                  >
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#121717] mb-6">Get in Touch</h2>
                  <p className="text-lg text-[#61808A] leading-relaxed mb-8">
                    Whether you want to report pollution, organize a cleanup drive, 
                    or partner with us, we're here to help make Mumbai's waters cleaner.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <div className="bg-[#F0F2F5] rounded-xl p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#12B5ED] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#121717] text-lg">Email Us</h3>
                      <p className="text-[#61808A]">info@cleanflowmumbai.org</p>
                      <p className="text-[#61808A]">support@cleanflowmumbai.org</p>
                    </div>
                  </div>

                  <div className="bg-[#F0F2F5] rounded-xl p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#12B5ED] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#121717] text-lg">Call Us</h3>
                      <p className="text-[#61808A]">+91 98765 43210</p>
                      <p className="text-[#61808A]">Mon - Fri, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="bg-[#F0F2F5] rounded-xl p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#12B5ED] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#121717] text-lg">Visit Us</h3>
                      <p className="text-[#61808A]">Environmental Action Center</p>
                      <p className="text-[#61808A]">Bandra West, Mumbai, Maharashtra 400050</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#121717] text-lg mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-[#12B5ED] rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e1] transition-colors">
                      <span className="text-sm font-bold">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#12B5ED] rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e1] transition-colors">
                      <span className="text-sm font-bold">@</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#12B5ED] rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e1] transition-colors">
                      <span className="text-sm font-bold">in</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#12B5ED] rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e1] transition-colors">
                      <span className="text-sm font-bold">📸</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-4 sm:px-8 lg:px-40 py-16 bg-[#F0F2F5]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#121717] mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-[#121717] text-lg mb-2">How can I report water pollution?</h3>
                <p className="text-[#61808A]">
                  You can report pollution incidents through our platform by creating an account, 
                  navigating to the "Report Pollution" section, and providing details about the location, 
                  type of pollution, and uploading photos if available.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-[#121717] text-lg mb-2">How do I join a cleanup drive?</h3>
                <p className="text-[#61808A]">
                  Browse upcoming cleanup drives on our platform, select one near you, and register to participate. 
                  You'll receive details about the location, time, and what to bring.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-[#121717] text-lg mb-2">Can NGOs partner with CleanFlow Mumbai?</h3>
                <p className="text-[#61808A]">
                  Yes! We welcome partnerships with NGOs, environmental organizations, and community groups. 
                  Contact us to discuss collaboration opportunities and how we can work together.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-[#121717] text-lg mb-2">Is the platform free to use?</h3>
                <p className="text-[#61808A]">
                  Yes, CleanFlow Mumbai is completely free for citizens, volunteers, and NGOs. 
                  Our mission is to make environmental action accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
