import { jwtDecode } from "jwt-decode";

function isExpired(token) {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() / 1000 > exp;
}

export async function apiFetch(url, options = {}) {
  let access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  // refresh if expired
  if (isExpired(access) && refresh) {
    const res = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      access = data.access;
      localStorage.setItem("access_token", access);
    } else {
      // refresh token also invalid → logout
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  return response;
}
