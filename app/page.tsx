'use client';

import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import { PhishingDetector } from "@/components/PhishingDetector";
import { WebScanner } from "@/components/WebScanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function Home() {
  const [marqueeText, setMarqueeText] = useState("");

  useEffect(() => {
    // Cybersecurity tips for scrolling marquee (from Python app)
    const tips = [
      "🔒 Use strong, unique passwords",
      "⚠️ Be cautious with emails asking for personal info",
      "🔄 Keep your software up to date",
      "🚫 Avoid suspicious links and websites",
      "✅ Enable two-factor authentication",
      "🛡️ Verify URLs before entering credentials",
      "📧 Check sender addresses carefully",
    ];
    setMarqueeText("     " + tips.join("  •  ") + "  •  ");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#1c1c3c' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Scrolling Marquee (like Python app) */}
        <div className="marquee-frame mb-8 rounded-lg">
          <div className="overflow-hidden">
            <div className="marquee-text scrolling-text whitespace-nowrap">
              {marqueeText}{marqueeText}{marqueeText}
            </div>
          </div>
        </div>

        {/* Header - Styled like Python app */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/weeli-logo.png" 
              alt="Weeli Secure Logo" 
              width="50" 
              height="50"
              className="object-contain"
            />
            <h1 className="text-5xl font-bold" style={{ color: '#00FFFF', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Weeli Secure
            </h1>
          </div>
          <p className="text-lg" style={{ color: '#a0a0c0', maxWidth: '600px', margin: '0 auto' }}>
            Your comprehensive cybersecurity companion for password security, phishing detection, and web vulnerability scanning
          </p>
        </div>

        {/* Tabs - Modern styling with Python app colors */}
        <Tabs defaultValue="password" className="w-full">
          <TabsList 
            className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 p-1 rounded-full" 
            style={{ background: '#2a2a4a', border: '2px solid #00FFFF' }}
          >
            <TabsTrigger 
              value="password"
              className="rounded-full data-[state=active]:bg-[#0099CC] data-[state=active]:text-white transition-all"
              style={{ color: '#00FFFF' }}
            >
              Password Checker
            </TabsTrigger>
            <TabsTrigger 
              value="phishing"
              className="rounded-full data-[state=active]:bg-[#0099CC] data-[state=active]:text-white transition-all"
              style={{ color: '#00FFFF' }}
            >
              Phishing Detector
            </TabsTrigger>
            <TabsTrigger 
              value="scanner"
              className="rounded-full data-[state=active]:bg-[#0099CC] data-[state=active]:text-white transition-all"
              style={{ color: '#00FFFF' }}
            >
              Web Scanner
            </TabsTrigger>
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
        <footer className="mt-16 text-center text-sm" style={{ color: '#a0a0c0' }}>
          <p>© 2026 Weeli Secure. Built for safer online experiences.</p>
        </footer>
      </div>
    </div>
  );
}

