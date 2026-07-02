import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch((err) => setError(err.message));
  }, []);

  const handleChange = (path, value) => {
    setSettings((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      if (keys.length === 1) {
        updated[keys[0]] = value;
      } else {
        updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <Layout><div className="error-box">{error}</div></Layout>;
  if (!settings) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Company Settings</h1>
      {saved && <div className="success-box">Settings saved.</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Company Name</label>
          <input value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div className="form-row">
          <label>Tagline</label>
          <input value={settings.tagline} onChange={(e) => handleChange("tagline", e.target.value)} />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea rows={2} value={settings.description} onChange={(e) => handleChange("description", e.target.value)} />
        </div>
        <div className="form-row">
          <label>Logo URL</label>
          <input value={settings.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} placeholder="/logo.png or a hosted image URL" />
        </div>

        <h3>Contact</h3>
        <div className="form-grid">
          <div className="form-row">
            <label>Phone</label>
            <input value={settings.contact?.phone || ""} onChange={(e) => handleChange("contact.phone", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input value={settings.contact?.email || ""} onChange={(e) => handleChange("contact.email", e.target.value)} />
          </div>
          <div className="form-row">
            <label>WhatsApp</label>
            <input value={settings.contact?.whatsapp || ""} onChange={(e) => handleChange("contact.whatsapp", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Address</label>
            <input value={settings.contact?.address || ""} onChange={(e) => handleChange("contact.address", e.target.value)} />
          </div>
        </div>

        <h3>Registration</h3>
        <div className="form-grid">
          <div className="form-row">
            <label>NTB Number</label>
            <input value={settings.registration?.ntbNumber || ""} onChange={(e) => handleChange("registration.ntbNumber", e.target.value)} />
          </div>
          <div className="form-row">
            <label>NATTA Number</label>
            <input value={settings.registration?.nattaNumber || ""} onChange={(e) => handleChange("registration.nattaNumber", e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </Layout>
  );
}
