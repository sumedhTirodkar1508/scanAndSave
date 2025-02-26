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
  UserPlus,
  List,
  SquareActivity,
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
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession(); // Use session data to determine the user's role.
  const t = useTranslations("Sidebar");

  // Menu items.
  const items = [
    {
      title: t("menu.dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("menu.generateQR"),
      url: "/generateQR",
      icon: QrCode,
    },
    {
      title: t("menu.saviorInfo"),
      url: "/savior-information",
      icon: BriefcaseMedical,
    },
    {
      title: t("menu.myScannedQRs"),
      url: "/my-scanned-qrs",
      icon: Search,
    },
    {
      title: t("menu.scanQR"),
      url: "/qr-scanner",
      icon: Scan,
    },
  ];

  // Admin-specific items.
  const adminItems = [
    {
      title: t("menu.approveReject"),
      url: "/admin/qr-approvals",
      icon: Check,
    },
    {
      title: t("menu.saviorLinks"),
      url: "/admin/savior-links",
      icon: Link,
    },
    {
      title: t("menu.hospitalUser"),
      url: "/admin/create-hospital-user",
      icon: UserPlus,
    },
    {
      title: t("menu.hospitalUserList"),
      url: "/admin/hospital-user-list",
      icon: List,
    },
  ];
  // DOC-specific items.
  const docItems = [
    {
      title: t("menu.updateMedInfo"),
      url: "/doctor/update-medical-information",
      icon: SquareActivity,
    },
    // {
    //   title: t("menu.hospitalUserList"),
    //   url: "/admin/hospital-user-list",
    //   icon: List,
    // },
  ];

  const data = {
    user: {
      name: session?.user?.name || "Scanne Pour Sauver",
      email: session?.user?.email || "dummyemail@gmail.com",
      avatar: session?.user?.image || "../../scanneSauverLogo.png",
    },
  };

  const userItems = session?.user?.isTemporary
    ? [
        { title: t("menu.myScannedQRs"), url: "/my-scanned-qrs", icon: Search },
        { title: t("menu.scanQR"), url: "/qr-scanner", icon: Scan },
      ]
    : items;

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/login" }); // NextAuth's signOut method
      toast({
        title: "Success",
        description: t("menu.logout"),
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

  const DocorADMINisAllowed =
    session?.user?.role === "ADMIN" || session?.user?.role === "DOC";
  const USERorADMINisAllowed =
    session?.user?.role === "ADMIN" || session?.user?.role === "USER";

  return (
    <>
      <Sidebar className="bg-[var(--sidebar-background)] text-white">
        <SidebarHeader
          onClick={() => router.push("/dashboard")}
          className="hover:bg-[var(--sidebar-accent)] transition-colors"
        >
          <NavUser user={data.user} />
        </SidebarHeader>
        <SidebarContent>
          {USERorADMINisAllowed && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-white">
                {t("navigation")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-[var(--sidebar-accent)] hover:text-white transition-colors"
                      >
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

          {/* Admin Section */}
          {session?.user?.role === "ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-white">
                {t("admin")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-[var(--sidebar-accent)] hover:text-white transition-colors"
                      >
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
          {/* DOC Section */}
          {DocorADMINisAllowed && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-white">
                {t("doc")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {docItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-[var(--sidebar-accent)] hover:text-white transition-colors"
                      >
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
              <SidebarMenuButton
                onClick={logout}
                className="hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)] transition-colors"
              >
                <LogOut />
                <span>{t("menu.logout")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
