import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { verifyAccessCode } from "@/lib/supabase";

const AdminLogin = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await verifyAccessCode(accessCode);

      if (isValid) {
        localStorage.setItem("adminAccessCode", accessCode);
        toast.success("Sikeres bejelentkezés!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Hibás hozzáférési kód!");
      }
    } catch (error) {
      toast.error("Hiba történt a bejelentkezés során");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Panel
          </CardTitle>
          <CardDescription className="text-center">
            Add meg a hozzáférési kódot a bejelentkezéshez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Hozzáférési Kód</Label>
              <Input
                id="accessCode"
                type="password"
                placeholder="Írj be a hozzáférési kódot"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
