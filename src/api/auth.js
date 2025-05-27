const API_URL = `http://${MINIKUBE_IP}:32002`;

export async function register({ username, password }) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Registration failed")
  }
  return res.json()
}

export async function login({ username, password }) {
  const data = new URLSearchParams()
  data.append("username", username)
  data.append("password", password)

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Login failed")
  }
  return res.json()
}