// sspirial.systems data loader
// Fetches data from live API (CF Worker) or static files

const DataLoader = (() => {
  const cache = new Map();
  const LIVE_API_URL = 'http://localhost:8787/api/portal-data'; // In production: your worker URL
  const BASE_PATH = 'data/';

  /**
   * Fetch JSON data
   * @param {string|Object} fileOrOptions - 'data.json' (from API) or 'site-metadata.json' (static), or {file, key}
   * @returns {Promise<any>} Parsed JSON data or subkey
   */
  async function load(fileOrOptions) {
    let filename, key;
    
    if (typeof fileOrOptions === 'string') {
      filename = fileOrOptions;
    } else if (typeof fileOrOptions === 'object' && fileOrOptions.file) {
      filename = fileOrOptions.file;
      key = fileOrOptions.key;
    } else {
      throw new Error('Invalid argument to DataLoader.load');
    }

    // Check cache first
    const cacheKey = filename;
    if (cache.has(cacheKey)) {
      const data = cache.get(cacheKey);
      return key ? data[key] : data;
    }

    try {
      let response;
      
      // data.json comes from live API, everything else from static files
      if (filename === 'data.json') {
        response = await fetch(LIVE_API_URL);
      } else {
        response = await fetch(`${BASE_PATH}${filename}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, data);
      console.log(`✅ Loaded ${filename}`, key ? `(key: ${key})` : '', key ? data[key] : data);
      return key ? data[key] : data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple data sources (compatibility - all from same API)
   * @param {string[]} filenames - Array of filenames (ignored, uses single API)
   * @returns {Promise<Object>} Object with data keys
   */
  async function loadMultiple(filenames) {
    const data = await load('data.json');
    return { data };
  }

  /**
   * Clear cache
   */
  function clearCache() {
    cache.clear();
  }

  /**
   * Preload data
   */
  async function preload() {
    try {
      await load('data.json');
      console.log(`✅ Preloaded data from API`);
    } catch (error) {
      console.warn('⚠️ Failed to preload:', error);
    }
  }

  // Public API
  return {
    load,
    loadMultiple,
    clearCache,
    preload
  };
})();

// Make available globally
window.DataLoader = DataLoader;
