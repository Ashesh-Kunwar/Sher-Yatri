import Layout from "../components/Layout";
import { useSettings } from "../SettingsContext";

export default function About() {
  const settings = useSettings();

  return (
    <Layout>
      <h1>About {settings.name}</h1>
      <p>{settings.description}</p>
      <p className="muted">{settings.tagline}</p>

      {(settings.registration?.ntbNumber || settings.registration?.nattaNumber) && (
        <section className="section">
          <h2>Registration</h2>
          {settings.registration?.ntbNumber && <p>NTB Number: {settings.registration.ntbNumber}</p>}
          {settings.registration?.nattaNumber && <p>NATTA Number: {settings.registration.nattaNumber}</p>}
        </section>
      )}
    </Layout>
  );
}
