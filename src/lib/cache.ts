const cache = new Map<string, { data: any, timestamp: number }>();
const TTL = 5 * 60 * 1000; // 5 minutes caching

export async function fetchWithCache(url: string) {
  if (cache.has(url)) {
    const cached = cache.get(url)!;
    if (Date.now() - cached.timestamp < TTL) {
      return cached.data;
    }
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API fetch failed for ${url}`);
  const data = await res.json();
  
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
