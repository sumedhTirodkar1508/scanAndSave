"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession, getSession } from "next-auth/react"; // Import signIn and getSession from NextAuth
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCodeId = searchParams.get("qrCodeId");
  const { toast } = useToast();

  const { data: session, update } = useSession(); // Add useSession hook

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    // Validate fields before making the API call
    if (!user.email || !user.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email and Password cannot be empty!",
      });
      return;
    }
    try {
      setLoading(true);

      // Use NextAuth's signIn method
      const result = await signIn("credentials", {
        redirect: false, // Avoid automatic redirection, handle manually
        email: user.email,
        password: user.password,
      });

      // console.log("email", user.email);
      // console.log("password", user.password);
      console.log("Login result", result);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Invalid email or password.",
        });
      } else {
        // Use a callback to get the latest session
        await checkSession();
      }
    } catch (error) {
      console.log("Login failed", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    const session = await getSession();
    if (session) {
      // console.log("Session updated", session);
      // console.log("Session user id", session.user?.id);
      // Proceed with QR code linking and redirection
      if (qrCodeId && session.user?.id) {
        try {
          const response = await axios.post(
            "/api/savior/link-qr-already-loggedin-user",
            {
              qrCodeId,
              userId: session.user.id,
            }
          );
          console.log("QR code linked", response.data);
        } catch (linkError) {
          console.error("Error linking QR code:", linkError);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Logged in successfully but failed to link QR code.",
          });
        }
      }
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      if (qrCodeId) {
        router.push(`/victim-information?qrCodeId=${qrCodeId}&notifyBoth=true`);
      } else {
        router.push("/dashboard");
      }
    } else {
      // If session is still null, retry after a short delay
      setTimeout(checkSession, 500);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-[350px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar style={{ height: "10rem", width: "10rem" }}>
                <AvatarImage src="../../scanneSauverLogo.jpg" alt="Logo" />
                <AvatarFallback>X</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl text-center">
              {loading ? "Processing" : "Login"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="email"
                  type="text"
                  autoComplete="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className="w-full bg-[#2970a8] text-white rounded-full py-3 hover:bg-[#6388bb] transition-colors animate-none hover:animate-bounceHover"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="link"
              asChild
              className="text-blue-500 hover:underline mt-5"
            >
              <Link
                href={qrCodeId ? `/signup?qrCodeId=${qrCodeId}` : "/signup"}
              >
                Don&apos;t have an account? Sign up here
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
