"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
  const t = useTranslations("VictimInfo");
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
    return <div className="text-center py-8">{t("loading")}</div>;
  }

  if (!victimData) {
    return <div className="text-center py-8">{t("noData")}</div>;
  }

  const {
    victimName,
    victimSurname,
    victimEmail,
    victimHeight,
    victimWeight,
    victimAge,
    victimProfession,
    victimNationality,
    victimTelNumber,
    victimHouseNumber,
    victimAddress,
    victimCity,
    victimCountry,
    relative1Name,
    relative1Surname,
    relative1Address,
    relative1Phone,
    relative1Email,
    relative2Name,
    relative2Surname,
    relative2Address,
    relative2Phone,
    relative2Email,
    relative3Name,
    relative3Surname,
    relative3Address,
    relative3Phone,
    relative3Email,
    bloodGroup,
    onDrugs,
    drugsName,
    doctorPhoneNumber,
    sickness,
    medication,
    hospitalName,
    status,
    displayPicUrl,
  } = victimData;

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Victim Profile Picture */}
          {displayPicUrl && (
            <div className="flex justify-center">
              <Image
                src={displayPicUrl}
                alt={t("fields.name")}
                width={150}
                height={150}
                className="rounded-full border border-gray-300"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Personal Details */}
            <div>
              <strong>{t("fields.name")}:</strong> {victimName} {victimSurname}
            </div>
            <div>
              <strong>{t("fields.email")}:</strong> {victimEmail}
            </div>
            <div>
              <strong>{t("fields.phone")}:</strong> {victimTelNumber}
            </div>
            <div>
              <strong>{t("fields.profession")}:</strong>{" "}
              {victimProfession || "N/A"}
            </div>
            <div>
              <strong>{t("fields.nationality")}:</strong>{" "}
              {victimNationality || "N/A"}
            </div>
            <div>
              <strong>{t("fields.height")}:</strong> {victimHeight || "N/A"} cm
            </div>
            <div>
              <strong>{t("fields.weight")}:</strong> {victimWeight || "N/A"} kg
            </div>
            <div>
              <strong>{t("fields.age")}:</strong> {victimAge || "N/A"}
            </div>

            {/* Address Details */}
            <div>
              <strong>{t("fields.houseNumber")}:</strong>{" "}
              {victimHouseNumber || "N/A"}
            </div>
            <div>
              <strong>{t("fields.address")}:</strong> {victimAddress || "N/A"}
            </div>
            <div>
              <strong>{t("fields.city")}:</strong> {victimCity || "N/A"}
            </div>
            <div>
              <strong>{t("fields.country")}:</strong> {victimCountry || "N/A"}
            </div>

            {/* Medical Information */}
            {/* <div>
              <strong>{t("fields.bloodGroup")}:</strong> {bloodGroup}
            </div>
            <div>
              <strong>{t("fields.onMedication")}:</strong> {medication || "N/A"}
            </div>
            <div>
              <strong>{t("fields.sickness")}:</strong> {sickness || "N/A"}
            </div>
            <div>
              <strong>{t("fields.onDrugs")}:</strong> {onDrugs ? "Yes" : "No"}
            </div>
            {onDrugs && (
              <div>
                <strong>{t("fields.drugsName")}:</strong> {drugsName || "N/A"}
              </div>
            )}
            <div>
              <strong>{t("fields.doctorPhone")}:</strong>{" "}
              {doctorPhoneNumber || "N/A"}
            </div>
            <div>
              <strong>{t("fields.hospital")}:</strong> {hospitalName || "N/A"}
            </div> */}

            {/* Relatives' Information */}
            {[1, 2, 3].map((i) => {
              const name = victimData[`relative${i}Name`];
              if (!name) return null;

              return (
                <div key={i} className="col-span-2 border-t pt-2">
                  <div>
                    <strong>
                      {t("fields.relative")} {i}:
                    </strong>{" "}
                    {name} {victimData[`relative${i}Surname`] || ""}
                  </div>
                  <div>
                    <strong>{t("fields.phone")}:</strong>{" "}
                    {victimData[`relative${i}Phone`] || "N/A"}
                  </div>
                  <div>
                    <strong>{t("fields.email")}:</strong>{" "}
                    {victimData[`relative${i}Email`] || "N/A"}
                  </div>
                  <div>
                    <strong>{t("fields.address")}:</strong>{" "}
                    {victimData[`relative${i}Address`] || "N/A"}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
