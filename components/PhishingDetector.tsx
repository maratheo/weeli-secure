import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { AlertTriangle, CheckCircle, Shield, Link as LinkIcon, Plus, Trash2, Download, Upload, RefreshCw } from "lucide-react";
import { Badge } from "./ui/badge";
import { maliciousDb, type MaliciousSite } from "@/lib/maliciousDb";

interface PhishingAnalysis {
  url: string;
  isSafe: boolean;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  score: number;
  flags: {
    category: string;
    severity: "low" | "medium" | "high";
    message: string;
  }[];
  recommendations: string[];
}

export function PhishingDetector() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<PhishingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [maliciousSites, setMaliciousSites] = useState<MaliciousSite[]>([]);
  const [newSite, setNewSite] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState<MaliciousSite['category']>('phishing');
  const [newSiteNotes, setNewSiteNotes] = useState("");
  const [showAddSite, setShowAddSite] = useState(false);

  // Load sites from database on component mount
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = () => {
    const sites = maliciousDb.getAllSites();
    setMaliciousSites(sites);
  };

  const addMaliciousSite = () => {
    const siteToAdd = newSite.toLowerCase().trim();
    if (siteToAdd) {
      try {
        maliciousDb.addSite(siteToAdd, newSiteCategory, newSiteNotes);
        loadSites(); // Reload from database
        setNewSite("");
        setNewSiteNotes("");
        setShowAddSite(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to add site');
      }
    }
  };

  const removeMaliciousSite = (id: string) => {
    maliciousDb.removeSite(id);
    loadSites(); // Reload from database
  };

  const exportDatabase = () => {
    const json = maliciousDb.exportDb();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weeli-malicious-sites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDatabase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          if (maliciousDb.importDb(json)) {
            loadSites();
            alert('Database imported successfully!');
          } else {
            alert('Failed to import database. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const resetDatabase = () => {
    if (confirm('Are you sure you want to reset the database to defaults? This will remove all custom sites.')) {
      maliciousDb.resetToDefaults();
      loadSites();
    }
  };

  const analyzeURL = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const flags: PhishingAnalysis["flags"] = [];
    let score = 100;

    // Parse URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      setAnalysis({
        url,
        isSafe: false,
        riskLevel: "High",
        score: 0,
        flags: [{ category: "Invalid URL", severity: "high", message: "The URL format is invalid" }],
        recommendations: ["Ensure the URL is properly formatted"]
      });
      setIsAnalyzing(false);
      return;
    }

    // PYTHON CODE INTEGRATION: Check against known malicious sites database
    const urlLower = url.toLowerCase();
    for (const maliciousSite of maliciousSites) {
      if (urlLower.includes(maliciousSite.url)) {
        setAnalysis({
          url: parsedUrl.href,
          isSafe: false,
          riskLevel: "Critical",
          score: 0,
          flags: [{
            category: "Known Malicious Site",
            severity: "high",
            message: `⚠️ WARNING: This URL matches the known malicious site "${maliciousSite.url}" in our database${maliciousSite.notes ? ` - ${maliciousSite.notes}` : ''}`
          }],
          recommendations: [
            "DO NOT visit this website",
            "DO NOT enter any personal information",
            "Close this page immediately",
            "Report this URL to your IT department or security team",
            "Run a security scan on your device if you've already visited this site"
          ]
        });
        setIsAnalyzing(false);
        return;
      }
    }

    // Check for HTTPS
    if (parsedUrl.protocol !== 'https:') {
      flags.push({
        category: "Security",
        severity: "medium",
        message: "URL does not use HTTPS encryption"
      });
      score -= 15;
    }

    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
    if (suspiciousTLDs.some(tld => parsedUrl.hostname.endsWith(tld))) {
      flags.push({
        category: "Domain",
        severity: "high",
        message: "Domain uses a high-risk top-level domain (TLD)"
      });
      score -= 25;
    }

    // Check for IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsedUrl.hostname)) {
      flags.push({
        category: "Domain",
        severity: "high",
        message: "URL uses IP address instead of domain name"
      });
      score -= 30;
    }

    // Check for excessive subdomains
    const subdomains = parsedUrl.hostname.split('.');
    if (subdomains.length > 4) {
      flags.push({
        category: "Domain",
        severity: "medium",
        message: "URL has suspicious number of subdomains"
      });
      score -= 15;
    }

    // Check for suspicious keywords
    const suspiciousKeywords = ['login', 'verify', 'account', 'secure', 'update', 'confirm', 'banking', 'paypal', 'apple', 'microsoft', 'amazon'];
    const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw));
    if (foundKeywords.length >= 2) {
      flags.push({
        category: "Content",
        severity: "medium",
        message: `URL contains multiple suspicious keywords: ${foundKeywords.join(', ')}`
      });
      score -= 20;
    }

    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd'];
    if (shorteners.some(s => parsedUrl.hostname.includes(s))) {
      flags.push({
        category: "Obfuscation",
        severity: "medium",
        message: "URL uses a link shortening service"
      });
      score -= 15;
    }

    // Check for excessive hyphens
    if ((parsedUrl.hostname.match(/-/g) || []).length > 3) {
      flags.push({
        category: "Domain",
        severity: "low",
        message: "Domain contains excessive hyphens"
      });
      score -= 10;
    }

    // Check for suspicious characters
    if (/@/.test(parsedUrl.href)) {
      flags.push({
        category: "Obfuscation",
        severity: "high",
        message: "URL contains @ symbol (potential credential phishing)"
      });
      score -= 25;
    }

    // Check for domain typosquatting patterns
    const legitDomains = ['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com', 'paypal.com'];
    for (const domain of legitDomains) {
      const baseDomain = domain.split('.')[0];
      if (parsedUrl.hostname.includes(baseDomain) && !parsedUrl.hostname.includes(domain)) {
        flags.push({
          category: "Typosquatting",
          severity: "high",
          message: `Potential typosquatting of ${domain}`
        });
        score -= 30;
        break;
      }
    }

    // Determine risk level
    let riskLevel: PhishingAnalysis["riskLevel"];
    if (score >= 80) riskLevel = "Low";
    else if (score >= 60) riskLevel = "Medium";
    else if (score >= 40) riskLevel = "High";
    else riskLevel = "Critical";

    const recommendations: string[] = [];
    if (score < 80) {
      recommendations.push("Verify the sender's identity before clicking");
      recommendations.push("Check if the domain matches the legitimate organization");
      recommendations.push("Look for spelling errors or unusual domain extensions");
      recommendations.push("Hover over links to preview the actual URL destination");
      recommendations.push("When in doubt, manually type the website address");
    }

    setAnalysis({
      url: parsedUrl.href,
      isSafe: score >= 70,
      riskLevel,
      score: Math.max(0, score),
      flags,
      recommendations
    });

    setIsAnalyzing(false);
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
        <CardTitle style={{ color: '#00FFFF', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          AI URL Phishing Detector
        </CardTitle>
        <CardDescription style={{ color: '#a0a0c0' }}>
          Analyze URLs for potential phishing threats using AI-powered detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" style={{ color: '#00FFFF' }}>URL to Analyze</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#00FFFF' }} />
                <Input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && analyzeURL()}
                  placeholder="https://example.com"
                  className="pl-16"
                  style={{ 
                    background: '#2a2a4a', 
                    border: '2px solid #00FFFF', 
                    color: '#ffffff',
                    paddingLeft: '2.5rem'
                  }}
                />
              </div>
              <Button 
                onClick={analyzeURL} 
                disabled={isAnalyzing || !url.trim()}
                className="modern-button"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border-2 ${analysis.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {analysis.isSafe ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${analysis.isSafe ? 'text-green-900' : 'text-red-900'}`}>
                    {analysis.isSafe ? "URL Appears Safe" : "Potential Phishing Threat Detected"}
                  </h3>
                  <p className={`text-sm ${analysis.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                    {analysis.url}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Risk Level</span>
                <Badge className={getRiskColor(analysis.riskLevel)} variant="outline">
                  {analysis.riskLevel}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Safety Score</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        analysis.score >= 80 ? 'bg-green-600' :
                        analysis.score >= 60 ? 'bg-yellow-500' :
                        analysis.score >= 40 ? 'bg-orange-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold min-w-[3ch]">{analysis.score}</span>
                </div>
              </div>
            </div>

            {analysis.flags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Detected Issues ({analysis.flags.length})
                </h4>
                <div className="space-y-2">
                  {analysis.flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        flag.severity === 'high' ? 'text-red-500' :
                        flag.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{flag.category}</span>
                          <Badge className={getSeverityColor(flag.severity)} variant="secondary">
                            {flag.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{flag.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-sm text-blue-900">
                  Security Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-blue-700 ml-4">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Malicious Sites Database Management */}
        <div className="space-y-3 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Known Malicious Sites Database ({maliciousSites.length})
            </h4>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAddSite(!showAddSite)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Site
            </Button>
          </div>

          {showAddSite && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMaliciousSite()}
                placeholder="badsite.com"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Category</Label>
                  <select
                    value={newSiteCategory}
                    onChange={(e) => setNewSiteCategory(e.target.value as MaliciousSite['category'])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md"
                  >
                    <option value="phishing">Phishing</option>
                    <option value="malware">Malware</option>
                    <option value="scam">Scam</option>
                    <option value="spam">Spam</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Notes (optional)</Label>
                  <Input
                    type="text"
                    value={newSiteNotes}
                    onChange={(e) => setNewSiteNotes(e.target.value)}
                    placeholder="Description..."
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addMaliciousSite} size="sm" className="flex-1">
                  Add to Database
                </Button>
                <Button onClick={() => setShowAddSite(false)} size="sm" variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
            {maliciousSites.map((site) => (
              <div key={site.id} className="flex items-start justify-between gap-2 px-3 py-2 bg-white rounded border border-slate-200 hover:bg-red-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-slate-700 font-semibold">{site.url}</span>
                    {site.category && (
                      <Badge variant="outline" className="text-xs">
                        {site.category}
                      </Badge>
                    )}
                    {site.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  {site.notes && (
                    <p className="text-xs text-slate-500">{site.notes}</p>
                  )}
                  <p className="text-xs text-slate-400">Added: {new Date(site.addedDate).toLocaleDateString()}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeMaliciousSite(site.id)}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 shrink-0"
                  title="Remove from database"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={exportDatabase} size="sm" variant="outline" className="flex-1">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button onClick={importDatabase} size="sm" variant="outline" className="flex-1">
              <Upload className="w-3 h-3 mr-1" />
              Import
            </Button>
            <Button onClick={resetDatabase} size="sm" variant="outline" className="flex-1">
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            ⭐ URLs will be checked against this database first for instant malicious site detection. Database is stored locally in your browser.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
