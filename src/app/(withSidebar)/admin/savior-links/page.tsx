"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SaviorQRCode } from "@/app/types/saviorQrCode";

export default function AdminSaviorsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("SaviorLinks");
  const [saviors, setSaviors] = useState<SaviorQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      console.log("Redirecting to /dashboard as you are not an admin user.");
      router.push("/dashboard");
    } else {
      fetchAllSaviorLinks();
    }
  }, [status, session]);

  const fetchAllSaviorLinks = async () => {
    axios
      .get(`/api/admin/get-all-savior-links`)
      .then((response) => {
        setSaviors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching saviors:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: t("messages.fetchError"),
        });
      })
      .finally(() => setLoading(false));
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {t("messages.loading")}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            <h1>{t("title")}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {saviors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("headers.saviorName")}</TableHead>
                  <TableHead>{t("headers.email")}</TableHead>
                  <TableHead>{t("headers.victimName")}</TableHead>
                  <TableHead>{t("headers.victimEmail")}</TableHead>
                  <TableHead>{t("headers.dateScanned")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saviors.map((savior) => (
                  <TableRow key={savior.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={
                            savior.profileImageUrl
                              ? savior.profileImageUrl
                              : "/scanneSauverLogo.png" // Fallback image
                          }
                          alt={savior.name || t("headers.saviorName")}
                        />
                        <AvatarFallback>
                          {savior.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{savior.name || "N/A"}</span>
                    </TableCell>
                    <TableCell>{savior.email}</TableCell>
                    <TableCell>
                      {savior.qrCode ? savior.qrCode.victimName : "N/A"}
                    </TableCell>
                    <TableCell>
                      {savior.qrCode ? savior.qrCode.victimEmail : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(savior.createdAt).toLocaleString("fr-TG")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t("messages.noSaviors")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted">{t("messages.noSaviorsDesc")}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
