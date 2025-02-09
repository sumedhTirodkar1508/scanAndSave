"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DocUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      console.log("Redirecting to /dashboard as you are not an admin user.");
      router.push("/dashboard");
    }
  }, [status, session]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-doc-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      await axios.put("/api/admin/get-all-doc-users", selectedUser);
      toast({ title: "Success", description: "User updated successfully!" });
      fetchUsers();
      setSelectedUser(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete("/api/admin/doc-users", { data: { id } });
      toast({ title: "Success", description: "User deleted successfully!" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    }
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Doctors List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-2 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[425px]"
                      aria-describedby="edit-user-description"
                    >
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription id="edit-user-description">
                          Update the user&apos;s information and save changes.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={selectedUser?.name || ""}
                            onChange={(e) =>
                              setSelectedUser((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            disabled
                            value={selectedUser?.email || ""}
                            onChange={(e) =>
                              setSelectedUser((prev) =>
                                prev ? { ...prev, email: e.target.value } : null
                              )
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={updateUser}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
