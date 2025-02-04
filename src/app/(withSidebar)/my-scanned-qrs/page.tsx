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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MyScannedQRsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("MyScannedQRs");
  const [scannedQRs, setScannedQRs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<any | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    axios
      .get(`/api/savior/scanned-qr-codes?userId=${session.user.id}`)
      .then((response) => {
        setScannedQRs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scanned QR codes:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error?.response?.data?.error || "Failed to fetch QR codes.",
        });
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {t("messages.loading")}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      {scannedQRs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.victimName")}</TableHead>
              <TableHead>{t("table.victimEmail")}</TableHead>
              <TableHead>{t("table.scannedAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scannedQRs.map((qr) => (
              <Dialog key={qr.id}>
                <DialogTrigger asChild>
                  <TableRow
                    onClick={() => setSelectedQR(qr)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="rounded-none">
                        <AvatarImage
                          src={qr.qrCode.qrCodeUrl}
                          alt={qr.qrCode.victimName || "Victim"}
                        />
                        <AvatarFallback>
                          {qr.qrCode.victimName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{qr.qrCode.victimName || "N/A"}</span>
                    </TableCell>
                    <TableCell>{qr.qrCode.victimEmail || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(qr.createdAt).toLocaleString("fr-TG")}
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{t("dialog.title")}</DialogTitle>
                  </DialogHeader>
                  {selectedQR && (
                    <ScrollArea className="h-[600px] w-full rounded-md border p-2">
                      <div className="grid gap-4">
                        <div>
                          <strong>{t("dialog.details.victimName")}</strong>{" "}
                          {selectedQR.qrCode.victimName || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimSurname")}</strong>{" "}
                          {selectedQR.qrCode.victimSurname || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimEmail")}</strong>{" "}
                          {selectedQR.qrCode.victimEmail || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimHeight")}</strong>{" "}
                          {selectedQR.qrCode.victimHeight || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimWeight")}</strong>{" "}
                          {selectedQR.qrCode.victimWeight || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimAge")}</strong>{" "}
                          {selectedQR.qrCode.victimAge || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.details.victimProfession")}
                          </strong>{" "}
                          {selectedQR.qrCode.victimProfession || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.details.victimNationality")}
                          </strong>{" "}
                          {selectedQR.qrCode.victimNationality || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimTelNumber")}</strong>{" "}
                          {selectedQR.qrCode.victimTelNumber || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.details.victimHouseNumber")}
                          </strong>{" "}
                          {selectedQR.qrCode.victimHouseNumber || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimAddress")}</strong>{" "}
                          {selectedQR.qrCode.victimAddress || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimCity")}</strong>{" "}
                          {selectedQR.qrCode.victimCity || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.victimCountry")}</strong>{" "}
                          {selectedQR.qrCode.victimCountry || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 1 })}{" "}
                            {t("dialog.relativeDetails.name")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative1Name || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 1 })}{" "}
                            {t("dialog.relativeDetails.surname")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative1Surname || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 1 })}{" "}
                            {t("dialog.relativeDetails.address")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative1Address || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 1 })}{" "}
                            {t("dialog.relativeDetails.phone")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative1Phone || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 1 })}{" "}
                            {t("dialog.relativeDetails.email")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative1Email || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.name")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative2Name || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.surname")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative2Surname || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.address")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative2Address || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.phone")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative2Phone || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.email")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative2Email || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 3 })}{" "}
                            {t("dialog.relativeDetails.name")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative3Name || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 3 })}{" "}
                            {t("dialog.relativeDetails.surname")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative3Surname || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 2 })}{" "}
                            {t("dialog.relativeDetails.address")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative3Address || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 3 })}{" "}
                            {t("dialog.relativeDetails.phone")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative3Phone || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.relativeDetails.title", { number: 3 })}{" "}
                            {t("dialog.relativeDetails.email")}
                          </strong>{" "}
                          {selectedQR.qrCode.relative3Email || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.bloodGroup")}</strong>{" "}
                          {selectedQR.qrCode.bloodGroup || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.onDrugs")}</strong>{" "}
                          {selectedQR.qrCode.onDrugs ? "Yes" : "No"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.drugsName")}</strong>{" "}
                          {selectedQR.qrCode.drugsName || "N/A"}
                        </div>
                        <div>
                          <strong>
                            {t("dialog.details.doctorPhoneNumber")}
                          </strong>{" "}
                          {selectedQR.qrCode.doctorPhoneNumber || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.sickness")}</strong>{" "}
                          {selectedQR.qrCode.sickness || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.medication")}</strong>{" "}
                          {selectedQR.qrCode.medication || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.hospitalName")}</strong>{" "}
                          {selectedQR.qrCode.hospitalName || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.status")}</strong>{" "}
                          {selectedQR.qrCode.status || "N/A"}
                        </div>
                        <div>
                          <strong>{t("dialog.details.createdAt")}</strong>{" "}
                          {new Date(selectedQR.qrCode.createdAt).toLocaleString(
                            "fr-TG"
                          )}
                        </div>
                        <div className="flex justify-center">
                          <img
                            src={selectedQR.qrCode.qrCodeUrl}
                            alt="QR Code"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("notFoundTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">{t("messages.noScannedQRs")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
