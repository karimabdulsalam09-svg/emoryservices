import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ADMIN_CODE = "2009";

const AdminLogin = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (code === ADMIN_CODE) {
      localStorage.setItem("admin_authenticated", "true");
      toast.success("Access granted!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid code.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute inset-0 gradient-radial-red opacity-20" />
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <Card className="glass-card w-full max-w-md p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">Enter your 4-digit access code</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <InputOTP maxLength={4} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-primary-foreground font-bold"
            disabled={loading || code.length < 4}
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
