"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { QrRequest } from "@/app/types/qrResquests";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QRApprovals() {
  const { data: session, status } = useSession();
  const [qrRequests, setQrRequests] = useState<QrRequest[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      // Redirect if unauthenticated or role is not ADMIN
      console.log("Redirecting to /dashboard as you are not an admin user.");
      router.push("/dashboard");
    } else {
      fetchQrRequests();
    }
  }, [status, session]);

  const fetchQrRequests = async () => {
    try {
      const response = await axios.get<{ message: string; data: QrRequest[] }>(
        "/api/admin/qr/get-pending-qr-requests"
      );
      setQrRequests(response.data.data);
      //   console.log(response.data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching QR requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (qrId: string, approve: boolean) => {
    setLoading(true);
    try {
      await axios.post("/api/admin/qr/approve-reject-qr", { qrId, approve });
      fetchQrRequests();
      toast({
        title: "Success",
        description: approve
          ? "QR code approved successfully."
          : "QR code rejected successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating QR code status.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-8">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">QR Code Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? ( // Show loader when loading is true
            <div className="flex justify-center items-center py-10">
              <p className="ml-4">Loading requests...</p>
            </div>
          ) : qrRequests.length > 0 ? (
            <Table>
              <TableCaption>
                A list of pending QR code approval requests.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Victim Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrRequests.map((qr: QrRequest) => (
                  <TableRow key={qr.id}>
                    <TableCell>{qr.victimName}</TableCell>
                    <TableCell>{qr.bloodGroup}</TableCell>
                    <TableCell>{qr.victimEmail}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="default"
                        onClick={() => handleApproval(qr.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleApproval(qr.id, false)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No pending QR requests found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
