"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
          description: "Failed to fetch savior data.",
        });
      })
      .finally(() => setLoading(false));
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Saviors and QR Codes</h1>
      {saviors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Savior Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Victim Name</TableHead>
              <TableHead>Victim Email</TableHead>
              <TableHead>Date Scanned</TableHead>
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
                          : "/scanneSauverLogo.jpg" // Fallback image
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
                  {savior.qrCode ? savior.qrCode.victimEmail : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(savior.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Saviors Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">
              No savior data is available for any user.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
