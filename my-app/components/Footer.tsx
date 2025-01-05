"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex space-x-6">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </a>
          </div>
          <div className="mt-6 md:mt-0">
            <Button
              variant="outline"
              onClick={() => console.log("Contact Us clicked!")}
            >
              Contact Us
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-gray-500"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-400 hover:text-gray-500"
            >
              Terms of Service
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} MusicMVP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
