"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GenerateQRPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("GenerateQR");

  // Get the user session using NextAuth's useSession hook
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [qrDetails, setQRDetails] = useState({
    victimName: "",
    victimSurname: "",
    victimEmail: "",
    victimHeight: "",
    victimWeight: "",
    victimAge: "",
    victimProfession: "",
    victimNationality: "",
    victimTelNumber: "",
    victimHouseNumber: "",
    victimAddress: "",
    victimCity: "",
    victimCountry: "",
    relative1Name: "",
    relative1Surname: "",
    relative1Address: "",
    relative1Phone: "",
    relative1Email: "",
    relative2Name: "",
    relative2Surname: "",
    relative2Address: "",
    relative2Phone: "",
    relative2Email: "",
    relative3Name: "",
    relative3Surname: "",
    relative3Address: "",
    relative3Phone: "",
    relative3Email: "",
    bloodGroup: "",
    onDrugs: false,
    drugsName: "",
    doctorPhoneNumber: "",
    sickness: "",
    medication: "",
    hospitalName: "",
    qrStatus: "",
  });

  // Handle input changes dynamically
  const handleInputChange = (field: string, value: string | boolean) => {
    setQRDetails({ ...qrDetails, [field]: value });
  };

  // Fetch QR details if qrId is passed
  useEffect(() => {
    const qrCodeId = searchParams.get("id");
    if (qrCodeId) {
      setIsEditing(true); // Set the flag for editing
      // Fetch the QR details from DB using qrId
      axios
        .get(`/api/qr/get-single-qr?qrId=${qrCodeId}`) // Assuming you have an API endpoint to get QR details
        .then((response) => {
          const data = response.data;
          setQRDetails({
            victimName: data.victimName || "",
            victimSurname: data.victimSurname || "",
            victimEmail: data.victimEmail || "",
            victimHeight: data.victimHeight || null,
            victimWeight: data.victimWeight || null,
            victimAge: data.victimAge || null,
            victimProfession: data.victimProfession || "",
            victimNationality: data.victimNationality || "",
            victimTelNumber: data.victimTelNumber || "",
            victimHouseNumber: data.victimHouseNumber || "",
            victimAddress: data.victimAddress || "",
            victimCity: data.victimCity || "",
            victimCountry: data.victimCountry || "",
            relative1Name: data.relative1Name || "",
            relative1Surname: data.relative1Surname || "",
            relative1Address: data.relative1Address || "",
            relative1Phone: data.relative1Phone || "",
            relative1Email: data.relative1Email || "",
            relative2Name: data.relative2Name || "",
            relative2Surname: data.relative2Surname || "",
            relative2Address: data.relative2Address || "",
            relative2Phone: data.relative2Phone || "",
            relative2Email: data.relative2Email || "",
            relative3Name: data.relative3Name || "",
            relative3Surname: data.relative3Surname || "",
            relative3Address: data.relative3Address || "",
            relative3Phone: data.relative3Phone || "",
            relative3Email: data.relative3Email || "",
            bloodGroup: data.bloodGroup || "",
            onDrugs: data.onDrugs || false,
            drugsName: data.drugsName || "",
            doctorPhoneNumber: data.doctorPhoneNumber || "",
            sickness: data.sickness || "",
            medication: data.medication || "",
            hospitalName: data.hospitalName || "",
            qrStatus: data.status || "PENDING",
          });
        })
        .catch((error) => {
          console.error("Error fetching QR code details:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unable to fetch QR code details.",
          });
        });
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Ensure the session is available
      if (!session || !session.user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: t("messages.loginRequired"),
        });
        return;
      }
      // Get the userId from session
      const userId = session.user.id;

      const qrId = searchParams.get("id");

      const url = isEditing
        ? `/api/qr/update-qr?qrId=${qrId}` // Update API if editing
        : "/api/qr/request-approval"; // New QR creation API

      const requestData = {
        ...qrDetails,
        userId,
        reqStatus: isEditing ? "PENDING" : "NEW", // Different status depending on edit or new
      };

      // Submit the form data
      await axios.post(url, requestData);

      // Notify success
      toast({
        title: isEditing ? "Success" : "Created",
        description: isEditing
          ? t("messages.editSuccess")
          : t("messages.success"),
      });

      router.push("/dashboard"); // Redirect after success
    } catch (error) {
      console.log(
        `error ${isEditing ? "updating" : "creating"} QR code: ${error}`
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: t("messages.error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {loading
              ? t("title.processing")
              : isEditing
              ? t("title.edit")
              : t("title.new")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full gap-4">
              {/* Victim Details */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimName">{t("victimDetails.name")}</Label>
                <Input
                  id="victimName"
                  type="text"
                  value={qrDetails.victimName}
                  onChange={(e) =>
                    handleInputChange("victimName", e.target.value)
                  }
                  placeholder={t("victimDetails.name")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimSurname">
                  {t("victimDetails.surname")}
                </Label>
                <Input
                  id="victimSurname"
                  type="text"
                  value={qrDetails.victimSurname}
                  onChange={(e) =>
                    handleInputChange("victimSurname", e.target.value)
                  }
                  placeholder={t("victimDetails.surname")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimEmail">{t("victimDetails.email")}</Label>
                <Input
                  id="victimEmail"
                  type="email"
                  value={qrDetails.victimEmail}
                  onChange={(e) =>
                    handleInputChange("victimEmail", e.target.value)
                  }
                  placeholder={t("victimDetails.email")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimHeight">
                  {t("victimDetails.height")}
                </Label>
                <Input
                  id="victimHeight"
                  type="number"
                  value={qrDetails.victimHeight || ""}
                  onChange={(e) =>
                    handleInputChange("victimHeight", e.target.value)
                  }
                  placeholder={t("victimDetails.height")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimWeight">
                  {t("victimDetails.weight")}
                </Label>
                <Input
                  id="victimWeight"
                  type="number"
                  value={qrDetails.victimWeight || ""}
                  onChange={(e) =>
                    handleInputChange("victimWeight", e.target.value)
                  }
                  placeholder={t("victimDetails.weight")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimAge">{t("victimDetails.age")}</Label>
                <Input
                  id="victimAge"
                  type="number"
                  value={qrDetails.victimAge || ""}
                  onChange={(e) =>
                    handleInputChange("victimAge", e.target.value)
                  }
                  placeholder={t("victimDetails.age")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimProfession">
                  {t("victimDetails.profession")}
                </Label>
                <Input
                  id="victimProfession"
                  type="text"
                  value={qrDetails.victimProfession}
                  onChange={(e) =>
                    handleInputChange("victimProfession", e.target.value)
                  }
                  placeholder={t("victimDetails.profession")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimNationality">
                  {t("victimDetails.nationality")}
                </Label>
                <Input
                  id="victimNationality"
                  type="text"
                  value={qrDetails.victimNationality}
                  onChange={(e) =>
                    handleInputChange("victimNationality", e.target.value)
                  }
                  placeholder={t("victimDetails.nationality")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimTelNumber">
                  {t("victimDetails.phone")}
                </Label>
                <Input
                  id="victimTelNumber"
                  type="text"
                  value={qrDetails.victimTelNumber}
                  onChange={(e) =>
                    handleInputChange("victimTelNumber", e.target.value)
                  }
                  placeholder={t("victimDetails.phone")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimHouseNumber">
                  {t("victimDetails.houseNumber")}
                </Label>
                <Input
                  id="victimHouseNumber"
                  type="text"
                  value={qrDetails.victimHouseNumber}
                  onChange={(e) =>
                    handleInputChange("victimHouseNumber", e.target.value)
                  }
                  placeholder={t("victimDetails.houseNumber")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimAddress">
                  {t("victimDetails.address")}
                </Label>
                <Input
                  id="victimAddress"
                  type="text"
                  value={qrDetails.victimAddress}
                  onChange={(e) =>
                    handleInputChange("victimAddress", e.target.value)
                  }
                  placeholder={t("victimDetails.address")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimCity">{t("victimDetails.city")}</Label>
                <Input
                  id="victimCity"
                  type="text"
                  value={qrDetails.victimCity}
                  onChange={(e) =>
                    handleInputChange("victimCity", e.target.value)
                  }
                  placeholder={t("victimDetails.city")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimCountry">
                  {t("victimDetails.country")}
                </Label>
                <Input
                  id="victimCountry"
                  type="text"
                  value={qrDetails.victimCountry}
                  onChange={(e) =>
                    handleInputChange("victimCountry", e.target.value)
                  }
                  placeholder={t("victimDetails.country")}
                />
              </div>

              {/* Relative 1 Details */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative1Name">
                  {t("relativeDetails.title", { number: 1 })}{" "}
                  {t("relativeDetails.name")}
                </Label>
                <Input
                  id="relative1Name"
                  type="text"
                  value={qrDetails.relative1Name}
                  onChange={(e) =>
                    handleInputChange("relative1Name", e.target.value)
                  }
                  placeholder="Enter relative 1's name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative1Surname">
                  {t("relativeDetails.title", { number: 1 })}{" "}
                  {t("relativeDetails.surname")}
                </Label>
                <Input
                  id="relative1Surname"
                  type="text"
                  value={qrDetails.relative1Surname}
                  onChange={(e) =>
                    handleInputChange("relative1Surname", e.target.value)
                  }
                  placeholder="Enter relative 1's surname"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative1Address">
                  {t("relativeDetails.title", { number: 1 })}{" "}
                  {t("relativeDetails.address")}
                </Label>
                <Input
                  id="relative1Address"
                  type="text"
                  value={qrDetails.relative1Address}
                  onChange={(e) =>
                    handleInputChange("relative1Address", e.target.value)
                  }
                  placeholder="Enter relative 1's address"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative1Phone">
                  {t("relativeDetails.title", { number: 1 })}{" "}
                  {t("relativeDetails.phone")}
                </Label>
                <Input
                  id="relative1Phone"
                  type="text"
                  value={qrDetails.relative1Phone}
                  onChange={(e) =>
                    handleInputChange("relative1Phone", e.target.value)
                  }
                  placeholder="Enter relative 1's phone number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative1Email">
                  {t("relativeDetails.title", { number: 1 })}{" "}
                  {t("relativeDetails.email")}
                </Label>
                <Input
                  id="relative1Email"
                  type="email"
                  value={qrDetails.relative1Email}
                  onChange={(e) =>
                    handleInputChange("relative1Email", e.target.value)
                  }
                  placeholder="Enter relative 1's email"
                />
              </div>

              {/* Relative 2 Details */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative2Name">
                  {t("relativeDetails.title", { number: 2 })}{" "}
                  {t("relativeDetails.name")}
                </Label>
                <Input
                  id="relative2Name"
                  type="text"
                  value={qrDetails.relative2Name}
                  onChange={(e) =>
                    handleInputChange("relative2Name", e.target.value)
                  }
                  placeholder="Enter relative 2's name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative2Surname">
                  {t("relativeDetails.title", { number: 2 })}{" "}
                  {t("relativeDetails.surname")}
                </Label>
                <Input
                  id="relative2Surname"
                  type="text"
                  value={qrDetails.relative2Surname}
                  onChange={(e) =>
                    handleInputChange("relative2Surname", e.target.value)
                  }
                  placeholder="Enter relative 2's surname"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative2Address">
                  {t("relativeDetails.title", { number: 2 })}{" "}
                  {t("relativeDetails.address")}
                </Label>
                <Input
                  id="relative2Address"
                  type="text"
                  value={qrDetails.relative2Address}
                  onChange={(e) =>
                    handleInputChange("relative2Address", e.target.value)
                  }
                  placeholder="Enter relative 2's address"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative2Phone">
                  {t("relativeDetails.title", { number: 2 })}{" "}
                  {t("relativeDetails.phone")}
                </Label>
                <Input
                  id="relative2Phone"
                  type="text"
                  value={qrDetails.relative2Phone}
                  onChange={(e) =>
                    handleInputChange("relative2Phone", e.target.value)
                  }
                  placeholder="Enter relative 2's phone number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative2Email">
                  {t("relativeDetails.title", { number: 2 })}{" "}
                  {t("relativeDetails.email")}
                </Label>
                <Input
                  id="relative2Email"
                  type="email"
                  value={qrDetails.relative2Email}
                  onChange={(e) =>
                    handleInputChange("relative2Email", e.target.value)
                  }
                  placeholder="Enter relative 2's email"
                />
              </div>

              {/* Relative 3 Details */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative3Name">
                  {t("relativeDetails.title", { number: 3 })}{" "}
                  {t("relativeDetails.name")}
                </Label>
                <Input
                  id="relative3Name"
                  type="text"
                  value={qrDetails.relative3Name}
                  onChange={(e) =>
                    handleInputChange("relative3Name", e.target.value)
                  }
                  placeholder="Enter relative 3's name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative3Surname">
                  {t("relativeDetails.title", { number: 3 })}{" "}
                  {t("relativeDetails.surname")}
                </Label>
                <Input
                  id="relative3Surname"
                  type="text"
                  value={qrDetails.relative3Surname}
                  onChange={(e) =>
                    handleInputChange("relative3Surname", e.target.value)
                  }
                  placeholder="Enter relative 3's surname"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative3Address">
                  {t("relativeDetails.title", { number: 3 })}{" "}
                  {t("relativeDetails.address")}
                </Label>
                <Input
                  id="relative3Address"
                  type="text"
                  value={qrDetails.relative3Address}
                  onChange={(e) =>
                    handleInputChange("relative3Address", e.target.value)
                  }
                  placeholder="Enter relative 3's address"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative3Phone">
                  {t("relativeDetails.title", { number: 3 })}{" "}
                  {t("relativeDetails.phone")}
                </Label>
                <Input
                  id="relative3Phone"
                  type="text"
                  value={qrDetails.relative3Phone}
                  onChange={(e) =>
                    handleInputChange("relative3Phone", e.target.value)
                  }
                  placeholder="Enter relative 3's phone number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relative3Email">
                  {t("relativeDetails.title", { number: 3 })}{" "}
                  {t("relativeDetails.email")}
                </Label>
                <Input
                  id="relative3Email"
                  type="email"
                  value={qrDetails.relative3Email}
                  onChange={(e) =>
                    handleInputChange("relative3Email", e.target.value)
                  }
                  placeholder="Enter relative 3's email"
                />
              </div>

              {/* Medical Information */}
              {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bloodGroup">
                  {t("medicalInfo.bloodGroup")}
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("bloodGroup", value)
                  }
                  value={qrDetails.bloodGroup}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("placeholders.selectBloodGroup")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="onDrugs">{t("medicalInfo.onDrugs")}</Label>
                <Input
                  id="onDrugs"
                  type="checkbox"
                  checked={qrDetails.onDrugs}
                  onChange={(e) =>
                    handleInputChange("onDrugs", e.target.checked)
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="drugsName">{t("medicalInfo.drugsName")}</Label>
                <Input
                  id="drugsName"
                  type="text"
                  value={qrDetails.drugsName}
                  onChange={(e) =>
                    handleInputChange("drugsName", e.target.value)
                  }
                  placeholder="Enter drugs name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="doctorPhoneNumber">
                  {t("medicalInfo.doctorPhone")}
                </Label>
                <Input
                  id="doctorPhoneNumber"
                  type="text"
                  value={qrDetails.doctorPhoneNumber}
                  onChange={(e) =>
                    handleInputChange("doctorPhoneNumber", e.target.value)
                  }
                  placeholder="Enter doctor's phone number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sickness">{t("medicalInfo.sickness")}</Label>
                <Textarea
                  id="sickness"
                  value={qrDetails.sickness}
                  onChange={(e) =>
                    handleInputChange("sickness", e.target.value)
                  }
                  placeholder={t("placeholders.describeSickness")}
                  maxLength={200} // Limit to 200 characters
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="medication">
                  {t("medicalInfo.medication")}
                </Label>
                <Textarea
                  id="medication"
                  value={qrDetails.medication}
                  onChange={(e) =>
                    handleInputChange("medication", e.target.value)
                  }
                  placeholder={t("placeholders.listMedications")}
                  maxLength={200} // Limit to 200 characters
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="hospitalName">
                  {t("medicalInfo.hospital")}
                </Label>
                <Input
                  id="hospitalName"
                  type="text"
                  value={qrDetails.hospitalName}
                  onChange={(e) =>
                    handleInputChange("hospitalName", e.target.value)
                  }
                  placeholder="Enter hospital name"
                />
              </div> */}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-start gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isEditing
                ? t("buttons.editing")
                : t("buttons.submitting")
              : isEditing
              ? t("buttons.edit")
              : t("buttons.submit")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto ml-2"
          >
            {t("buttons.cancel")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
