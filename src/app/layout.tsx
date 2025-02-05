import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/styles/custom-animation.css";
import "@/app/styles/animate.css";
import "@/app/styles/icomoon.css";
import "@/app/styles/fontawesome.css";
import "@/app/styles/style.css";
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <AuthProvider>
        <body suppressHydrationWarning>
          <NextIntlClientProvider messages={messages} locale={locale}>
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
