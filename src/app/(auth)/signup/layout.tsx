import React, { Suspense } from "react";

export const metadata = {
  title: "Signup",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
