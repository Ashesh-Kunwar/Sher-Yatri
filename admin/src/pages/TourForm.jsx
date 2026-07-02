import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

const emptyTour = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  category: "trekking",
  durationDays: 1,
  difficulty: "moderate",
  price: 0,
  currency: "NPR",
  groupSizeMax: 10,
  status: "draft",
  itinerary: [],
  inclusions: [],
  exclusions: [],
  images: [],
};

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function TourForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [tour, setTour] = useState(emptyTour);
  const [inclusionsText, setInclusionsText] = useState("");
  const [exclusionsText, setExclusionsText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    api.getTourByIdAdmin(id)
      .then((data) => {
        setTour(data);
        setInclusionsText((data.inclusions || []).join(", "));
        setExclusionsText((data.exclusions || []).join(", "));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (field, value) => {
    setTour((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setTour((prev) => ({
      ...prev,
      title: value,
      slug: isNew ? slugify(value) : prev.slug, // only auto-slug for new tours
    }));
  };

  const addItineraryDay = () => {
    setTour((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { dayNumber: prev.itinerary.length + 1, title: "", description: "" },
      ],
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    setTour((prev) => {
      const itinerary = [...prev.itinerary];
      itinerary[index] = { ...itinerary[index], [field]: value };
      return { ...prev, itinerary };
    });
  };

  const removeItineraryDay = (index) => {
    setTour((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...tour,
      durationDays: Number(tour.durationDays),
      price: Number(tour.price),
      groupSizeMax: Number(tour.groupSizeMax),
      inclusions: inclusionsText.split(",").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusionsText.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isNew) {
        await api.createTour(payload);
      } else {
        await api.updateTour(id, payload);
      }
      navigate("/tours");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>{isNew ? "New Tour" : "Edit Tour"}</h1>
      {error && <div className="error-box">{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input value={tour.title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Slug (URL-friendly id)</label>
          <input value={tour.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Short Description</label>
          <input value={tour.shortDescription} onChange={(e) => handleChange("shortDescription", e.target.value)} />
        </div>

        <div className="form-row">
          <label>Full Description</label>
          <textarea rows={4} value={tour.longDescription} onChange={(e) => handleChange("longDescription", e.target.value)} />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label>Category</label>
            <select value={tour.category} onChange={(e) => handleChange("category", e.target.value)}>
              <option value="trekking">Trekking</option>
              <option value="cultural">Cultural</option>
              <option value="wildlife">Wildlife</option>
              <option value="pilgrimage">Pilgrimage</option>
              <option value="day-tour">Day Tour</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          <div className="form-row">
            <label>Difficulty</label>
            <select value={tour.difficulty} onChange={(e) => handleChange("difficulty", e.target.value)}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-row">
            <label>Duration (days)</label>
            <input type="number" min="1" value={tour.durationDays} onChange={(e) => handleChange("durationDays", e.target.value)} required />
          </div>

          <div className="form-row">
            <label>Price (NPR)</label>
            <input type="number" min="0" value={tour.price} onChange={(e) => handleChange("price", e.target.value)} required />
          </div>

          <div className="form-row">
            <label>Max Group Size</label>
            <input type="number" min="1" value={tour.groupSizeMax} onChange={(e) => handleChange("groupSizeMax", e.target.value)} />
          </div>

          <div className="form-row">
            <label>Status</label>
            <select value={tour.status} onChange={(e) => handleChange("status", e.target.value)}>
              <option value="draft">Draft (not visible to public)</option>
              <option value="active">Active (visible on website)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>Inclusions (comma-separated)</label>
          <input value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} placeholder="Meals, Accommodation, Guide" />
        </div>

        <div className="form-row">
          <label>Exclusions (comma-separated)</label>
          <input value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} placeholder="Flights, Travel Insurance" />
        </div>

        <div className="form-row">
          <label>Image URL</label>
          <input
            value={tour.images?.[0] || ""}
            onChange={(e) => handleChange("images", e.target.value ? [e.target.value] : [])}
            placeholder="https://images.unsplash.com/photo-..."
          />
          {tour.images?.[0] && (
            <img
              src={tour.images[0]}
              alt="Tour preview"
              style={{ marginTop: 8, width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 4 }}
            />
          )}
        </div>

        <div className="itinerary-section">
          <div className="page-header">
            <label>Itinerary</label>
            <button type="button" className="btn-secondary" onClick={addItineraryDay}>+ Add Day</button>
          </div>
          {tour.itinerary.length === 0 && <p className="muted">No itinerary days added yet.</p>}
          {tour.itinerary.map((day, index) => (
            <div key={index} className="itinerary-day">
              <div className="itinerary-day-header">
                <strong>Day {index + 1}</strong>
                <button type="button" className="link-danger" onClick={() => removeItineraryDay(index)}>Remove</button>
              </div>
              <input
                placeholder="Day title (e.g. Arrival in Kathmandu)"
                value={day.title}
                onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
              />
              <textarea
                rows={2}
                placeholder="Day description"
                value={day.description}
                onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : isNew ? "Create Tour" : "Save Changes"}
        </button>
      </form>
    </Layout>
  );
}
