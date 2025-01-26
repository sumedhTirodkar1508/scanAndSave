"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const searchParams = useSearchParams(); // Extract query params
  const qrCodeId = searchParams.get("qrCodeId"); // Get `qrCodeId` if present

  const { data: session, status } = useSession(); // Fetch session data

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    name: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // console.log("SignupPage useEffect has been called");
    // console.log("status:", status);
    // console.log("user id in session", session?.user?.id);
    // Check if user is already logged in
    if (status === "authenticated") {
      // Redirect to victim information page if `qrCodeId` is present
      if (qrCodeId && session?.user?.id) {
        linkQrToAlreadyLoggedInUser();
      }
    }
  }, [status, qrCodeId]);

  const linkQrToAlreadyLoggedInUser = async () => {
    console.log("inside linkQrToAlreadyLoggedInUser");
    try {
      setLoading(true);

      const userId = session?.user?.id;
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not authenticated, unable to link QR code.",
        });
      }
      const response = await axios.post(
        "/api/savior/link-qr-already-loggedin-user",
        {
          qrCodeId,
          userId,
        }
      );
      console.log("QR code linked", response.data);
      // console.log("redirect to victim information commented out");
      router.push(`/victim-information?qrCodeId=${qrCodeId}&notifyBoth=true`);
    } catch (error: any) {
      console.error("Error linking QR code:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", {
        ...user,
        qrCodeId, // Include `qrCodeId` in the request
      });
      console.log("Signup success", response.data);
      toast({
        title: "Success",
        description: "Signup successful!",
      });
      if (qrCodeId) {
        // If `qrCodeId` is present, log in the user programmatically
        const loginResponse = await signIn("credentials", {
          redirect: false,
          email: user.email,
          password: user.password,
        });

        if (loginResponse?.error) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description:
              "Unable to log in after registration. Please try again.",
          });
          return;
        }

        console.log("Login success", loginResponse);
        toast({
          title: "Logged in",
          description: "You are now logged in.",
        });

        // Redirect to the victim information page
        router.push(`/victim-information?qrCodeId=${qrCodeId}&notifyBoth=true`);
      } else {
        // Normal flow: redirect to login page
        router.push("/login");
      }
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.name.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Avatar style={{ height: "10rem", width: "10rem" }}>
              <AvatarImage src="../../scanneSauverLogo.jpg" alt="Logo" />
              <AvatarFallback>X</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl text-center">
            {loading ? "Processing" : "Signup"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="name"
                />
              </div>
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
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            onClick={onSignup}
            disabled={buttonDisabled || loading}
            className="w-full bg-green-600 text-white rounded-full py-3 hover:bg-green-700 transition-colors animate-none hover:animate-bounceHover"
          >
            {loading ? "Signing up..." : "Signup"}
          </Button>
          <Button
            variant="link"
            asChild
            className="text-blue-500 hover:underline mt-5"
          >
            <Link href={qrCodeId ? `/login?qrCodeId=${qrCodeId}` : "/login"}>
              Already have an account? Login here
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
