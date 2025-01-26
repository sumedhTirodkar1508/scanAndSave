"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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

  // Get the user session using NextAuth's useSession hook
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [qrDetails, setQRDetails] = useState({
    victimName: "",
    victimEmail: "",
    relativeName: "",
    relativePhone: "",
    relativeEmail: "",
    bloodGroup: "",
    sickness: "",
    medication: "",
    qrStatus: "",
  });

  // Handle input changes dynamically
  const handleInputChange = (field: string, value: string) => {
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
            victimEmail: data.victimEmail || "",
            relativeName: data.relativeName || "",
            relativePhone: data.relativePhone || "",
            relativeEmail: data.relativeEmail || "",
            bloodGroup: data.bloodGroup || "",
            sickness: data.sickness || "",
            medication: data.medication || "",
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
          description: "User not logged in.",
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
          ? "QR code updated successfully!"
          : "QR code creation request submitted successfully! Awaiting approval.",
      });

      router.push("/dashboard"); // Redirect after success
    } catch (error) {
      console.log(
        `error ${isEditing ? "updating" : "creating"} QR code: ${error}`
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing the QR code.",
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
              ? "Processing..."
              : isEditing
              ? "Edit QR Code"
              : "Generate QR Code"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full gap-4">
              {/* Victim Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimName">Name</Label>
                <Input
                  id="victimName"
                  type="text"
                  value={qrDetails.victimName}
                  onChange={(e) =>
                    handleInputChange("victimName", e.target.value)
                  }
                  placeholder="Enter victim's name"
                />
              </div>

              {/* Victim Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="victimEmail">Email</Label>
                <Input
                  id="victimEmail"
                  type="email"
                  value={qrDetails.victimEmail}
                  onChange={(e) =>
                    handleInputChange("victimEmail", e.target.value)
                  }
                  placeholder="Enter victim's email"
                />
              </div>

              {/* Relative Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relativeName">Relative Name</Label>
                <Input
                  id="relativeName"
                  type="text"
                  value={qrDetails.relativeName}
                  onChange={(e) =>
                    handleInputChange("relativeName", e.target.value)
                  }
                  placeholder="Enter relative's name"
                />
              </div>

              {/* Relative Phone */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relativePhone">Relative Phone</Label>
                <Input
                  id="relativePhone"
                  type="text"
                  value={qrDetails.relativePhone}
                  onChange={(e) =>
                    handleInputChange("relativePhone", e.target.value)
                  }
                  placeholder="Enter relative's phone number"
                />
              </div>

              {/* Relative Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="relativeEmail">Relative Email</Label>
                <Input
                  id="relativeEmail"
                  type="email"
                  value={qrDetails.relativeEmail}
                  onChange={(e) =>
                    handleInputChange("relativeEmail", e.target.value)
                  }
                  placeholder="Enter relative's email"
                />
              </div>

              {/* Blood Group */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("bloodGroup", value)
                  }
                  value={qrDetails.bloodGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
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

              {/* Sickness */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sickness">Sickness</Label>
                <Textarea
                  id="sickness"
                  value={qrDetails.sickness}
                  onChange={(e) =>
                    handleInputChange("sickness", e.target.value)
                  }
                  placeholder="Describe sickness"
                  maxLength={200} // Limit to 200 characters
                />
              </div>

              {/* Medication */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="medication">Medication</Label>
                <Textarea
                  id="medication"
                  value={qrDetails.medication}
                  onChange={(e) =>
                    handleInputChange("medication", e.target.value)
                  }
                  placeholder="List any medications"
                  maxLength={200} // Limit to 200 characters
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-start gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isEditing
                ? "Editing..."
                : "Creating..."
              : isEditing
              ? "Edit QR Code"
              : "Generate QR Code"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto ml-2"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
