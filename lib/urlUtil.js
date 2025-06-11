// lib/urlUtils.js (or similar)

export function extractDomain(url) {
    if (!url || typeof url !== 'string') return null;
  
    let fullUrl = url.trim(); // Trim whitespace
  
    // Prepend https:// if no protocol exists
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }
  
    try {
      const parsedUrl = new URL(fullUrl);
      // Basic domain extraction, remove leading www.
      // Using hostname is generally safer than host
      let hostname = parsedUrl.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      return hostname;
    } catch (e) {
      console.error(`Primary URL parse failed for: ${fullUrl}`, e);
      // Fallback attempt using regex for cases like "domain.com/path" or just "domain.com"
      // This regex is a bit more flexible
      const domainMatch = fullUrl.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n#]+)/i);
      return domainMatch ? domainMatch[1] : null;
    }
  }