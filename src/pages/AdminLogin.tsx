import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-admin', {
        body: { passcode }
      });

      if (error) throw error;

      if (data.valid) {
        // Store session token securely
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminTokenExpiry', data.expiresAt);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Invalid passcode");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute inset-0 gradient-radial-red opacity-20" />
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <Card className="elite-card w-full max-w-md p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full gradient-red-orange flex items-center justify-center mx-auto glow-orange">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">
            Enter your passcode to access the dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode">Admin Passcode</Label>
            <Input
              id="passcode"
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="bg-background/50"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Validating..." : "Access Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
