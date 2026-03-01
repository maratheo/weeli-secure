# Phishing Detector Component - Documentation

## Overview
A comprehensive text analysis tool that scans emails and messages for phishing-related keywords and suspicious patterns.

## Features

### 🔍 Keyword Detection
Scans for **60+ phishing-related keywords** across multiple categories:

1. **Urgency Tactics**
   - urgent, immediately, act now, limited time, expires today, etc.

2. **Account Threats**
   - suspended, locked, disabled, compromised, blocked, etc.

3. **Verification Requests**
   - verify your account, confirm identity, update information, etc.

4. **Login/Password Requests**
   - login immediately, reset password, password expired, etc.

5. **Financial/Banking**
   - bank alert, payment failed, refund, tax refund, wire transfer, etc.

6. **Action Phrases**
   - click here, click this link, download attachment, etc.

7. **Rewards/Prizes**
   - winner, congratulations, claim your prize, gift card, etc.

8. **Authority Impersonation**
   - IRS, social security, government, legal action, etc.

### 📊 Risk Assessment

**Risk Levels Based on Keyword Count:**
- **0 keywords**: ✅ Safe - No obvious threats
- **1 keyword**: ⚠️ Low Risk - Proceed with caution
- **2 keywords**: ⚠️ Medium Risk - Exercise caution
- **3-4 keywords**: ⚠️ High Risk - Be extremely cautious
- **5+ keywords**: 🚨 Critical Risk - DO NOT interact

### 🎯 Analysis Features

1. **Keyword Highlighting**
   - Shows all detected phishing keywords as red badges
   - Easy to see exactly what triggered the alert

2. **Pattern Detection**
   - Identifies specific phishing tactics:
     - Suspicious link requests
     - Urgency pressure
     - Information requests
     - Credential requests
     - Account threats
     - Prize scams

3. **Detailed Flags**
   - Each pattern gets its own flag with severity level
   - Clear explanation of why it's suspicious

4. **Security Recommendations**
   - Contextual advice based on risk level
   - Actionable steps to stay safe

### 🎨 UI Features

- **Large Text Area**: Easy to paste full emails
- **Real-time Analysis**: Fast keyword scanning
- **Visual Risk Indicators**: Color-coded risk levels
- **Clear Button**: Quick reset for new analysis
- **Responsive Design**: Works on all screen sizes
- **Themed Styling**: Matches Weeli Secure branding

### 📝 How to Use

1. **Paste Text**: Copy and paste suspicious email or message
2. **Click Analyze**: Run the phishing detection scan
3. **Review Results**: Check risk level and detected keywords
4. **Read Recommendations**: Follow security advice
5. **Make Decision**: Determine if message is safe

### 🔐 Security Tips Provided

- Verify sender email addresses
- Don't click suspicious links
- Contact organizations directly through official channels
- Report phishing attempts
- Check for spelling/grammar errors
- Verify requests through official channels

## Example Usage

**Safe Message:**
```
Hi, I wanted to confirm our meeting tomorrow at 2pm.
Looking forward to it!
```
Result: ✅ Safe (0 keywords)

**Suspicious Message:**
```
URGENT: Your account has been suspended.
Click here immediately to verify your account.
Update your password now to restore access.
```
Result: 🚨 Critical Risk (5+ keywords detected)

## Technical Details

- **Component**: React functional component with hooks
- **State Management**: useState for text and analysis
- **Styling**: Tailwind CSS + custom theme colors
- **Icons**: Lucide React icons
- **Animation**: Smooth fade-in for results

## File Location
`/components/PhishingDetector.tsx`

## Dependencies
- React
- Lucide Icons
- Shadcn/ui components (Card, Button, Textarea, Badge, Label)
