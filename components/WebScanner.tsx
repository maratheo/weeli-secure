import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Search, Globe, Lock, Server, Shield, AlertTriangle, 
  CheckCircle, XCircle, Loader2, ChevronDown, ChevronRight 
} from "lucide-react";
import { Progress } from "./ui/progress";

interface ScanResult {
  url: string;
  status: "completed" | "scanning";
  progress: number;
  overallScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  categories: {
    name: string;
    icon: JSX.Element;
    score: number;
    status: "pass" | "warning" | "fail";
    findings: {
      severity: "info" | "warning" | "critical";
      message: string;
    }[];
  }[];
  summary: {
    passed: number;
    warnings: number;
    critical: number;
  };
}

export function WebScanner() {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const scanWebsite = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    // Simulate progressive scanning
    const progressSteps = [20, 40, 60, 80, 100];
    
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setScanResult({
        url,
        status: "scanning",
        progress: progressSteps[i],
        overallScore: 0,
        riskLevel: "Low",
        categories: [],
        summary: { passed: 0, warnings: 0, critical: 0 }
      });
    }

    // Generate scan results
    const categories: ScanResult["categories"] = [
      {
        name: "SSL/TLS Security",
        icon: <Lock className="w-5 h-5" />,
        score: 95,
        status: "pass",
        findings: [
          { severity: "info", message: "Valid SSL certificate detected" },
          { severity: "info", message: "TLS 1.3 supported" },
          { severity: "warning", message: "Certificate expires in 45 days" }
        ]
      },
      {
        name: "HTTP Headers",
        icon: <Server className="w-5 h-5" />,
        score: 75,
        status: "warning",
        findings: [
          { severity: "info", message: "X-Frame-Options header present" },
          { severity: "info", message: "X-Content-Type-Options set to nosniff" },
          { severity: "warning", message: "Content Security Policy not found" },
          { severity: "warning", message: "Strict-Transport-Security missing" }
        ]
      },
      {
        name: "Vulnerability Scan",
        icon: <Shield className="w-5 h-5" />,
        score: 85,
        status: "pass",
        findings: [
          { severity: "info", message: "No known critical vulnerabilities" },
          { severity: "info", message: "SQL injection tests passed" },
          { severity: "warning", message: "Outdated jQuery library detected (v3.3.1)" },
          { severity: "info", message: "XSS protection tests passed" }
        ]
      },
      {
        name: "DNS & Domain",
        icon: <Globe className="w-5 h-5" />,
        score: 90,
        status: "pass",
        findings: [
          { severity: "info", message: "DNSSEC enabled" },
          { severity: "info", message: "Valid SPF record found" },
          { severity: "info", message: "DMARC policy configured" },
          { severity: "warning", message: "CAA records not configured" }
        ]
      },
      {
        name: "Server Configuration",
        icon: <Server className="w-5 h-5" />,
        score: 70,
        status: "warning",
        findings: [
          { severity: "info", message: "Server signature hidden" },
          { severity: "warning", message: "Directory listing enabled on /assets/" },
          { severity: "warning", message: "Backup files accessible (.bak files found)" },
          { severity: "critical", message: "Admin panel publicly accessible at /admin" }
        ]
      }
    ];

    // Calculate summary
    let passed = 0;
    let warnings = 0;
    let critical = 0;

    categories.forEach(cat => {
      cat.findings.forEach(finding => {
        if (finding.severity === "info") passed++;
        else if (finding.severity === "warning") warnings++;
        else critical++;
      });
    });

    const overallScore = Math.round(
      categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
    );

    let riskLevel: ScanResult["riskLevel"];
    if (overallScore >= 85) riskLevel = "Low";
    else if (overallScore >= 70) riskLevel = "Medium";
    else if (overallScore >= 50) riskLevel = "High";
    else riskLevel = "Critical";

    setScanResult({
      url,
      status: "completed",
      progress: 100,
      overallScore,
      riskLevel,
      categories,
      summary: { passed, warnings, critical }
    });

    setIsScanning(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Web Security Scanner</CardTitle>
        <CardDescription>
          Comprehensive security scan for vulnerabilities, SSL, headers, and configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scanUrl">Website URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="scanUrl"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && scanWebsite()}
                  placeholder="https://example.com"
                  className="pl-10"
                  disabled={isScanning}
                />
              </div>
              <Button onClick={scanWebsite} disabled={isScanning || !url.trim()}>
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {scanResult && scanResult.status === "scanning" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Scanning in progress...</span>
              <span className="font-semibold">{scanResult.progress}%</span>
            </div>
            <Progress value={scanResult.progress} className="h-2" />
          </div>
        )}

        {scanResult && scanResult.status === "completed" && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Overall Security Score</h3>
                  <p className="text-sm text-slate-600">{scanResult.url}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-slate-900 mb-1">
                    {scanResult.overallScore}
                  </div>
                  <Badge className={getRiskColor(scanResult.riskLevel)} variant="outline">
                    {scanResult.riskLevel} Risk
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-green-600">{scanResult.summary.passed}</div>
                  <div className="text-xs text-slate-600 mt-1">Passed</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-yellow-600">{scanResult.summary.warnings}</div>
                  <div className="text-xs text-slate-600 mt-1">Warnings</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-red-600">{scanResult.summary.critical}</div>
                  <div className="text-xs text-slate-600 mt-1">Critical</div>
                </div>
              </div>
            </div>

            {/* Category Details */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-slate-700">Detailed Findings</h4>
              {scanResult.categories.map((category, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(idx)}
                    className="w-full p-4 bg-white hover:bg-slate-50 transition-colors flex items-center gap-3"
                  >
                    {expandedCategories.has(idx) ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-slate-600">{category.icon}</div>
                      <span className="font-medium text-left">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{category.score}/100</span>
                      {getStatusIcon(category.status)}
                    </div>
                  </button>
                  
                  {expandedCategories.has(idx) && (
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                      <div className="space-y-2">
                        {category.findings.map((finding, findingIdx) => (
                          <div key={findingIdx} className="flex items-start gap-2 text-sm">
                            <div className={`mt-0.5 ${getSeverityColor(finding.severity)}`}>
                              {finding.severity === "info" && "✓"}
                              {finding.severity === "warning" && "⚠"}
                              {finding.severity === "critical" && "✕"}
                            </div>
                            <span className="text-slate-700">{finding.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
