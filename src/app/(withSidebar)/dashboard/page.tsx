"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { QrRequest } from "@/app/types/qrResquests";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface QRCodeData {
  id: string;
  qrCodeUrl: string;
  status: "APPROVED" | "PENDING";
  createdAt: string;
}

export default function DashboardPage() {
  const [approvedQRCodes, setApprovedQRCodes] = useState<QrRequest[]>([]);
  const [pendingQRCodes, setPendingQRCodes] = useState<QrRequest[]>([]);
  const [deletingQRCodeId, setDeletingQRCodeId] = useState<string | null>(null); // State for the QR code to delete
  const { toast } = useToast(); // Access toast hook
  const router = useRouter(); // Use router for redirection
  const t = useTranslations("Dashboard");

  // Fetch QR codes from the backend
  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const response = await axios.get("/api/qr/get-all-qrcodes");
        const data = response.data;

        setApprovedQRCodes(
          data.filter((qr: QRCodeData) => qr.status === "APPROVED")
        );
        setPendingQRCodes(
          data.filter((qr: QRCodeData) => qr.status === "PENDING")
        );
      } catch (error) {
        console.error("Error fetching QR codes:", error);
        toast({
          title: "Error",
          description: "Failed to load QR codes.",
          variant: "destructive",
        });
      }
    };

    fetchQRCodes();
  }, []);

  // Function to download QR code as PDF
  const downloadQrCodeAsPdf = (qrCode: QrRequest) => {
    try {
      if (!qrCode.qrCodeUrl) {
        throw new Error("QR Code URL is not available.");
      }
      const doc = new jsPDF();
      doc.text(`QR Code for ${qrCode.victimName}`, 10, 10);
      doc.addImage(qrCode.qrCodeUrl, "PNG", 10, 20, 50, 50);
      doc.save(`${qrCode.id}_qr_code.pdf`);
      toast({
        title: "Download Success",
        description: "QR Code has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error downloading QR Code as PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download QR Code as a PDF.",
        variant: "destructive",
      });
    }
  };

  // Handle QR Code Actions
  const handleAction = async (
    action: string,
    qrId: string,
    qrCodeUrl?: string
  ) => {
    try {
      switch (action) {
        case "view":
          window.open(`${qrCodeUrl}`, "_blank");
          break;
        case "download":
          const qrCode =
            approvedQRCodes.find((qr) => qr.id === qrId) ||
            pendingQRCodes.find((qr) => qr.id === qrId);
          if (qrCode) downloadQrCodeAsPdf(qrCode);
          break;
        case "edit":
          router.push(`/generateQR?id=${qrId}`); // Redirect to the edit page with qrId
          break;
        case "delete":
          setDeletingQRCodeId(qrId); // Set the QR code to delete
          break;
        case "generateNew":
          toast({ title: "Generate new feature coming soon!" });
          break;
        default:
          console.error("Unknown action:", action);
      }
    } catch (error) {
      console.error(
        `Error performing action (${action}) on QR code ${qrId}:`,
        error
      );
      toast({
        title: "Error",
        description: `Failed to perform action: ${action}.`,
        variant: "destructive",
      });
    }
  };

  // Confirm delete QR code
  const handleDeleteConfirm = async () => {
    if (!deletingQRCodeId) return;

    try {
      const response = await axios.delete(
        `/api/qr/delete-qrcode?qrCodeId=${deletingQRCodeId}`
      );
      console.log("Player deleted successfully", response.data);
      toast({ title: "QR Code deleted successfully!" });

      setApprovedQRCodes(
        approvedQRCodes.filter((qr) => qr.id !== deletingQRCodeId)
      );
      setPendingQRCodes(
        pendingQRCodes.filter((qr) => qr.id !== deletingQRCodeId)
      );
      setDeletingQRCodeId(null); // Reset the deleting QR code ID
    } catch (error) {
      console.error("Error deleting QR code:", error);
      toast({
        title: "Error",
        description: "Failed to delete QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center py-6">
      <h1 className="text-xl font-bold mb-4 text-white">
        {t("dashboardTitle")}
      </h1>
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t("approvedTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-center">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedQRCodes.length > 0 ? (
                approvedQRCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>{qr.victimName}</TableCell>
                    <TableCell>
                      {t(`status.${qr.status.toLowerCase()}`)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            {t("buttons.options")} <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              qr.qrCodeUrl &&
                              handleAction("view", qr.id, qr.qrCodeUrl)
                            }
                          >
                            {t("buttons.viewQR")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              qr.qrCodeUrl &&
                              handleAction("download", qr.id, qr.qrCodeUrl)
                            }
                          >
                            {t("buttons.downloadQR")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("edit", qr.id)}
                          >
                            {t("buttons.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("delete", qr.id)}
                          >
                            {t("buttons.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    {t("messages.noApproved")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("pendingTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-center">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingQRCodes.length > 0 ? (
                pendingQRCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>{qr.victimName}</TableCell>
                    <TableCell>
                      {t(`status.${qr.status.toLowerCase()}`)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            {t("buttons.options")} <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleAction("edit", qr.id)}
                          >
                            {t("buttons.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("delete", qr.id)}
                          >
                            {t("buttons.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    {t("messages.noPending")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for delete confirmation */}
      <Dialog
        open={!!deletingQRCodeId}
        onOpenChange={(open) => !open && setDeletingQRCodeId(null)}
      >
        <DialogTrigger asChild>
          <Button className="hidden">Trigger Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{t("messages.deleteDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("messages.deleteDialog.description")}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingQRCodeId(null)} // Close without deleting
            >
              {t("buttons.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t("buttons.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
