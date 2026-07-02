import Layout from "../components/Layout";
import { useSettings } from "../SettingsContext";

export default function Contact() {
  const settings = useSettings();
  const c = settings.contact || {};

  return (
    <Layout>
      <h1>Contact Us</h1>
      <p className="muted">Reach out and we'll get back to you.</p>

      <div className="detail-card">
        {c.phone && <p>Phone: {c.phone}</p>}
        {c.email && <p>Email: {c.email}</p>}
        {c.whatsapp && <p>WhatsApp: {c.whatsapp}</p>}
        {c.address && <p>Address: {c.address}</p>}
        {!c.phone && !c.email && !c.whatsapp && !c.address && (
          <p className="muted">Contact details coming soon — set these in the admin panel under Settings.</p>
        )}
      </div>
    </Layout>
  );
}
