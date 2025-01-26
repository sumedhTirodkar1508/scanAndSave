"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  notifyRelatives,
  informSavior,
} from "@/helpers/mailSaviorAndRelatives";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VictimInformationPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [victimData, setVictimData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch QR Code data
  useEffect(() => {
    // console.log("VictimInformationPage useEffect called");
    const qrCodeId = searchParams.get("qrCodeId");
    const notifyBoth = searchParams.get("notifyBoth");

    // console.log("qrCodeId:", qrCodeId);
    // console.log("notifyBoth:", notifyBoth);

    const saviorEmail = session?.user?.email;

    if (qrCodeId) {
      axios
        .get(`/api/qr/get-single-qr?qrId=${qrCodeId}`)
        .then((response) => {
          setVictimData(response.data);

          // Check if notifyBoth is true and send notifications
          if (notifyBoth === "true") {
            axios
              .post("/api/notifyEmail/mailSaviorAndRelatives", {
                qrCodeData: response.data,
                saviorEmail: saviorEmail,
                scanTime: new Date().toISOString(),
              })
              .then(() => {
                toast({
                  title: "Success",
                  description: "Notifications sent successfully.",
                });
              })
              .catch((error) => {
                console.error("Error sending notifications:", error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to send notifications.",
                });
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching victim information:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unable to fetch victim information.",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid QR Code ID.",
      });
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center py-8">Loading victim information...</div>
    );
  }

  if (!victimData) {
    return (
      <div className="text-center py-8">No data found for this QR Code.</div>
    );
  }

  const {
    victimName,
    victimEmail,
    relativeName,
    relativePhone,
    relativeEmail,
    bloodGroup,
    sickness,
    medication,
    status,
  } = victimData;

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Victim Information
          </CardTitle>
          <CardDescription className="text-center">
            Details retrieved from the QR Code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Victim Name */}
            <div>
              <strong>Victim Name:</strong> {victimName}
            </div>
            {/* Victim Email */}
            <div>
              <strong>Victim Email:</strong> {victimEmail}
            </div>
            {/* Relative Name */}
            <div>
              <strong>Relative Name:</strong> {relativeName}
            </div>
            {/* Relative Phone */}
            <div>
              <strong>Relative Phone:</strong> {relativePhone}
            </div>
            {/* Relative Email */}
            <div>
              <strong>Relative Email:</strong> {relativeEmail}
            </div>
            {/* Blood Group */}
            <div>
              <strong>Blood Group:</strong> {bloodGroup}
            </div>
            {/* Sickness */}
            {sickness && (
              <div>
                <strong>Sickness:</strong> {sickness}
              </div>
            )}
            {/* Medication */}
            {medication && (
              <div>
                <strong>Medication:</strong> {medication}
              </div>
            )}
            {/* Status */}
            <div>
              <strong>Status:</strong>{" "}
              <span className="capitalize font-medium">
                {status.toLowerCase()}
              </span>
            </div>
          </div>
        </CardContent>
        {/* <div className="flex justify-center mt-4">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div> */}
      </Card>
    </div>
  );
}
