"use client";

import {
  ScrollText,
  LogOut,
  LayoutDashboard,
  QrCode,
  Link,
  Check,
  BriefcaseMedical,
  Search,
  Scan,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "@/components/nav-user";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Generate QR",
    url: "/generateQR",
    icon: QrCode,
  },
  {
    title: "Savior Info",
    url: "/savior-information",
    icon: BriefcaseMedical,
  },
  {
    title: "My Scanned QRs",
    url: "/my-scanned-qrs",
    icon: Search,
  },
  {
    title: "Scan QR",
    url: "/qr-scanner",
    icon: Scan,
  },
];

// Admin-specific items.
const adminItems = [
  {
    title: "Approve/Reject QR",
    url: "/admin/qr-approvals",
    icon: Check,
  },
  {
    title: "Savior Links",
    url: "/admin/savior-links",
    icon: Link,
  },
];

// const data = {
//   user: {
//     name: "Scanne Pour Sauver",
//     email: "dummyemail@gmail.com",
//     avatar: "../../scanneSauverLogo.jpg",
//   },
// };

export function AppSidebar() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession(); // Use session data to determine the user's role.

  const data = {
    user: {
      name: session?.user?.name || "Scanne Pour Sauver",
      email: session?.user?.email || "dummyemail@gmail.com",
      avatar: session?.user?.image || "../../scanneSauverLogo.jpg",
    },
  };

  const userItems = session?.user?.isTemporary
    ? [{ title: "My Scanned QRs", url: "/my-scanned-qrs", icon: Search }]
    : items;

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/login" }); // NextAuth's signOut method
      toast({
        title: "Success",
        description: "Logout successful!",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader onClick={() => router.push("/dashboard")}>
          <NavUser user={data.user} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />

                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Admin Section */}
          {session?.user?.role === "ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem key="logout">
              <SidebarMenuButton onClick={logout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {/* <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarInset> */}
    </>
  );
}
