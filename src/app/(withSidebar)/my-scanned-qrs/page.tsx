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
                      {new Date(qr.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>QR Code Details</DialogTitle>
                  </DialogHeader>
                  {selectedQR && (
                    <div className="grid gap-4">
                      <div>
                        <strong>Victim Name:</strong>{" "}
                        {selectedQR.qrCode.victimName || "N/A"}
                      </div>
                      <div>
                        <strong>Victim Email:</strong>{" "}
                        {selectedQR.qrCode.victimEmail || "N/A"}
                      </div>
                      <div>
                        <strong>Blood Group:</strong>{" "}
                        {selectedQR.qrCode.bloodGroup || "N/A"}
                      </div>
                      <div>
                        <strong>Medication:</strong>{" "}
                        {selectedQR.qrCode.medication || "N/A"}
                      </div>
                      <div>
                        <strong>Relative Name:</strong>{" "}
                        {selectedQR.qrCode.relativeName || "N/A"}
                      </div>
                      <div>
                        <strong>Relative Phone:</strong>{" "}
                        {selectedQR.qrCode.relativePhone || "N/A"}
                      </div>
                      <div>
                        <strong>Relative Email:</strong>{" "}
                        {selectedQR.qrCode.relativeEmail || "N/A"}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        {selectedQR.qrCode.status || "N/A"}
                      </div>
                      <div>
                        <strong>Created At:</strong>{" "}
                        {new Date(selectedQR.qrCode.createdAt).toLocaleString()}
                      </div>
                      <div className="flex justify-center">
                        <img src={selectedQR.qrCode.qrCodeUrl} />
                      </div>
                    </div>
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
