import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1>Customers</h1>
      {error && <div className="error-box">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && customers.length === 0 && <p className="muted">No customers yet — they're created automatically from bookings.</p>}

      {!loading && customers.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Country</th><th></th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.country}</td>
                <td><Link to={`/customers/${c._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
