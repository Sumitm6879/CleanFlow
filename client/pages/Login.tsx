import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import mumbai_banner_img from '../assets/images/mumbai_banner_img.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate(from, { replace: true });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();

    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full px-4 sm:px-8 lg:px-40 py-5 flex justify-center">
        <div className="w-full max-w-4xl py-5">
          {/* Hero Image */}
          <div className="mb-5 px-4">
            <img
              src={mumbai_banner_img}
              alt="Mumbai waterfront"
              className="w-full h-56 object-cover rounded-xl"
            />
          </div>

          {/* Title Section */}
          <div className="text-center py-5 px-4">
            <h1 className="text-3xl font-bold text-[#121717] mb-1">
              Welcome to CleanFlow Mumbai
            </h1>
          </div>

          <div className="text-center py-1 px-4 mb-3">
            <p className="text-lg text-[#121717]">
              Join us in restoring our rivers and beaches.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3 max-w-md mx-auto px-4">
            {/* Test Credentials Info */}
          <div className="mb-5 max-w-md mx-auto px-4 py-3 bg-[#F0F2F5] rounded-xl text-sm text-[#121717] border border-gray-200">
            <p className="font-semibold mb-1">Test Credentials</p>
            <p>Email: <span className="font-mono">admin@admin.com</span></p>
            <p>Password: <span className="font-mono">Admin1234</span></p>
          </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-[#121717]">Email</Label>
              <div className="h-14 px-4 flex items-center bg-[#F0F2F5] rounded-xl">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638087]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-[#121717]">Password</Label>
              <div className="h-14 px-4 flex items-center bg-[#F0F2F5] rounded-xl">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638087]"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="py-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1AB2E5] hover:bg-[#1496c7] text-[#121717] text-sm font-bold h-10 rounded-xl"
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 py-3">
              <Button
                asChild
                variant="secondary"
                className="flex-1 bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-sm font-bold h-10 rounded-xl"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1 text-[#121717] text-sm font-bold h-10 rounded-xl"
                onClick={() => {
                  toast({
                    title: "Password Reset",
                    description: "Please contact support for password reset assistance.",
                  });
                }}
              >
                Forgot password?
              </Button>
            </div>

            {/* Google Sign In */}
            <div className="py-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleGoogleLogin}
                className="w-full bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-sm font-bold h-10 rounded-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 15 16">
                  <path fillRule="evenodd" d="M15 8C15.0002 11.6456 12.3788 14.7633 8.78732 15.3891C5.1958 16.0148 1.67452 13.9673 0.441785 10.5364C-0.790948 7.10558 0.621968 3.28518 3.79043 1.48203C6.95889 -0.321131 10.9651 0.415282 13.2852 3.22734C13.4371 3.3983 13.4835 3.6386 13.4062 3.85384C13.3289 4.06909 13.1401 4.22491 12.9141 4.26009C12.6881 4.29528 12.461 4.20421 12.3219 4.02266C10.4264 1.72439 7.17233 1.08336 4.54684 2.49105C1.92136 3.89874 0.654342 6.96382 1.51955 9.81447C2.38476 12.6651 5.14168 14.5089 8.10667 14.2198C11.0717 13.9307 13.4205 11.5891 13.7188 8.625H7.5C7.15482 8.625 6.875 8.34518 6.875 8C6.875 7.65482 7.15482 7.375 7.5 7.375H14.375C14.7202 7.375 15 7.65482 15 8Z" clipRule="evenodd" />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Footer Message */}
            <div className="text-center py-1">
              <p className="text-sm text-[#638087]">
                An initiative to clean Meethi, Poisar & Dahisar rivers — Mumbai.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
