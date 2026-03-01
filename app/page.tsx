'use client';

import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import { PhishingDetector } from "@/components/PhishingDetector";
import { WebScanner } from "@/components/WebScanner";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Weeli Secure Toolkit
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your comprehensive cybersecurity companion for password security, phishing detection, and web vulnerability scanning
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="password">Password Checker</TabsTrigger>
            <TabsTrigger value="phishing">Phishing Detector</TabsTrigger>
            <TabsTrigger value="scanner">Web Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <PasswordStrengthChecker />
            </div>
          </TabsContent>
          
          <TabsContent value="phishing" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <PhishingDetector />
            </div>
          </TabsContent>
          
          <TabsContent value="scanner" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <WebScanner />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 Weeli Secure Toolkit. Built for safer online experiences.</p>
        </footer>
      </div>
    </div>
  );
}
