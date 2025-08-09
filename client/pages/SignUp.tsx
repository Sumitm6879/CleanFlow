import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service & Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="flex items-center px-10 py-3">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-4 h-4 bg-[#121717]" style={{
              clipPath: "polygon(50% 0%, 100% 29%, 100% 71%, 50% 100%, 0% 71%, 0% 29%)"
            }} />
            <h1 className="text-lg font-bold text-[#121717]">CleanFlow Mumbai</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-8 lg:px-40 py-5 flex justify-center">
        <div className="w-full max-w-4xl py-5">
          {/* Title Section */}
          <div className="text-center py-5 px-4">
            <h1 className="text-3xl font-bold text-[#121717] mb-1">
              Create Your CleanFlow Mumbai Account
            </h1>
          </div>

          <div className="text-center py-1 px-4 mb-3">
            <p className="text-lg text-[#121717]">
              Start making an impact on our rivers, lakes, and beaches.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-3 max-w-md mx-auto px-4">
            {/* Full Name */}
            <div className="space-y-1">
              <div className="h-14 px-4 flex items-center bg-[#F0F5F5] rounded-xl">
                <input 
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638782]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="h-14 px-4 flex items-center bg-[#F0F5F5] rounded-xl">
                <input 
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638782]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="h-14 flex items-center bg-[#F0F5F5] rounded-xl">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="flex-1 px-4 bg-transparent outline-none text-[#121717] placeholder-[#638782]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-[#638782] hover:text-[#121717]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="h-14 flex items-center bg-[#F0F5F5] rounded-xl">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="flex-1 px-4 bg-transparent outline-none text-[#121717] placeholder-[#638782]"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="px-4 text-[#638782] hover:text-[#121717]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="py-3">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 border-2 border-[#DBE5E3] rounded mt-0.5"
                />
                <p className="text-sm text-[#121717] leading-relaxed">
                  I agree to the{" "}
                  <Link to="/privacy" className="text-[#12B5ED] hover:underline">
                    Terms of Service & Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Sign Up Button */}
            <div className="py-3">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1AE5C4] hover:bg-[#17d4b8] text-[#121717] text-lg font-bold h-12 rounded-xl"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>

            {/* Already have account */}
            <div className="text-center py-1">
              <p className="text-sm text-[#638782]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#12B5ED] hover:underline">
                  Log in.
                </Link>
              </p>
            </div>

            {/* OR Divider */}
            <div className="text-center py-1">
              <p className="text-sm text-[#638782]">OR</p>
            </div>

            {/* Google Sign Up */}
            <div className="py-3">
              <Button 
                type="button"
                variant="secondary"
                onClick={handleGoogleSignUp}
                className="w-full bg-[#F0F5F5] hover:bg-gray-200 text-[#121717] text-sm font-bold h-10 rounded-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 15 16">
                  <path fillRule="evenodd" d="M15 8C15.0002 11.6456 12.3788 14.7633 8.78732 15.3891C5.1958 16.0148 1.67452 13.9673 0.441785 10.5364C-0.790948 7.10558 0.621968 3.28518 3.79043 1.48203C6.95889 -0.321131 10.9651 0.415282 13.2852 3.22734C13.4371 3.3983 13.4835 3.6386 13.4062 3.85384C13.3289 4.06909 13.1401 4.22491 12.9141 4.26009C12.6881 4.29528 12.461 4.20421 12.3219 4.02266C10.4264 1.72439 7.17233 1.08336 4.54684 2.49105C1.92136 3.89874 0.654342 6.96382 1.51955 9.81447C2.38476 12.6651 5.14168 14.5089 8.10667 14.2198C11.0717 13.9307 13.4205 11.5891 13.7188 8.625H7.5C7.15482 8.625 6.875 8.34518 6.875 8C6.875 7.65482 7.15482 7.375 7.5 7.375H14.375C14.7202 7.375 15 7.65482 15 8Z" clipRule="evenodd" />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Message */}
      <footer className="w-full">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="text-center">
            <p className="text-[#638782]">Together, we can revive Mumbai's waters.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
