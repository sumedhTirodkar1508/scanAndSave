import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale(); // Get user's language
  const messages = await getMessages(); // Fetch translations

  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            <div className={inter.className}>
              {children}
              <Toaster />
            </div>
          </NextIntlClientProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
