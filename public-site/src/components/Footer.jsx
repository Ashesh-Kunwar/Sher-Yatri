import { useSettings } from "../SettingsContext";

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>{settings.name}</strong>
          <p className="muted-small">{settings.tagline}</p>
        </div>
        <div className="footer-contact">
          {settings.contact?.phone && <p>Phone: {settings.contact.phone}</p>}
          {settings.contact?.email && <p>Email: {settings.contact.email}</p>}
          {settings.contact?.whatsapp && <p>WhatsApp: {settings.contact.whatsapp}</p>}
          {settings.contact?.address && <p>{settings.contact.address}</p>}
        </div>
      </div>
      <p className="muted-small footer-bottom">
        &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
      </p>
    </footer>
  );
}
