"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "/public/scanneSauverLogo.png";
import { EmblaCarousel } from "@/components/EmblaCarousel/EmblaCarousel";
import medServices from "/public/assets/carousel/medServices.jpg";
import medInfo from "/public/assets/carousel/medInfo.jpg";
import spsScanner from "/public/assets/carousel/spsScanner.jpg";
import spsKits from "/public/assets/carousel/spsKits.jpg";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      {/* Navigation Header Bar Section Starts*/}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Scanne Pour Sauver"
                width={100}
                height={100}
              />
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-14">
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Services
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Scanner
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Contact
              </a>
            </div>
            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <Button
                className="bg-[#59358C]"
                variant="default"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button variant="outline" onClick={() => router.push("/signup")}>
                Signup
              </Button>
            </div>
          </nav>
        </div>
      </header>
      {/* Navigation Header Bar Section Ends */}

      {/* Mobile Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        <div className="p-6 flex flex-col gap-6 flex-grow">
          <button
            className="text-2xl self-end"
            onClick={() => setMenuOpen(false)}
          >
            ✖
          </button>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Scanner
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
        {/* Login & Signup Buttons at the Bottom */}
        <div className="p-6 flex flex-col gap-4">
          <Button variant="default" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button variant="outline" onClick={() => router.push("/signup")}>
            Signup
          </Button>
        </div>
      </div>

      {/* Hero Section Starts */}
      <div className="w-full">
        <div>
          <EmblaCarousel />
        </div>

        <div className="inset-0 bg-[#0A013D] text-white text-center py-5">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-white p-4">
            {/* <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Scannez Pour Sauver
            </h1>
            <p className="text-xl mb-6">
              Votre QR Code pour la sécurité immédiate
            </p> */}
            <Button
              variant="destructive"
              size="lg"
              onClick={() => router.push("/generateQR")}
              className="relative bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-8 py-8 rounded-lg animate-pulse shadow-[0_0_20px_#ff0000,0_0_40px_#ff0000] hover:shadow-[0_0_25px_#ff0000,0_0_50px_#ff0000] transition-all duration-900"
            >
              OBTENEZ VOTRE CODE QR MAINTENANT
            </Button>
          </div>
        </div>
      </div>
      {/* Hero Section Ends*/}
      {/* Services Grid */}
      <section className="relative bg-[url('/assets/services-bg.jpg')] bg-center bg-cover">
        {/* Black overlay */}
        <div className="absolute inset-0 bg-sky-600 opacity-60"></div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 justify-items-center">
            {/* SPS QR SCANNE */}
            <Link href="/qr-scanner" className="z-10 w-full md:w-3/4 lg:w-1/2">
              <Card className="p-0 flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 transition border-8 border-[#298CD4] rounded-lg">
                <div className="mb-0">
                  <Image
                    src={spsScanner}
                    alt="SPS QR SCANNE"
                    className="w-full h-full rounded-sm"
                  />
                </div>
                {/* <h3 className="text-sm md:text-xl lg:text-2xl font-semibold">
                  SPS QR SCANNE
                </h3> */}
              </Card>
            </Link>

            {/* Kits SPS */}
            <Link href="#" className="z-10 w-full md:w-3/4 lg:w-1/2">
              <Card className="p-0 flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 transition border-8 border-[#298CD4] rounded-lg">
                <div className="mb-0">
                  <Image
                    src={spsKits}
                    alt="Kits SPS"
                    className="w-full h-full rounded-sm"
                  />
                </div>
                {/* <h3 className="text-sm md:text-xl lg:text-2xl font-semibold">
                  Kits SPS
                </h3> */}
              </Card>
            </Link>

            {/* Service Médicale */}
            <Link href="#" className="z-10 w-full md:w-3/4 lg:w-1/2">
              <Card className="p-0 flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 transition border-8 border-[#298CD4] rounded-lg">
                <div className="mb-0">
                  <Image
                    src={medServices}
                    alt="Service Médicale"
                    className="w-full h-full rounded-sm"
                  />
                </div>
                {/* <h3 className="text-sm md:text-xl lg:text-2xl font-semibold">
                  Service Médicale
                </h3> */}
              </Card>
            </Link>

            {/* Informations médicales */}
            <Link href="#" className="z-10 w-full md:w-3/4 lg:w-1/2">
              <Card className="p-0 flex flex-col items-center text-centercursor-pointer hover:bg-blue-100 transition border-8 border-[#298CD4] rounded-lg">
                <div className="mb-0">
                  <Image
                    src={medInfo}
                    alt="Informations médicales"
                    className="w-full h-full rounded-sm"
                  />
                </div>
                {/* <h3 className="text-sm md:text-xl lg:text-2xl font-semibold">
                  Informations médicales
                </h3> */}
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
