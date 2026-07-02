import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import Customer from "../models/Customer.js";

// GET /api/dashboard/summary  (admin)
export const getDashboardSummary = async (req, res) => {
  try {
    const [totalTours, activeTours, totalCustomers, bookingsByStatus, paidBookings] =
      await Promise.all([
        Tour.countDocuments(),
        Tour.countDocuments({ status: "active" }),
        Customer.countDocuments(),
        Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Booking.find({ paymentStatus: { $in: ["paid", "partial"] } }, "amountPaid"),
      ]);

    const statusCounts = bookingsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

    res.json({
      totalTours,
      activeTours,
      totalCustomers,
      bookingsByStatus: statusCounts,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard summary", error: err.message });
  }
};
