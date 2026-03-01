# Malicious Sites Configuration

This directory contains configuration files for the Weeli Secure application.

## malicious-sites.json

This file contains the default list of known malicious websites used by the Phishing Detector.

### File Structure

```json
{
  "version": "1.0",
  "lastUpdated": "ISO 8601 timestamp",
  "sites": [
    {
      "id": "unique-identifier",
      "url": "malicious-domain.com",
      "addedDate": "ISO 8601 timestamp",
      "category": "phishing|malware|scam|spam|other",
      "notes": "Description of the threat",
      "isDefault": true
    }
  ]
}
```

### How to Add New Malicious Sites

1. **Edit the config file directly**:
   - Open `/config/malicious-sites.json`
   - Add a new site object to the `sites` array
   - Make sure to use a unique `id` (e.g., `"default-11"`, `"default-12"`, etc.)
   - Set `"isDefault": true` for config-based sites

2. **Example of adding a new site**:
   ```json
   {
     "id": "default-11",
     "url": "fake-login-page.com",
     "addedDate": "2026-02-28T00:00:00.000Z",
     "category": "phishing",
     "notes": "Fake login credential harvesting site",
     "isDefault": true
   }
   ```

3. **Available Categories**:
   - `phishing` - Sites designed to steal credentials or personal information
   - `malware` - Sites that distribute malicious software
   - `scam` - Fraudulent sites (fake giveaways, refunds, etc.)
   - `spam` - Spam or unwanted content sites
   - `other` - Other malicious activities

### How It Works

- **Default Sites**: Sites defined in this config file are loaded automatically when the app initializes
- **Runtime Additions**: Users can also add sites through the UI, which are stored in browser localStorage
- **Persistence**: Config file sites + user-added sites = complete malicious site database
- **Reset Function**: The "Reset Database" button in the UI will reload sites from this config file

### Important Notes

- After modifying this file, restart the development server for changes to take effect
- The config file is loaded at build time, so production deployments will need to be rebuilt
- User-added sites (via UI) are stored separately in localStorage and persist across sessions
- You can export the entire database (config + user additions) using the "Export Database" button in the app

### Security Best Practices

- Keep this file updated with known malicious sites
- Regularly review and update the `lastUpdated` timestamp
- Document the source of malicious sites in the `notes` field
- Consider using automated threat intelligence feeds to update this list

### File Location

```
/config/malicious-sites.json
```

Used by: `/lib/maliciousDb.ts`
