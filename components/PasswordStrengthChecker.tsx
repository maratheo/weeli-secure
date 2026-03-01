import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface PasswordAnalysis {
  score: number;
  strength: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
    commonPassword: boolean;
  };
  suggestions: string[];
}

const commonPasswords = [
  "password", "123456", "12345678", "qwerty", "abc123", "monkey", "letmein",
  "trustno1", "dragon", "baseball", "iloveyou", "master", "sunshine", "ashley",
  "bailey", "passw0rd", "shadow", "123123", "654321", "superman", "admin"
];

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);

  const analyzePassword = (pwd: string) => {
    if (!pwd) {
      setAnalysis(null);
      return;
    }

    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      commonPassword: !commonPasswords.includes(pwd.toLowerCase())
    };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.special) score += 1;
    if (checks.commonPassword) score += 1;

    let strength = "";
    let color = "";
    if (score <= 2) {
      strength = "Very Weak";
      color = "text-red-600";
    } else if (score <= 4) {
      strength = "Weak";
      color = "text-orange-600";
    } else if (score <= 6) {
      strength = "Medium";
      color = "text-yellow-600";
    } else if (score <= 7) {
      strength = "Strong";
      color = "text-green-600";
    } else {
      strength = "Very Strong";
      color = "text-green-700";
    }

    const suggestions: string[] = [];
    if (!checks.length) suggestions.push("Use at least 12 characters");
    if (!checks.uppercase) suggestions.push("Add uppercase letters (A-Z)");
    if (!checks.lowercase) suggestions.push("Add lowercase letters (a-z)");
    if (!checks.numbers) suggestions.push("Add numbers (0-9)");
    if (!checks.special) suggestions.push("Add special characters (!@#$%^&*)");
    if (!checks.commonPassword) suggestions.push("Avoid common passwords");

    setAnalysis({
      score: (score / 8) * 100,
      strength,
      color,
      checks,
      suggestions
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    analyzePassword(newPassword);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Strength Checker</CardTitle>
        <CardDescription>
          Enter a password to analyze its strength and security level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-500" />
              ) : (
                <Eye className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Strength:</span>
                <span className={`text-sm font-semibold ${analysis.color}`}>
                  {analysis.strength}
                </span>
              </div>
              <Progress value={analysis.score} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Security Requirements</h4>
              <div className="space-y-2">
                <CheckItem
                  checked={analysis.checks.length}
                  label="At least 12 characters"
                />
                <CheckItem
                  checked={analysis.checks.uppercase}
                  label="Uppercase letters (A-Z)"
                />
                <CheckItem
                  checked={analysis.checks.lowercase}
                  label="Lowercase letters (a-z)"
                />
                <CheckItem
                  checked={analysis.checks.numbers}
                  label="Numbers (0-9)"
                />
                <CheckItem
                  checked={analysis.checks.special}
                  label="Special characters (!@#$%^&*)"
                />
                <CheckItem
                  checked={analysis.checks.commonPassword}
                  label="Not a common password"
                />
              </div>
            </div>

            {analysis.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Suggestions for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-slate-600 ml-6">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${checked ? "text-slate-700" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}
