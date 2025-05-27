const BASE = 'http://192.168.49.2:31001'

export async function triggerScan(params, token, signal) {
  const url = new URL(`${BASE}/scan`, window.location.origin)
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v))
  const res = await fetch(url, {
    signal,
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail || res.statusText)
  }
  return res.json()
}
