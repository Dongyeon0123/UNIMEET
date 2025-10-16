export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 10000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const method = (rest.method || 'GET').toUpperCase();
  const url = typeof input === 'string' ? input : (input as URL).toString();
  const startedAt = Date.now();
  console.log(`[HTTP] → ${method} ${url} (timeout ${timeoutMs}ms)`);
  try {
    const res = await fetch(input, { ...rest, signal: controller.signal });
    const elapsed = Date.now() - startedAt;
    console.log(`[HTTP] ← ${method} ${url} ${res.status} (${elapsed}ms)`);
    return res;
  } catch (err: any) {
    const elapsed = Date.now() - startedAt;
    console.error(`[HTTP] ✖ ${method} ${url} failed after ${elapsed}ms: ${err?.name || ''} ${err?.message || err}`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}


