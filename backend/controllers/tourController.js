import Tour from "../models/Tour.js";

// GET /api/tours  (public - only returns active tours)
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tours", error: err.message });
  }
};

// GET /api/tours/:slug  (public)
export const getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, status: "active" });
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tour", error: err.message });
  }
};

// GET /api/tours/admin/all  (admin - includes drafts/inactive)
export const getAllToursAdmin = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tours", error: err.message });
  }
};

// GET /api/tours/admin/:id  (admin - single tour by id, any status, for editing)
export const getTourByIdAdmin = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tour", error: err.message });
  }
};

// POST /api/tours  (admin)
export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A tour with this slug already exists" });
    }
    res.status(400).json({ message: "Failed to create tour", error: err.message });
  }
};

// PUT /api/tours/:id  (admin)
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (err) {
    res.status(400).json({ message: "Failed to update tour", error: err.message });
  }
};

// DELETE /api/tours/:id  (admin)
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json({ message: "Tour deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tour", error: err.message });
  }
};
