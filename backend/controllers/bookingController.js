import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Tour from "../models/Tour.js";
import Company from "../models/Company.js";
import PDFDocument from 'pdfkit';

// POST /api/bookings  (public - creates an inquiry/booking from the website form)
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, country, tourId, travelDate, numberOfPeople, source } = req.body;

    if (!name || !tourId || !numberOfPeople) {
      return res.status(400).json({ message: "Name, tour and number of people are required" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    // Reuse an existing customer record if email matches, otherwise create a new one.
    let customer = null;
    if (email) {
      customer = await Customer.findOne({ email: email.toLowerCase() });
    }
    if (!customer) {
      customer = await Customer.create({ name, email, phone, country });
    }

    const booking = await Booking.create({
      customer: customer._id,
      tour: tour._id,
      travelDate,
      numberOfPeople,
      totalPrice: tour.price * Number(numberOfPeople),
      source: source || "website",
      status: "inquiry",
    });

    res.status(201).json({ message: "Inquiry submitted successfully", booking });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit booking", error: err.message });
  }
};

// GET /api/bookings  (admin - list all, with optional ?status= filter)
export const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate("customer", "name email phone country")
      .populate("tour", "title slug price durationDays")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// GET /api/bookings/:id  (admin)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer")
      .populate("tour", "title slug price durationDays");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking", error: err.message });
  }
};

// PUT /api/bookings/:id  (admin - update status, notes, travel date, etc.)
export const updateBooking = async (req, res) => {
  try {
    const allowedFields = ["status", "travelDate", "numberOfPeople", "totalPrice", "internalNotes"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: "Failed to update booking", error: err.message });
  }
};

// POST /api/bookings/:id/payments  (admin - record a manual payment)
export const recordPayment = async (req, res) => {
  try {
    const { amount, method, note } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "A valid payment amount is required" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentRecords.push({
      amount,
      method: method || "manual",
      note: note || "",
      recordedBy: req.user?.id,
    });

    booking.amountPaid = booking.paymentRecords.reduce((sum, p) => sum + p.amount, 0);

    if (booking.amountPaid <= 0) {
      booking.paymentStatus = "unpaid";
    } else if (booking.amountPaid >= booking.totalPrice) {
      booking.paymentStatus = "paid";
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: "Failed to record payment", error: err.message });
  }
};

// GET /api/bookings/:id/invoice  (admin - generate PDF invoice, only for completed + fully paid bookings)
export const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer')
      .populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed' || booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        message: 'Invoice can only be generated once the booking is completed and fully paid.',
      });
    }

    const company = await Company.findOne();

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${booking._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text(company?.name || 'Sher Yatri', { align: 'left' });
    if (company?.tagline) {
      doc.fontSize(10).text(company.tagline);
    }
    doc.moveDown();
    doc.fontSize(16).text('INVOICE', { align: 'right' });
    doc.fontSize(10).text(`Invoice #: ${booking._id}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // Customer info
    doc.fontSize(12).text('Billed To:', { underline: true });
    doc.fontSize(10).text(booking.customer?.name || 'N/A');
    doc.text(booking.customer?.email || '');
    doc.text(booking.customer?.phone || '');
    doc.moveDown();

    // Tour info
    doc.fontSize(12).text('Tour Details:', { underline: true });
    doc.fontSize(10).text(`Package: ${booking.tour?.title || 'N/A'}`);
    doc.text(`Duration: ${booking.tour?.durationDays || '-'} days`);
    doc.moveDown();

    // Payment table
    doc.fontSize(12).text('Payment Summary:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total Price: NPR ${booking.totalPrice?.toLocaleString() || 0}`);
    doc.text(`Amount Paid: NPR ${booking.amountPaid?.toLocaleString() || 0}`);
    doc.text(
      `Balance Due: NPR ${((booking.totalPrice || 0) - (booking.amountPaid || 0)).toLocaleString()}`
    );
    doc.text(`Payment Status: ${booking.paymentStatus?.toUpperCase() || 'UNPAID'}`);
    doc.moveDown(2);

    doc.fontSize(9).text('Thank you for booking with us!', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
};
