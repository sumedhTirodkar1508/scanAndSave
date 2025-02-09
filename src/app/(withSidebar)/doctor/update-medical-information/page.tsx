"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogDemo } from "@/helpers/EditMedicalDialog";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";

export default function UpdateMedicalInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("MedicalInfo");
  const [scanning, setScanning] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Wait until session is loaded before checking role
  useEffect(() => {
    if (status === "loading") return; // Wait until session is ready
    // console.log("Session:", session);
    // console.log("Role:", session?.user?.role);

    if (!session || !["ADMIN", "DOC"].includes(session.user.role)) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url); // If this succeeds, it's a valid URL
      return true;
    } catch {
      return false;
    }
  };

  // Handle QR Code Scan
  const handleScan = async (result: string | null) => {
    if (!result) return;
    setScanning(false);

    try {
      setLoading(true);
      // Validate if the scanned result is a valid URL
      if (!isValidURL(result)) {
        toast({
          title: "Invalid QR Code",
          description: "Please scan a valid QR code.",
          variant: "destructive",
        });
        return;
      }

      // Extract qrID from the scanned URL
      const url = new URL(result);
      const qrID = url.searchParams.get("qrCodeId");

      if (!qrID) {
        toast({
          title: "Invalid QR Code",
          description: "QR code does not contain a valid ID.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(`/api/qr/get-single-qr?qrId=${qrID}`);
      setPatientData(response.data);
      //   console.log("Patient Data:", response.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patient details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-4 text-white">
        Update Medical Information
      </h1>

      {/* QR Code Scanner */}
      <div className="flex justify-center mb-4">
        <Button onClick={() => setScanning(!scanning)}>
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </Button>
      </div>

      {scanning && (
        <div className="flex justify-center">
          <BarcodeScannerComponent
            width="50%"
            height={300}
            onUpdate={(err, result) => {
              if (result) handleScan(result.getText());
            }}
          />
        </div>
      )}

      {/* Patient Details & Edit Dialog */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : patientData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal Details */}
              <div>
                <strong>{t("fields.name")}:</strong> {patientData.victimName}{" "}
                {patientData.victimSurname}
              </div>
              <div>
                <strong>{t("fields.email")}:</strong> {patientData.victimEmail}
              </div>
              <div>
                <strong>{t("fields.phone")}:</strong>{" "}
                {patientData.victimTelNumber}
              </div>
              <div>
                <strong>{t("fields.profession")}:</strong>{" "}
                {patientData.victimProfession || "N/A"}
              </div>
              <div>
                <strong>{t("fields.nationality")}:</strong>{" "}
                {patientData.victimNationality || "N/A"}
              </div>
              <div>
                <strong>{t("fields.height")}:</strong>{" "}
                {patientData.victimHeight || "N/A"} cm
              </div>
              <div>
                <strong>{t("fields.weight")}:</strong>{" "}
                {patientData.victimWeight || "N/A"} kg
              </div>
              <div>
                <strong>{t("fields.age")}:</strong>{" "}
                {patientData.victimAge || "N/A"}
              </div>

              {/* Address Details */}
              <div>
                <strong>{t("fields.houseNumber")}:</strong>{" "}
                {patientData.victimHouseNumber || "N/A"}
              </div>
              <div>
                <strong>{t("fields.address")}:</strong>{" "}
                {patientData.victimAddress || "N/A"}
              </div>
              <div>
                <strong>{t("fields.city")}:</strong>{" "}
                {patientData.victimCity || "N/A"}
              </div>
              <div>
                <strong>{t("fields.country")}:</strong>{" "}
                {patientData.victimCountry || "N/A"}
              </div>

              {/* Medical Information */}
              <div>
                <strong>{t("fields.bloodGroup")}:</strong>{" "}
                {patientData.bloodGroup}
              </div>
              <div>
                <strong>{t("fields.onMedication")}:</strong>{" "}
                {patientData.medication || "N/A"}
              </div>
              <div>
                <strong>{t("fields.sickness")}:</strong>{" "}
                {patientData.sickness || "N/A"}
              </div>
              <div>
                <strong>{t("fields.onDrugs")}:</strong>{" "}
                {patientData.onDrugs ? "Yes" : "No"}
              </div>
              {patientData.onDrugs && (
                <div>
                  <strong>{t("fields.drugsName")}:</strong>{" "}
                  {patientData.drugsName || "N/A"}
                </div>
              )}
              <div>
                <strong>{t("fields.doctorPhone")}:</strong>{" "}
                {patientData.doctorPhoneNumber || "N/A"}
              </div>
              <div>
                <strong>{t("fields.hospital")}:</strong>{" "}
                {patientData.hospitalName || "N/A"}
              </div>

              {/* Relatives' Information */}
              {[1, 2, 3].map((i) => {
                const name = patientData[`relative${i}Name`];
                if (!name) return null;

                return (
                  <div key={i} className="col-span-2 border-t pt-2">
                    <div>
                      <strong>
                        {t("fields.relative")} {i}:
                      </strong>{" "}
                      {name} {patientData[`relative${i}Surname`] || ""}
                    </div>
                    <div>
                      <strong>{t("fields.phone")}:</strong>{" "}
                      {patientData[`relative${i}Phone`] || "N/A"}
                    </div>
                    <div>
                      <strong>{t("fields.email")}:</strong>{" "}
                      {patientData[`relative${i}Email`] || "N/A"}
                    </div>
                    <div>
                      <strong>{t("fields.address")}:</strong>{" "}
                      {patientData[`relative${i}Address`] || "N/A"}
                    </div>
                  </div>
                );
              })}

              {/* Status */}
              <div className="col-span-2 border-t pt-2">
                <strong>{t("fields.status")}:</strong>{" "}
                <span className="capitalize font-medium">
                  {status.toLowerCase()}
                </span>
              </div>
              <DialogDemo
                patientData={patientData}
                setPatientData={setPatientData}
              />
            </div>
          ) : (
            <p>No QR code scanned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
