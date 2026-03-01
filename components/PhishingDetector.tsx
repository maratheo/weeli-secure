import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AlertTriangle, CheckCircle, Mail, FileText, Trash2, Shield } from "lucide-react";
import { Badge } from "./ui/badge";

interface PhishingAnalysis {
  text: string;
  isSafe: boolean;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  suspiciousCount: number;
  detectedKeywords: string[];
  flags: {
    category: string;
    severity: "low" | "medium" | "high";
    message: string;
  }[];
  recommendations: string[];
}

export function PhishingDetector() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<PhishingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Comprehensive phishing keywords database
  const PHISHING_KEYWORDS = [
    // Urgency tactics
    "urgent", "immediately", "act now", "limited time", "expires today",
    "within 24 hours", "time sensitive", "expire soon", "hurry",
    
    // Account threats
    "suspended", "locked", "disabled", "compromised", "blocked",
    "account closed", "unusual activity", "suspicious activity",
    "unauthorized access", "security alert",
    
    // Verification requests
    "verify your account", "confirm identity", "confirm your information",
    "update your information", "verify identity", "validate account",
    "authenticate", "reactivate",
    
    // Login/Password requests
    "login immediately", "reset your password", "change password",
    "update password", "password expired", "verify password",
    
    // Financial/Banking
    "bank alert", "payment failed", "billing problem", "refund",
    "tax refund", "payment update", "update payment", "wire transfer",
    "cryptocurrency", "bitcoin", "claim refund",
    
    // Action phrases
    "click here", "click this link", "click below", "download attachment",
    "open attachment", "follow this link", "verify here",
    
    // Rewards/Prizes
    "winner", "congratulations", "you've won", "claim your prize",
    "gift card", "free money", "free gift", "reward",
    
    // Government/Authority impersonation
    "irs", "social security", "government", "legal action",
    "court", "lawsuit",
    
    // Generic suspicious
    "confirm", "verify", "update", "suspended"
  ];

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const textLower = text.toLowerCase();
    const detectedKeywords: string[] = [];
    const flags: PhishingAnalysis["flags"] = [];

    // Check for phishing keywords
    for (const keyword of PHISHING_KEYWORDS) {
      if (textLower.includes(keyword)) {
        if (!detectedKeywords.includes(keyword)) {
          detectedKeywords.push(keyword);
        }
      }
    }

    const suspiciousCount = detectedKeywords.length;
    let isSafe = true;
    let riskLevel: PhishingAnalysis["riskLevel"] = "Low";
    const recommendations: string[] = [];

    // Risk level analysis based on keyword count
    if (suspiciousCount >= 5) {
      isSafe = false;
      riskLevel = "Critical";
      flags.push({
        category: "Critical Phishing Risk",
        severity: "high",
        message: `⚠️ CRITICAL: Detected ${suspiciousCount} phishing indicators - HIGH RISK!`
      });
      recommendations.push("🚨 DO NOT click any links in this message");
      recommendations.push("🚨 DO NOT reply to this message");
      recommendations.push("🚨 DO NOT provide any personal information");
      recommendations.push("Report this as phishing/spam immediately");
      recommendations.push("Delete this message");
    } else if (suspiciousCount >= 3) {
      isSafe = false;
      riskLevel = "High";
      flags.push({
        category: "High Phishing Risk",
        severity: "high",
        message: `⚠️ High Risk: Detected ${suspiciousCount} suspicious phishing indicators`
      });
      recommendations.push("Be extremely cautious with this message");
      recommendations.push("Verify the sender through official channels");
      recommendations.push("Do not click links or download attachments");
      recommendations.push("Contact the organization directly if needed");
    } else if (suspiciousCount === 2) {
      isSafe = false;
      riskLevel = "Medium";
      flags.push({
        category: "Moderate Risk",
        severity: "medium",
        message: `⚠️ Caution: Detected ${suspiciousCount} suspicious keywords`
      });
      recommendations.push("Exercise caution with this message");
      recommendations.push("Verify the sender's identity");
      recommendations.push("Check for spelling or grammar errors");
      recommendations.push("Verify any requests through official channels");
    } else if (suspiciousCount === 1) {
      isSafe = false;
      riskLevel = "Low";
      flags.push({
        category: "Low Risk",
        severity: "low",
        message: "⚠️ 1 suspicious keyword detected - proceed with caution"
      });
      recommendations.push("Verify sender if requesting sensitive information");
      recommendations.push("Check the sender's email address carefully");
    } else {
      isSafe = true;
      riskLevel = "Low";
      flags.push({
        category: "No Obvious Threats",
        severity: "low",
        message: "✅ No obvious phishing indicators detected"
      });
      recommendations.push("Message appears safe based on keyword analysis");
      recommendations.push("Still verify sender if requesting sensitive information");
    }

    // Additional specific pattern checks
    if (textLower.includes("click here") || textLower.includes("click this link")) {
      flags.push({
        category: "Suspicious Link Request",
        severity: "high",
        message: "Contains 'click here' - common phishing tactic"
      });
    }

    if (textLower.includes("urgent") || textLower.includes("immediately") || textLower.includes("act now")) {
      flags.push({
        category: "Urgency Pressure",
        severity: "medium",
        message: "Uses urgency language to pressure quick action"
      });
    }

    if (textLower.includes("verify") || textLower.includes("confirm") || textLower.includes("update")) {
      flags.push({
        category: "Information Request",
        severity: "medium",
        message: "Requests verification/update - common in phishing"
      });
    }

    if (textLower.includes("password") || textLower.includes("login") || textLower.includes("credential")) {
      flags.push({
        category: "Credential Request",
        severity: "high",
        message: "References credentials - verify authenticity carefully"
      });
    }

    if (textLower.includes("suspended") || textLower.includes("locked") || textLower.includes("disabled")) {
      flags.push({
        category: "Account Threat",
        severity: "high",
        message: "Threatens account status - typical phishing scare tactic"
      });
    }

    if (textLower.includes("prize") || textLower.includes("winner") || textLower.includes("congratulations")) {
      flags.push({
        category: "Prize Scam",
        severity: "medium",
        message: "Prize/reward language - common in scam messages"
      });
    }

    setAnalysis({
      text,
      isSafe,
      riskLevel,
      suspiciousCount,
      detectedKeywords,
      flags,
      recommendations
    });

    setIsAnalyzing(false);
  };

  const clearAnalysis = () => {
    setText("");
    setAnalysis(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-100 text-green-800 border-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "High": return "bg-orange-100 text-orange-800 border-orange-300";
      case "Critical": return "bg-red-100 text-red-800 border-red-300";
      default: return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  return (
    <Card className="tool-frame">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#00FFFF', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          <Mail className="w-6 h-6" />
          Phishing Text Analyzer
        </CardTitle>
        <CardDescription style={{ color: '#a0a0c0' }}>
          Scan email or message text for phishing keywords and suspicious patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" style={{ color: '#00FFFF' }}>
              Paste Email or Message Text
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 z-10" style={{ color: '#00FFFF' }} />
              <Textarea
                className="pl-16 resize-y font-mono text-sm"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the email or message content here...

Example:
Subject: URGENT: Your account has been suspended

Dear Customer,

Your account will be permanently locked within 24 hours due to unusual activity.

Click here immediately to verify your account and prevent closure:
[suspicious-link]

Update your password now to restore access.

Thank you,
Security Team"
                rows={12}
                style={{ 
                  background: '#2a2a4a', 
                  border: '2px solid #00FFFF', 
                  color: '#ffffff',
                  minHeight: '250px',
                  paddingLeft: '3rem'
                }}
              />
            </div>
            <p className="text-xs" style={{ color: '#a0a0c0' }}>
              💡 Paste suspicious emails, text messages, or any messages you want to analyze
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={analyzeText} 
              disabled={isAnalyzing || !text.trim()}
              className="modern-button flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Shield className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze Text
                </>
              )}
            </Button>
            {text && (
              <Button 
                onClick={clearAnalysis}
                variant="outline"
                style={{ borderColor: '#00FFFF', color: '#00FFFF' }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Main Result */}
            <div className={`p-4 rounded-lg border-2 ${analysis.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {analysis.isSafe ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${analysis.isSafe ? 'text-green-900' : 'text-red-900'}`}>
                    {analysis.isSafe ? "✅ Text appears safe" : 
                     analysis.riskLevel === "Critical" ? "🚨 CRITICAL: High phishing risk detected!" :
                     analysis.riskLevel === "High" ? "⚠️ WARNING: High phishing risk detected!" : 
                     analysis.riskLevel === "Medium" ? "⚠️ CAUTION: Moderate phishing risk" :
                     "⚠️ Low risk - proceed with caution"}
                  </h3>
                  <p className={`text-sm ${analysis.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                    {analysis.suspiciousCount === 0 ? "No suspicious keywords found" :
                     `Found ${analysis.suspiciousCount} suspicious keyword${analysis.suspiciousCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium" style={{ color: '#00FFFF' }}>Risk Level</span>
                <Badge className={`${getRiskColor(analysis.riskLevel)} text-base px-3 py-1`} variant="outline">
                  {analysis.riskLevel}
                </Badge>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium" style={{ color: '#00FFFF' }}>Suspicious Keywords</span>
                <div className="text-2xl font-bold" style={{ color: analysis.suspiciousCount === 0 ? '#00FF00' : '#FF0000' }}>
                  {analysis.suspiciousCount}
                </div>
              </div>
            </div>

            {/* Detected Keywords */}
            {analysis.detectedKeywords.length > 0 && (
              <div className="space-y-3 p-4 rounded-lg" style={{ background: '#2a2a4a', border: '2px solid #00FFFF' }}>
                <h4 className="font-medium text-sm flex items-center gap-2" style={{ color: '#00FFFF' }}>
                  <AlertTriangle className="w-4 h-4" />
                  Detected Phishing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedKeywords.map((keyword, idx) => (
                    <Badge 
                      key={idx} 
                      variant="destructive" 
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      "{keyword}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Flags */}
            {analysis.flags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm" style={{ color: '#00FFFF' }}>
                  Detailed Analysis ({analysis.flags.length})
                </h4>
                <div className="space-y-2">
                  {analysis.flags.map((flag, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg border-2"
                      style={{ background: '#2a2a4a', borderColor: '#00FFFF' }}
                    >
                      <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        flag.severity === 'high' ? 'text-red-500' :
                        flag.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium" style={{ color: '#00FFFF' }}>
                            {flag.category}
                          </span>
                          <Badge className={getSeverityColor(flag.severity)} variant="secondary">
                            {flag.severity}
                          </Badge>
                        </div>
                        <p className="text-sm" style={{ color: '#ffffff' }}>
                          {flag.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-3 p-4 rounded-lg border-2" style={{ background: '#2a2a4a', borderColor: '#00FFFF' }}>
                <h4 className="font-medium text-sm flex items-center gap-2" style={{ color: '#00FFFF' }}>
                  <Shield className="w-4 h-4" />
                  Security Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" style={{ color: '#ffffff' }}>
                      <span className="text-cyan-400 flex-shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="pt-4 border-t-2" style={{ borderColor: '#00FFFF' }}>
          <div className="space-y-2">
            <h5 className="text-sm font-medium" style={{ color: '#00FFFF' }}>
              🔍 What we look for:
            </h5>
            <ul className="text-xs space-y-1" style={{ color: '#a0a0c0' }}>
              <li>• Urgency tactics (immediate action, time pressure)</li>
              <li>• Account threats (suspended, locked, compromised)</li>
              <li>• Verification requests (confirm identity, update information)</li>
              <li>• Credential requests (password, login, authentication)</li>
              <li>• Financial lures (prizes, refunds, payments)</li>
              <li>• Suspicious action requests (click here, download attachment)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
