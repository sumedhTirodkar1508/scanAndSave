// `/pages/saviors.tsx`
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
import { SaviorQRCode } from "@/app/types/saviorQrCode";

export default function SaviorsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [saviors, setSaviors] = useState<SaviorQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaviors();
    // axios
    //   .get(`/api/savior/get-saviors-for-user?userId=${session.user.id}`)
    //   .then((response) => {
    //     setSaviors(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching saviors:", error);
    //     toast({
    //       variant: "destructive",
    //       title: "Error",
    //       description:
    //         error?.response?.data?.error || "Failed to fetch savior data.",
    //     });
    //   })
    //   .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const fetchSaviors = async () => {
    setLoading(true);
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID is missing. Please log in.",
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
        description: "Failed to fetch savior data.",
      });
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Saviors List</h1>
      {saviors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Savior Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Victim Name</TableHead>
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
                          : "/scanneSauverLogo.jpg" // Provide a fallback image
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
              No savior data is available for this user.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
