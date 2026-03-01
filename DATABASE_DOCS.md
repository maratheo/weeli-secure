# Malicious Websites Database

## Overview
A simple, localStorage-based database system for storing and managing malicious website URLs in the Weeli Secure Toolkit.

## Features

### 🗄️ Database Structure
Each malicious site entry contains:
- **id**: Unique identifier
- **url**: The malicious website URL
- **addedDate**: ISO timestamp when added
- **category**: Type of threat (phishing, malware, scam, spam, other)
- **notes**: Optional description/notes
- **isDefault**: Boolean flag for default database entries

### 💾 Storage
- Uses browser `localStorage` for persistence
- Data survives page refreshes and browser restarts
- Stored at key: `weeli_malicious_sites_db`
- JSON format for easy export/import

### 📊 Default Database
Initial database includes 5 known malicious sites from the original Python code:
1. `badwebsite.com` - Malware
2. `phishing-login.net` - Phishing
3. `secure-update-account.ru` - Phishing
4. `free-money.xyz` - Scam
5. `paypal-verification-alert.com` - Phishing

## API Reference

### Core Methods

#### `getAllSites(): MaliciousSite[]`
Get all malicious sites in the database.

```typescript
const sites = maliciousDb.getAllSites();
console.log(sites); // Array of MaliciousSite objects
```

#### `getAllUrls(): string[]`
Get just the URLs as a simple string array.

```typescript
const urls = maliciousDb.getAllUrls();
console.log(urls); // ['badwebsite.com', 'phishing-login.net', ...]
```

#### `addSite(url: string, category?: string, notes?: string): MaliciousSite`
Add a new malicious site to the database.

```typescript
const newSite = maliciousDb.addSite(
  'evil-site.com',
  'phishing',
  'Fake banking login page'
);
```

**Throws**: Error if URL already exists in database

#### `removeSite(id: string): boolean`
Remove a site by its ID.

```typescript
const removed = maliciousDb.removeSite('site-123456789-abc');
console.log(removed); // true if removed, false if not found
```

#### `removeSiteByUrl(url: string): boolean`
Remove a site by its URL.

```typescript
const removed = maliciousDb.removeSiteByUrl('badwebsite.com');
```

#### `isMalicious(url: string): { isMalicious: boolean; site?: MaliciousSite }`
Check if a URL matches any entry in the database.

```typescript
const result = maliciousDb.isMalicious('https://phishing-login.net/fake');
if (result.isMalicious) {
  console.log(`Matched: ${result.site.url}`);
  console.log(`Category: ${result.site.category}`);
}
```

#### `updateSite(id: string, updates: Partial<MaliciousSite>): MaliciousSite | null`
Update an existing site's information.

```typescript
const updated = maliciousDb.updateSite('site-123', {
  notes: 'Updated description',
  category: 'malware'
});
```

### Utility Methods

#### `getStats()`
Get database statistics.

```typescript
const stats = maliciousDb.getStats();
console.log(stats);
// {
//   total: 7,
//   byCategory: { phishing: 3, malware: 2, scam: 2 },
//   defaultSites: 5,
//   customSites: 2
// }
```

#### `searchSites(keyword: string): MaliciousSite[]`
Search sites by keyword (searches URL and notes).

```typescript
const results = maliciousDb.searchSites('paypal');
```

#### `exportDb(): string`
Export the entire database as JSON string.

```typescript
const json = maliciousDb.exportDb();
// Download or share the JSON
```

#### `importDb(jsonString: string): boolean`
Import a database from JSON string.

```typescript
const success = maliciousDb.importDb(jsonData);
if (success) {
  console.log('Database imported!');
}
```

#### `clearCustomSites(): void`
Remove all custom sites, keeping only defaults.

```typescript
maliciousDb.clearCustomSites();
```

#### `resetToDefaults(): void`
Reset database to original 5 default sites.

```typescript
maliciousDb.resetToDefaults();
```

## Usage in Components

### Basic Usage

```typescript
import { maliciousDb } from '@/lib/maliciousDb';

// Get all sites
const sites = maliciousDb.getAllSites();

// Add a new site
maliciousDb.addSite('bad-site.com', 'phishing', 'Fake login page');

// Check if URL is malicious
const check = maliciousDb.isMalicious('https://bad-site.com/login');
if (check.isMalicious) {
  alert(`Warning! This site is known for ${check.site.category}`);
}
```

### React Integration

```typescript
import { useState, useEffect } from 'react';
import { maliciousDb, type MaliciousSite } from '@/lib/maliciousDb';

function MyComponent() {
  const [sites, setSites] = useState<MaliciousSite[]>([]);

  useEffect(() => {
    // Load sites on mount
    setSites(maliciousDb.getAllSites());
  }, []);

  const addSite = (url: string) => {
    try {
      maliciousDb.addSite(url, 'phishing');
      setSites(maliciousDb.getAllSites()); // Refresh
    } catch (error) {
      console.error('Failed to add site:', error);
    }
  };

  return (
    <div>
      {sites.map(site => (
        <div key={site.id}>{site.url}</div>
      ))}
    </div>
  );
}
```

## UI Features

### In PhishingDetector Component

1. **Add New Sites**
   - Click "Add Site" button
   - Enter URL, category, and optional notes
   - Saves to database immediately

2. **View All Sites**
   - Scrollable list with all database entries
   - Shows URL, category, notes, and date added
   - Default sites marked with badge

3. **Remove Sites**
   - Click trash icon next to any site
   - Deletes from database immediately

4. **Export/Import**
   - **Export**: Downloads database as JSON file
   - **Import**: Upload previously exported JSON
   - **Reset**: Restore to default 5 sites

5. **Priority Checking**
   - URLs checked against database FIRST
   - Instant "Critical" warning if matched
   - Shows which specific site was matched

## File Structure

```
lib/
  maliciousDb.ts       # Database class and methods
components/
  PhishingDetector.tsx # UI integration
```

## Data Format

### Storage Format
```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-28T12:00:00.000Z",
  "sites": [
    {
      "id": "default-1",
      "url": "badwebsite.com",
      "addedDate": "2026-02-28T12:00:00.000Z",
      "category": "malware",
      "notes": "Known malicious site",
      "isDefault": true
    }
  ]
}
```

## Browser Compatibility

Works in all modern browsers that support:
- `localStorage` API
- ES6+ JavaScript
- JSON parsing

## Limitations

- **Storage**: ~5-10MB localStorage limit (varies by browser)
- **Sync**: No cross-device synchronization
- **Scope**: Database is per-domain (localhost vs. production are separate)
- **Privacy**: Data stored in plain text locally

## Future Enhancements

Potential improvements:
- [ ] Cloud synchronization
- [ ] Encrypted storage
- [ ] Bulk import from CSV
- [ ] Auto-update from threat feeds
- [ ] Export to different formats
- [ ] Undo/Redo functionality
- [ ] Site verification/validation
- [ ] Category icons
- [ ] Search and filtering
- [ ] Sort options

## Security Notes

⚠️ **Important**: This database is for educational purposes and basic protection. For production security needs:
- Use professional threat intelligence feeds
- Implement server-side validation
- Add rate limiting
- Consider cloud-based solutions
- Regular updates from security vendors

---

**Version**: 1.0  
**Last Updated**: February 28, 2026  
**Compatibility**: Next.js 16+, React 19+, TypeScript 5+
