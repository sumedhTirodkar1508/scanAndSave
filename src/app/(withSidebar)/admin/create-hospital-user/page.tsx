"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
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

export default function CreateHospitalUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("CreateHospitalUser");

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      console.log("Redirecting to /dashboard as you are not an admin user.");
      router.push("/dashboard");
    }
  }, [status, session]);

  useEffect(() => {
    setButtonDisabled(!(user.name && user.email && user.password));
  }, [user]);

  const onCreateUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/admin/create-hospital-user", {
        ...user,
        role: "DOC",
        isTemporary: false,
      });
      //   console.log("User creation success:", response.data);
      toast({
        title: "Success",
        description: "Hospital user created successfully!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("User creation failed", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || t("errors.registrationFailed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          onCreateUser();
        }}
      >
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">{t("fields.name")}</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder={t("fields.name")}
                />
              </div>
              <div>
                <Label htmlFor="email">{t("fields.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder={t("fields.email")}
                />
              </div>
              <div>
                <Label htmlFor="password">{t("fields.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder={t("fields.password")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={buttonDisabled || loading}
              className="w-full"
            >
              {loading ? t("buttons.creating") : t("buttons.create")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
