import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import TourCard from "../components/TourCard";
import { useSettings } from "../SettingsContext";
import { api } from "../api";

export default function Home() {
  const settings = useSettings();
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getTours().then((data) => setTours(data.slice(0, 3))).catch((err) => setError(err.message));
  }, []);

  return (
    <Layout>
      <section className="hero">
        <h1>{settings.tagline}</h1>
        <p>{settings.description}</p>
        <Link to="/tours" className="btn-primary">Explore Tours</Link>
      </section>

      <section className="section">
        <h2>Featured Tours</h2>
        {error && <p className="error-box">{error}</p>}
        {!error && tours.length === 0 && (
          <p className="muted">No tours published yet — check back soon.</p>
        )}
        <div className="tour-grid">
          {tours.map((tour) => <TourCard key={tour._id} tour={tour} />)}
        </div>
        {tours.length > 0 && (
          <div className="section-cta">
            <Link to="/tours">View all tours &rarr;</Link>
          </div>
        )}
      </section>
    </Layout>
  );
}
