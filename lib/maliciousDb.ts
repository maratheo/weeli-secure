/**
 * Malicious Websites Database
 * Simple localStorage-based database for storing and managing malicious URLs
 */

const DB_KEY = 'weeli_malicious_sites_db';
const DB_VERSION = '1.0';

export interface MaliciousSite {
  id: string;
  url: string;
  addedDate: string;
  addedBy?: string;
  category?: 'phishing' | 'malware' | 'scam' | 'spam' | 'other';
  notes?: string;
  isDefault?: boolean; // Marks sites from the initial database
}

interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  sites: MaliciousSite[];
}

// Initial malicious sites from the original Python code
const INITIAL_MALICIOUS_SITES: MaliciousSite[] = [
  {
    id: 'default-1',
    url: 'badwebsite.com',
    addedDate: new Date().toISOString(),
    category: 'malware',
    notes: 'Known malicious site',
    isDefault: true
  },
  {
    id: 'default-2',
    url: 'phishing-login.net',
    addedDate: new Date().toISOString(),
    category: 'phishing',
    notes: 'Phishing site targeting login credentials',
    isDefault: true
  },
  {
    id: 'default-3',
    url: 'secure-update-account.ru',
    addedDate: new Date().toISOString(),
    category: 'phishing',
    notes: 'Fake account update phishing',
    isDefault: true
  },
  {
    id: 'default-4',
    url: 'free-money.xyz',
    addedDate: new Date().toISOString(),
    category: 'scam',
    notes: 'Financial scam site',
    isDefault: true
  },
  {
    id: 'default-5',
    url: 'paypal-verification-alert.com',
    addedDate: new Date().toISOString(),
    category: 'phishing',
    notes: 'PayPal impersonation phishing',
    isDefault: true
  }
];

class MaliciousDatabase {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Initialize the database with default sites if it doesn't exist
   */
  private initializeDb(): DatabaseSchema {
    const initialDb: DatabaseSchema = {
      version: DB_VERSION,
      lastUpdated: new Date().toISOString(),
      sites: INITIAL_MALICIOUS_SITES
    };

    if (this.isClient) {
      localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    }

    return initialDb;
  }

  /**
   * Get the entire database
   */
  private getDb(): DatabaseSchema {
    if (!this.isClient) {
      return {
        version: DB_VERSION,
        lastUpdated: new Date().toISOString(),
        sites: INITIAL_MALICIOUS_SITES
      };
    }

    const dbString = localStorage.getItem(DB_KEY);
    
    if (!dbString) {
      return this.initializeDb();
    }

    try {
      const db = JSON.parse(dbString) as DatabaseSchema;
      
      // Migrate if version mismatch
      if (db.version !== DB_VERSION) {
        return this.initializeDb();
      }

      return db;
    } catch (error) {
      console.error('Error parsing database, reinitializing:', error);
      return this.initializeDb();
    }
  }

  /**
   * Save the database
   */
  private saveDb(db: DatabaseSchema): void {
    if (!this.isClient) return;

    db.lastUpdated = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  /**
   * Get all malicious sites
   */
  getAllSites(): MaliciousSite[] {
    const db = this.getDb();
    return db.sites;
  }

  /**
   * Get all malicious URLs as simple string array
   */
  getAllUrls(): string[] {
    return this.getAllSites().map(site => site.url);
  }

  /**
   * Add a new malicious site
   */
  addSite(
    url: string,
    category?: MaliciousSite['category'],
    notes?: string
  ): MaliciousSite {
    const db = this.getDb();
    
    // Check if URL already exists
    const existingSite = db.sites.find(
      site => site.url.toLowerCase() === url.toLowerCase()
    );

    if (existingSite) {
      throw new Error(`Site ${url} already exists in database`);
    }

    const newSite: MaliciousSite = {
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: url.toLowerCase().trim(),
      addedDate: new Date().toISOString(),
      category: category || 'other',
      notes: notes || '',
      isDefault: false
    };

    db.sites.push(newSite);
    this.saveDb(db);

    return newSite;
  }

  /**
   * Remove a malicious site by ID
   */
  removeSite(id: string): boolean {
    const db = this.getDb();
    const initialLength = db.sites.length;
    
    db.sites = db.sites.filter(site => site.id !== id);
    
    if (db.sites.length < initialLength) {
      this.saveDb(db);
      return true;
    }

    return false;
  }

  /**
   * Remove a malicious site by URL
   */
  removeSiteByUrl(url: string): boolean {
    const db = this.getDb();
    const initialLength = db.sites.length;
    
    db.sites = db.sites.filter(
      site => site.url.toLowerCase() !== url.toLowerCase()
    );
    
    if (db.sites.length < initialLength) {
      this.saveDb(db);
      return true;
    }

    return false;
  }

  /**
   * Check if a URL is in the malicious database
   */
  isMalicious(url: string): { isMalicious: boolean; site?: MaliciousSite } {
    const db = this.getDb();
    const urlLower = url.toLowerCase();

    for (const site of db.sites) {
      if (urlLower.includes(site.url)) {
        return { isMalicious: true, site };
      }
    }

    return { isMalicious: false };
  }

  /**
   * Update a site's information
   */
  updateSite(
    id: string,
    updates: Partial<Omit<MaliciousSite, 'id' | 'addedDate' | 'isDefault'>>
  ): MaliciousSite | null {
    const db = this.getDb();
    const siteIndex = db.sites.findIndex(site => site.id === id);

    if (siteIndex === -1) {
      return null;
    }

    db.sites[siteIndex] = {
      ...db.sites[siteIndex],
      ...updates
    };

    this.saveDb(db);
    return db.sites[siteIndex];
  }

  /**
   * Get statistics about the database
   */
  getStats(): {
    total: number;
    byCategory: Record<string, number>;
    defaultSites: number;
    customSites: number;
  } {
    const sites = this.getAllSites();
    
    const byCategory: Record<string, number> = {};
    let defaultSites = 0;
    let customSites = 0;

    sites.forEach(site => {
      const category = site.category || 'other';
      byCategory[category] = (byCategory[category] || 0) + 1;
      
      if (site.isDefault) {
        defaultSites++;
      } else {
        customSites++;
      }
    });

    return {
      total: sites.length,
      byCategory,
      defaultSites,
      customSites
    };
  }

  /**
   * Search sites by keyword
   */
  searchSites(keyword: string): MaliciousSite[] {
    const db = this.getDb();
    const keywordLower = keyword.toLowerCase();

    return db.sites.filter(site => 
      site.url.toLowerCase().includes(keywordLower) ||
      (site.notes || '').toLowerCase().includes(keywordLower)
    );
  }

  /**
   * Export database as JSON
   */
  exportDb(): string {
    const db = this.getDb();
    return JSON.stringify(db, null, 2);
  }

  /**
   * Import database from JSON
   */
  importDb(jsonString: string): boolean {
    try {
      const importedDb = JSON.parse(jsonString) as DatabaseSchema;
      
      // Validate structure
      if (!importedDb.sites || !Array.isArray(importedDb.sites)) {
        throw new Error('Invalid database structure');
      }

      this.saveDb(importedDb);
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  /**
   * Clear all custom sites (keep only defaults)
   */
  clearCustomSites(): void {
    const db = this.getDb();
    db.sites = db.sites.filter(site => site.isDefault);
    this.saveDb(db);
  }

  /**
   * Reset database to defaults
   */
  resetToDefaults(): void {
    this.initializeDb();
  }
}

// Export singleton instance
export const maliciousDb = new MaliciousDatabase();
