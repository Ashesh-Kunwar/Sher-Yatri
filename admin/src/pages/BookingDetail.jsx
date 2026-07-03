import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api";

const STATUSES = ["inquiry", "contacted", "confirmed", "completed", "cancelled"];

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const load = () => {
    api.getBooking(id)
      .then((data) => {
        setBooking(data);
        setNotes(data.internalNotes || "");
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, [id]);

  const handleStatusChange = async (status) => {
    setSavingStatus(true);
    try {
      const updated = await api.updateBooking(id, { status });
      setBooking(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleNotesSave = async () => {
    try {
      const updated = await api.updateBooking(id, { internalNotes: notes });
      setBooking(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) return;
    setSavingPayment(true);
    try {
      const updated = await api.recordPayment(id, { amount: Number(paymentAmount), method: paymentMethod });
      setBooking(updated);
      setPaymentAmount("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      const token = localStorage.getItem("sy_token");
      const baseUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${baseUrl}/bookings/${id}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to generate invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (error) return <Layout><div className="error-box">{error}</div></Layout>;
  if (!booking) return <Layout><p>Loading...</p></Layout>;

  const invoiceEligible = booking.status === "completed" && booking.paymentStatus === "paid";

  return (
    <Layout>
      <Link to="/bookings" className="back-link">&larr; Back to Bookings</Link>
      <div className="page-header">
        <h1>Booking Detail</h1>
        {invoiceEligible && (
          <button className="btn-secondary" onClick={handleDownloadInvoice} disabled={downloadingInvoice}>
            {downloadingInvoice ? "Generating..." : "Download Invoice"}
          </button>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Customer</h3>
          <p>{booking.customer?.name}</p>
          <p className="muted-small">{booking.customer?.email}</p>
          <p className="muted-small">{booking.customer?.phone}</p>
          <p className="muted-small">{booking.customer?.country}</p>
        </div>

        <div className="detail-card">
          <h3>Tour</h3>
          <p>{booking.tour?.title}</p>
          <p className="muted-small">{booking.tour?.durationDays} days</p>
          <p>People: {booking.numberOfPeople}</p>
          <p>Total: NPR {booking.totalPrice?.toLocaleString()}</p>
        </div>

        <div className="detail-card">
          <h3>Status</h3>
          <select value={booking.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={savingStatus}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="detail-card">
          <h3>Payment</h3>
          <p>Status: <span className={`badge badge-${booking.paymentStatus}`}>{booking.paymentStatus}</span></p>
          <p>Paid: NPR {booking.amountPaid?.toLocaleString()} / {booking.totalPrice?.toLocaleString()}</p>

          <form onSubmit={handleRecordPayment} className="payment-form">
            <input
              type="number"
              placeholder="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              min="1"
            />
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="btn-primary" disabled={savingPayment}>
              {savingPayment ? "Recording..." : "Record Payment"}
            </button>
          </form>

          {booking.paymentRecords?.length > 0 && (
            <table className="data-table small">
              <thead><tr><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
              <tbody>
                {booking.paymentRecords.map((p, i) => (
                  <tr key={i}>
                    <td>NPR {p.amount?.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="detail-card wide">
          <h3>Internal Notes</h3>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="btn-secondary" onClick={handleNotesSave}>Save Notes</button>
        </div>
      </div>
    </Layout>
  );
}
