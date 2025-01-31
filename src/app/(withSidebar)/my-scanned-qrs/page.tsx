"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
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
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Scanned QR Codes</h1>
      {scannedQRs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Victim Name</TableHead>
              <TableHead>Victim Email</TableHead>
              <TableHead>Scanned At</TableHead>
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
                    <DialogTitle>QR Code Details</DialogTitle>
                  </DialogHeader>
                  {selectedQR && (
                    <ScrollArea className="h-[600px] w-full rounded-md border p-2">
                      <div className="grid gap-4">
                        <div>
                          <strong>Victim Name:</strong>{" "}
                          {selectedQR.qrCode.victimName || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Surname:</strong>{" "}
                          {selectedQR.qrCode.victimSurname || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Email:</strong>{" "}
                          {selectedQR.qrCode.victimEmail || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Height:</strong>{" "}
                          {selectedQR.qrCode.victimHeight || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Weight:</strong>{" "}
                          {selectedQR.qrCode.victimWeight || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Age:</strong>{" "}
                          {selectedQR.qrCode.victimAge || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Profession:</strong>{" "}
                          {selectedQR.qrCode.victimProfession || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Nationality:</strong>{" "}
                          {selectedQR.qrCode.victimNationality || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Tel Number:</strong>{" "}
                          {selectedQR.qrCode.victimTelNumber || "N/A"}
                        </div>
                        <div>
                          <strong>Victim House Number:</strong>{" "}
                          {selectedQR.qrCode.victimHouseNumber || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Address:</strong>{" "}
                          {selectedQR.qrCode.victimAddress || "N/A"}
                        </div>
                        <div>
                          <strong>Victim City:</strong>{" "}
                          {selectedQR.qrCode.victimCity || "N/A"}
                        </div>
                        <div>
                          <strong>Victim Country:</strong>{" "}
                          {selectedQR.qrCode.victimCountry || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 1 Name:</strong>{" "}
                          {selectedQR.qrCode.relative1Name || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 1 Surname:</strong>{" "}
                          {selectedQR.qrCode.relative1Surname || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 1 Address:</strong>{" "}
                          {selectedQR.qrCode.relative1Address || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 1 Phone:</strong>{" "}
                          {selectedQR.qrCode.relative1Phone || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 1 Email:</strong>{" "}
                          {selectedQR.qrCode.relative1Email || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 2 Name:</strong>{" "}
                          {selectedQR.qrCode.relative2Name || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 2 Surname:</strong>{" "}
                          {selectedQR.qrCode.relative2Surname || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 2 Address:</strong>{" "}
                          {selectedQR.qrCode.relative2Address || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 2 Phone:</strong>{" "}
                          {selectedQR.qrCode.relative2Phone || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 2 Email:</strong>{" "}
                          {selectedQR.qrCode.relative2Email || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 3 Name:</strong>{" "}
                          {selectedQR.qrCode.relative3Name || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 3 Surname:</strong>{" "}
                          {selectedQR.qrCode.relative3Surname || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 3 Address:</strong>{" "}
                          {selectedQR.qrCode.relative3Address || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 3 Phone:</strong>{" "}
                          {selectedQR.qrCode.relative3Phone || "N/A"}
                        </div>
                        <div>
                          <strong>Relative 3 Email:</strong>{" "}
                          {selectedQR.qrCode.relative3Email || "N/A"}
                        </div>
                        <div>
                          <strong>Blood Group:</strong>{" "}
                          {selectedQR.qrCode.bloodGroup || "N/A"}
                        </div>
                        <div>
                          <strong>On Drugs:</strong>{" "}
                          {selectedQR.qrCode.onDrugs ? "Yes" : "No"}
                        </div>
                        <div>
                          <strong>Drugs Name:</strong>{" "}
                          {selectedQR.qrCode.drugsName || "N/A"}
                        </div>
                        <div>
                          <strong>Doctor Phone Number:</strong>{" "}
                          {selectedQR.qrCode.doctorPhoneNumber || "N/A"}
                        </div>
                        <div>
                          <strong>Sickness:</strong>{" "}
                          {selectedQR.qrCode.sickness || "N/A"}
                        </div>
                        <div>
                          <strong>Medication:</strong>{" "}
                          {selectedQR.qrCode.medication || "N/A"}
                        </div>
                        <div>
                          <strong>Hospital Name:</strong>{" "}
                          {selectedQR.qrCode.hospitalName || "N/A"}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          {selectedQR.qrCode.status || "N/A"}
                        </div>
                        <div>
                          <strong>Created At:</strong>{" "}
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
            <CardTitle>No Scanned QR Codes Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">You have not scanned any QR codes yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
