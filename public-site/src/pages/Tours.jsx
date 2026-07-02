import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TourCard from "../components/TourCard";
import { api } from "../api";

const CATEGORIES = ["trekking", "cultural", "wildlife", "pilgrimage", "day-tour", "adventure"];

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTours()
      .then(setTours)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tours.filter((t) => {
    const matchesCategory = category ? t.category === category : true;
    const matchesSearch = search
      ? t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="tours-header">
        <h1>Our Tours</h1>
        <div className="tours-filters">
          <input
            className="search-input"
            type="text"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {search && (
        <p className="muted" style={{ marginBottom: 12 }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {error && <p className="error-box">{error}</p>}
      {loading && <p>Loading tours...</p>}
      {!loading && filtered.length === 0 && (
        <p className="muted">No tours found{search ? ` for "${search}"` : ""}.</p>
      )}

      <div className="tour-grid">
        {filtered.map((tour) => <TourCard key={tour._id} tour={tour} />)}
      </div>
    </Layout>
  );
}

