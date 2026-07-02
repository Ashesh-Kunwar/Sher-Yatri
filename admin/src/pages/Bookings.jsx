import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

const STATUSES = ["inquiry", "contacted", "confirmed", "completed", "cancelled"];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getBookings(statusFilter)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <Layout>
      <div className="page-header">
        <h1>Bookings</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && bookings.length === 0 && <p className="muted">No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Tour</th>
              <th>People</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customer?.name}<br /><span className="muted-small">{b.customer?.email}</span></td>
                <td>{b.tour?.title}</td>
                <td>{b.numberOfPeople}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td><span className={`badge badge-${b.paymentStatus}`}>{b.paymentStatus}</span></td>
                <td>{b.tour?.price ? "NPR" : ""} {b.totalPrice?.toLocaleString()}</td>
                <td><Link to={`/bookings/${b._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
