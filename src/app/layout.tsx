import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "ScanneSauver",
    template: "%s | ScanneSauver",
  },
  description: "Accident Rescue QR App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body suppressHydrationWarning>
          <div className={inter.className}>
            {children}
            <Toaster />
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
