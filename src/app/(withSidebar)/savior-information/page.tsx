// `/pages/saviors.tsx`
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
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

export default function SaviorsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("SaviorInfo");
  const [saviors, setSaviors] = useState<SaviorQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaviors();
  }, [session?.user?.id]);

  const fetchSaviors = async () => {
    setLoading(true);
    console.log("user id", session?.user?.id);
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("messages.loginRequired"),
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `/api/savior/get-saviors-for-user?userId=${session.user.id}`
      );
      setSaviors(response.data);
    } catch (error) {
      console.error("Error fetching saviors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: t("messages.fetchError"),
      });
    } finally {
      setLoading(false);
    }
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
                  <TableHead>{t("table.saviorName")}</TableHead>
                  <TableHead>{t("table.email")}</TableHead>
                  <TableHead>{t("table.victimName")}</TableHead>
                  <TableHead>{t("table.dateScanned")}</TableHead>
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
                              : "/scanneSauverLogo.png" // Provide a fallback image
                          }
                          alt={savior.name || "Savior"}
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
