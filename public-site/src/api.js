const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  getSettings: () => request("/settings"),
  getTours: () => request("/tours"),
  getTourBySlug: (slug) => request(`/tours/${slug}`),
  submitBooking: (data) => request("/bookings", { method: "POST", body: data }),
};
