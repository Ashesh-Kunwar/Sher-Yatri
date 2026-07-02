const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("sy_token");

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  // auth
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  registerFirstAdmin: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password }, auth: false }),

  // tours
  getToursAdmin: () => request("/tours/admin/all"),
  getTourByIdAdmin: (id) => request(`/tours/admin/${id}`),
  getTour: (slug) => request(`/tours/${slug}`, { auth: false }),
  createTour: (data) => request("/tours", { method: "POST", body: data }),
  updateTour: (id, data) => request(`/tours/${id}`, { method: "PUT", body: data }),
  deleteTour: (id) => request(`/tours/${id}`, { method: "DELETE" }),

  // bookings
  getBookings: (status) => request(`/bookings${status ? `?status=${status}` : ""}`),
  getBooking: (id) => request(`/bookings/${id}`),
  updateBooking: (id, data) => request(`/bookings/${id}`, { method: "PUT", body: data }),
  recordPayment: (id, data) => request(`/bookings/${id}/payments`, { method: "POST", body: data }),

  // customers
  getCustomers: () => request("/customers"),
  getCustomer: (id) => request(`/customers/${id}`),

  // settings
  getSettings: () => request("/settings", { auth: false }),
  updateSettings: (data) => request("/settings", { method: "PUT", body: data }),

  // dashboard
  getDashboardSummary: () => request("/dashboard/summary"),
};
