import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the password reset callback
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Updated!",
        description: "Your password has been successfully updated.",
      });
      navigate("/login");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full px-4 sm:px-8 lg:px-40 py-5 flex justify-center">
        <div className="w-full max-w-4xl py-5">
          {/* Title Section */}
          <div className="text-center py-5 px-4">
            <h1 className="text-3xl font-bold text-[#121717] mb-1">
              Reset Your Password
            </h1>
          </div>

          <div className="text-center py-1 px-4 mb-3">
            <p className="text-lg text-[#121717]">
              Enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-3 max-w-md mx-auto px-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-[#121717]">New Password</Label>
              <div className="h-14 px-4 flex items-center bg-[#F0F2F5] rounded-xl">
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638087]"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-[#121717]">Confirm Password</Label>
              <div className="h-14 px-4 flex items-center bg-[#F0F2F5] rounded-xl">
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-transparent outline-none text-[#121717] placeholder-[#638087]"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="py-3">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1AB2E5] hover:bg-[#1496c7] text-[#121717] text-sm font-bold h-10 rounded-xl"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center py-1">
              <Link to="/login" className="text-[#12B5ED] hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
