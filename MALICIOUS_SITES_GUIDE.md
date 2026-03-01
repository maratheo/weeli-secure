# Quick Guide: Modifying Malicious Websites

## File Location
📁 `/config/malicious-sites.json`

## How to Add a New Malicious Site

1. Open the file `/config/malicious-sites.json`
2. Add a new entry to the `sites` array:

```json
{
  "id": "default-XX",
  "url": "suspicious-site.com",
  "addedDate": "2026-02-28T00:00:00.000Z",
  "category": "phishing",
  "notes": "Brief description of the threat",
  "isDefault": true
}
```

3. Save the file
4. Restart the dev server: `npm run dev`

## Categories
- `phishing` - Credential theft, fake login pages
- `malware` - Malicious software distribution
- `scam` - Fraudulent schemes, fake offers
- `spam` - Unwanted content
- `other` - Other threats

## Example: Adding a Fake Banking Site

```json
{
  "id": "default-11",
  "url": "fake-bank-login.com",
  "addedDate": "2026-02-28T00:00:00.000Z",
  "category": "phishing",
  "notes": "Fake banking site stealing credentials",
  "isDefault": true
}
```

## Notes
- Make sure each `id` is unique
- Use lowercase for URLs
- After changes, rebuild/restart the app
- Users can also add sites via the UI (stored in browser localStorage)
