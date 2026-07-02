import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useSettings } from "../SettingsContext";

export default function ThankYou() {
  const settings = useSettings();

  return (
    <Layout>
      <div className="thankyou-box">
        <div className="thankyou-icon">✓</div>
        <h1>Thank You!</h1>
        <p>Your inquiry has been submitted successfully.</p>
        <p className="muted">
          Our team at {settings.name} will get back to you within 24 hours.
          {settings.contact?.phone && ` You can also reach us directly at ${settings.contact.phone}.`}
        </p>
        <div className="thankyou-actions">
          <Link to="/tours" className="btn-primary">Browse More Tours</Link>
          <Link to="/" className="btn-secondary" style={{ marginLeft: 12 }}>Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
}
