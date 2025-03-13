"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Code } from "lucide-react";

const navLinks = [
  { name: "Upload", href: "/upload", target: "" },
  { name: "Static Analysis", href: "/upload/analysis", target: "" },
  { name: "AIPred", href: "/upload/aipred", target: "" },
  {
    name: "VM",
    href: "https://remotedesktop.google.com/access/session/0780a217-8709-48ee-d00a-8d2c5707f9cd",
    target: "_blank",
  },
  { name: "Capa", href: "/upload/capa", target: "" },
  { name: "Code", href: "/upload/code", target: "" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed text-white top-0 w-full z-50 bg-black/50 border-b border-white/[0.08] backdrop-blur-xl ">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 rotate-45 scale-0 bg-white transition-transform duration-300 group-hover:scale-100" />
            <Code className="h-6 w-6 text-white relative transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-bold text-xl tracking-tight">Malexe</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white bg-black"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-gray-300 transition-colors"
                target={link.target}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-black/50 mt-2 p-4 rounded-md backdrop-blur-xl">
          {navLinks.map((link) => (
            <li key={link.name} className="py-2 border-b border-gray-700">
              <Link
                href={link.href}
                className="block text-white hover:text-gray-300"
                target={link.target}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
