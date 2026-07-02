import Company from "../models/Company.js";

// Internal helper - there should only ever be one Company document.
// If none exists yet, create it with defaults the first time it's requested.
const getOrCreateSettings = async () => {
  let settings = await Company.findOne();
  if (!settings) {
    settings = await Company.create({});
  }
  return settings;
};

// GET /api/settings  (public - public site needs name/logo/contact too)
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings", error: err.message });
  }
};

// PUT /api/settings  (admin)
export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: "Failed to update settings", error: err.message });
  }
};
