# Weeli Secure Toolkit

A comprehensive cybersecurity companion built with Next.js, React, and TypeScript. This toolkit provides three powerful security tools to help protect you online.

## 🛡️ Features

### 1. Password Strength Checker
- Real-time password strength analysis
- Visual strength indicators with color-coded feedback
- Checks for password length, uppercase/lowercase letters, numbers, special characters
- Common password detection
- Actionable suggestions for improvement

### 2. Phishing Detector
- Advanced URL analysis for phishing detection
- AI-powered risk assessment
- Security checks for HTTPS, suspicious TLDs, IP addresses, and more
- Risk level categorization (Low, Medium, High, Critical)
- Detailed recommendations for safe browsing

### 3. Web Scanner
- Comprehensive website security scanning
- Progressive scan visualization
- Checks SSL/TLS, HTTP headers, cookies, privacy, and more
- Overall risk scoring with detailed findings

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Built With

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **shadcn/ui** - Component library

## 📁 Project Structure

```
weeli/
├── app/
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── PasswordStrengthChecker.tsx
│   ├── PhishingDetector.tsx
│   ├── WebScanner.tsx
│   └── ui/                # UI components
├── lib/
│   └── utils.ts
└── styles/
    └── theme.css
```

## 🎯 Usage

1. **Password Checker**: Enter a password to see real-time strength analysis
2. **Phishing Detector**: Analyze URLs for phishing indicators
3. **Web Scanner**: Scan websites for security vulnerabilities

## 🔒 Security Note

This toolkit is designed for educational purposes and basic security awareness. For production security needs, consult cybersecurity professionals.

---

**Made with 💙 for safer online experiences**
