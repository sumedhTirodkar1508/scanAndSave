import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function DialogDemo({
  patientData,
  setPatientData,
}: {
  patientData: any;
  setPatientData: any;
}) {
  const { toast } = useToast(); // Initialize toast
  const [open, setOpen] = useState(false); // Manage dialog state
  const [formData, setFormData] = useState({
    bloodGroup: "",
    medication: "",
    sickness: "",
    onDrugs: false,
    drugsName: "",
    doctorPhoneNumber: "",
    hospitalName: "",
  });

  // Update formData when patientData changes
  useEffect(() => {
    if (patientData) {
      setFormData({
        bloodGroup: patientData.bloodGroup || "",
        medication: patientData.medication || "",
        sickness: patientData.sickness || "",
        onDrugs: Boolean(patientData.onDrugs),
        drugsName: patientData.drugsName || "",
        doctorPhoneNumber: patientData.doctorPhoneNumber || "",
        hospitalName: patientData.hospitalName || "",
      });
    }
  }, [patientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, onDrugs: checked });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`/api/qr/update-medical-info`, {
        qrId: patientData.id,
        ...formData,
      });

      setPatientData(response.data); // Update patient data
      toast({
        title: "Success",
        description: "Medical info updated successfully.",
        variant: "default",
      });

      setOpen(false); // Close dialog
    } catch (error) {
      console.error("Error updating medical info:", error);
      toast({
        title: "Error",
        description: "Failed to update medical info.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-4 w-full place-items-center"
          onClick={() => setOpen(true)}
        >
          Edit Medical Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Medical Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Blood Group Dropdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bloodGroup" className="text-right">
              Blood Group
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, bloodGroup: value })
              }
              value={formData.bloodGroup}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Blood Group" />
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="medication" className="text-right">
              Medication
            </Label>
            <Input
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sickness" className="text-right">
              Sickness
            </Label>
            <Input
              id="sickness"
              name="sickness"
              value={formData.sickness}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="onDrugs" className="text-right">
              On Drugs
            </Label>
            <Checkbox
              id="onDrugs"
              checked={formData.onDrugs}
              onCheckedChange={handleCheckboxChange}
              className="col-span-3"
            />
          </div>

          {formData.onDrugs && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="drugsName" className="text-right">
                Drug Name
              </Label>
              <Input
                id="drugsName"
                name="drugsName"
                value={formData.drugsName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctorPhoneNumber" className="text-right">
              Doctor&apos;s Contact
            </Label>
            <Input
              id="doctorPhoneNumber"
              name="doctorPhoneNumber"
              value={formData.doctorPhoneNumber}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hospitalName" className="text-right">
              Hospital Name
            </Label>
            <Input
              id="hospitalName"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
