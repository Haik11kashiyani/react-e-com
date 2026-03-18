import ContactMessage from "../models/ContactMessage.js";

// POST /api/contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = await ContactMessage.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully. We'll get back to you soon!",
      id: contact._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("submitContact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
