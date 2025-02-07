import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@/app/styles/custom-animation.css";
// import "@/app/styles/animate.css";
// import "@/app/styles/icomoon.css";
// import "@/app/styles/fontawesome.css";
// import "@/app/styles/style.css";

export const metadata = {
  title: "ScanneSauver - Home",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bootstrap-scoped">{children}</div>;
}
