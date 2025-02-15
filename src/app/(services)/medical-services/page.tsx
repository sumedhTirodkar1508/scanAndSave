"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import logo from "/public/scanneSauverLogo.png";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-doc-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      {/* Navigation Header */}
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
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                Home
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                Services
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                Scanner
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                Contact
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                className="bg-[#59358C]"
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

      {/* Mobile Sidebar */}
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
        <div className="p-6 flex flex-col gap-4">
          <Button variant="default" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button variant="outline" onClick={() => router.push("/signup")}>
            Signup
          </Button>
        </div>
      </div>

      {/* Services Section with Proper Background Handling */}
      <section className="relative">
        {/* Background & Overlay Wrapper */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/services-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-sky-600 opacity-60"></div>
        </div>

        {/* Main Content */}
        <div className="min-h-screen relative z-10 container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            DOCTORS LIST
          </h1>

          {/* Loading Progress Bar */}
          {isLoading ? (
            <div className="flex flex-col items-center">
              <p className="text-white mb-4">Loading doctors...</p>
              <Progress value={60} className="w-1/2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="w-full bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <CardHeader className="flex items-center gap-4 p-6">
                    {/* Doctor Avatar */}
                    <Image
                      src="/assets/doctor-avatar.png"
                      alt="Doctor Avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
