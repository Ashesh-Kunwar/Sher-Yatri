import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getToursAdmin()
      .then(setTours)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.deleteTour(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Tours</h1>
        <Link to="/tours/new" className="btn-primary">+ New Tour</Link>
      </div>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Loading...</p>}

      {!loading && tours.length === 0 && <p className="muted">No tours yet. Create your first one.</p>}

      {!loading && tours.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td>{tour.title}</td>
                <td>{tour.category}</td>
                <td>{tour.durationDays} days</td>
                <td>{tour.currency} {tour.price?.toLocaleString()}</td>
                <td><span className={`badge badge-${tour.status}`}>{tour.status}</span></td>
                <td className="actions">
                  <Link to={`/tours/${tour._id}`}>Edit</Link>
                  <button className="link-danger" onClick={() => handleDelete(tour._id, tour.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
