const BASE = 'http://192.168.49.2:31003'

export async function triggerSqlInject(body, token, signal) {
  const url = `${BASE}/sqlinject`
  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail || res.statusText)
  }
  return res.json()
}
