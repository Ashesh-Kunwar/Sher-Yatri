import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCustomer(id).then(setData).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <Layout><div className="error-box">{error}</div></Layout>;
  if (!data) return <Layout><p>Loading...</p></Layout>;

  const { customer, bookings } = data;

  return (
    <Layout>
      <Link to="/customers" className="back-link">&larr; Back to Customers</Link>
      <h1>{customer.name}</h1>

      <div className="detail-card">
        <p>Email: {customer.email || "—"}</p>
        <p>Phone: {customer.phone || "—"}</p>
        <p>Country: {customer.country || "—"}</p>
      </div>

      <h3>Booking History</h3>
      {bookings.length === 0 && <p className="muted">No bookings yet.</p>}
      {bookings.length > 0 && (
        <table className="data-table">
          <thead><tr><th>Tour</th><th>Status</th><th>Payment</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.tour?.title}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td><span className={`badge badge-${b.paymentStatus}`}>{b.paymentStatus}</span></td>
                <td>NPR {b.totalPrice?.toLocaleString()}</td>
                <td><Link to={`/bookings/${b._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
