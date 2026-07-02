import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";

// GET /api/customers  (admin)
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers", error: err.message });
  }
};

// GET /api/customers/:id  (admin - includes their booking history)
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const bookings = await Booking.find({ customer: customer._id })
      .populate("tour", "title slug")
      .sort({ createdAt: -1 });

    res.json({ customer, bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer", error: err.message });
  }
};
