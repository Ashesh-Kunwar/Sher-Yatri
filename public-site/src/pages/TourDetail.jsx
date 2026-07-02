import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", travelDate: "", numberOfPeople: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getTourBySlug(slug).then(setTour).catch((err) => setError(err.message));
  }, [slug]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await api.submitBooking({ ...form, tourId: tour._id });
      navigate("/thank-you");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <Layout>
        <p className="error-box">{error}</p>
        <Link to="/tours">&larr; Back to Tours</Link>
      </Layout>
    );
  }

  if (!tour) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <Link to="/tours" className="back-link">&larr; Back to Tours</Link>

      <div className="tour-detail-grid">
        <div>
          <h1>{tour.title}</h1>
          <p className="tour-detail-meta">
            {tour.durationDays} days &middot; <span className="capitalize">{tour.difficulty}</span> &middot; Up to {tour.groupSizeMax} people
          </p>
          <p>{tour.longDescription || tour.shortDescription}</p>

          {tour.itinerary?.length > 0 && (
            <section className="section">
              <h2>Itinerary</h2>
              {tour.itinerary.map((day, i) => (
                <div key={i} className="itinerary-item">
                  <strong>Day {day.dayNumber}: {day.title}</strong>
                  {day.description && <p className="muted-small">{day.description}</p>}
                </div>
              ))}
            </section>
          )}

          {(tour.inclusions?.length > 0 || tour.exclusions?.length > 0) && (
            <section className="section inclusions-grid">
              {tour.inclusions?.length > 0 && (
                <div>
                  <h3>Included</h3>
                  <ul>{tour.inclusions.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )}
              {tour.exclusions?.length > 0 && (
                <div>
                  <h3>Not Included</h3>
                  <ul>{tour.exclusions.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="booking-box">
          <div className="booking-price">{tour.currency} {tour.price?.toLocaleString()} <span className="muted-small">/ person</span></div>

          {submitted ? (
            <div className="success-box">
              Thank you! Your inquiry has been submitted. We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />

              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />

              <label>Phone</label>
              <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />

              <label>Country</label>
              <input value={form.country} onChange={(e) => handleChange("country", e.target.value)} />

              <label>Preferred Travel Date</label>
              <input type="date" value={form.travelDate} onChange={(e) => handleChange("travelDate", e.target.value)} />

              <label>Number of People</label>
              <input type="number" min="1" value={form.numberOfPeople} onChange={(e) => handleChange("numberOfPeople", e.target.value)} required />

              {submitError && <p className="error-box">{submitError}</p>}

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </aside>
      </div>
    </Layout>
  );
}
