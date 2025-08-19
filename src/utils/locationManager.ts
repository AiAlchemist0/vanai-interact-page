interface GeographicData {
  region: string;
  city: string;
  country: string;
}

interface LocationCache {
  data: GeographicData;
  timestamp: number;
}

class LocationManager {
  private static instance: LocationManager;
  private cache: LocationCache | null = null;
  private pendingRequest: Promise<GeographicData> | null = null;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REQUEST_TIMEOUT = 5000; // 5 seconds
  private requestCount = 0;

  private constructor() {}

  static getInstance(): LocationManager {
    if (!LocationManager.instance) {
      LocationManager.instance = new LocationManager();
    }
    return LocationManager.instance;
  }

  async getLocation(): Promise<GeographicData> {
    // Return cached data if valid
    if (this.cache && this.isCacheValid()) {
      console.log('LocationManager: Using cached location data');
      return this.cache.data;
    }

    // If there's already a pending request, return it (deduplication)
    if (this.pendingRequest) {
      console.log('LocationManager: Joining existing location request');
      return this.pendingRequest;
    }

    // Create new request
    console.log('LocationManager: Starting new location detection');
    this.pendingRequest = this.detectLocationInternal();

    try {
      const result = await this.pendingRequest;
      this.cache = {
        data: result,
        timestamp: Date.now()
      };
      this.saveToLocalStorage(result);
      return result;
    } finally {
      this.pendingRequest = null;
    }
  }

  private async detectLocationInternal(): Promise<GeographicData> {
    this.requestCount++;
    console.log(`LocationManager: Detection attempt #${this.requestCount}`);

    // Try localStorage first
    const stored = this.getFromLocalStorage();
    if (stored && this.isStoredDataValid(stored.timestamp)) {
      console.log('LocationManager: Using stored location data');
      return stored.data;
    }

    // Try IP geolocation with better error handling
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BC-AI-App/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('LocationManager: Rate limited, using fallback');
        } else {
          console.warn(`LocationManager: API error ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.warn('LocationManager: API returned error:', data.reason);
        throw new Error(data.reason || 'API Error');
      }

      if (data.region && data.city) {
        const locationData = {
          region: data.region_code || data.region || 'BC',
          city: data.city || 'Vancouver',
          country: data.country_name || 'Canada'
        };
        console.log('LocationManager: Successfully detected location:', locationData);
        return locationData;
      }

      throw new Error('Invalid response data');

    } catch (error) {
      console.warn('LocationManager: IP detection failed:', error);
      
      // Use stored data as fallback if available
      if (stored) {
        console.log('LocationManager: Using expired stored data as fallback');
        return stored.data;
      }

      // Final fallback to BC, Canada
      const defaultLocation = {
        region: 'BC',
        city: 'Vancouver',
        country: 'Canada'
      };
      console.log('LocationManager: Using default location fallback');
      return defaultLocation;
    }
  }

  private isCacheValid(): boolean {
    if (!this.cache) return false;
    return Date.now() - this.cache.timestamp < this.CACHE_DURATION;
  }

  private isStoredDataValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getFromLocalStorage(): LocationCache | null {
    try {
      const stored = localStorage.getItem('user_location');
      const timestamp = localStorage.getItem('location_timestamp');
      
      if (stored && timestamp) {
        return {
          data: JSON.parse(stored),
          timestamp: parseInt(timestamp)
        };
      }
    } catch (error) {
      console.warn('LocationManager: Error reading from localStorage:', error);
    }
    return null;
  }

  private saveToLocalStorage(data: GeographicData): void {
    try {
      localStorage.setItem('user_location', JSON.stringify(data));
      localStorage.setItem('location_timestamp', Date.now().toString());
    } catch (error) {
      console.warn('LocationManager: Error saving to localStorage:', error);
    }
  }

  // For debugging
  getStats() {
    return {
      requestCount: this.requestCount,
      hasPendingRequest: !!this.pendingRequest,
      cacheValid: this.isCacheValid(),
      cacheTimestamp: this.cache?.timestamp
    };
  }
}

export const locationManager = LocationManager.getInstance();
export type { GeographicData };