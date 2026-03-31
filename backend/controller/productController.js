import Product from "../models/Product.js";

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return trimmed
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const normalizeProductPayload = (req) => {
  const body = { ...req.body };
  body.price = Number(body.price);
  if (body.originalPrice !== undefined && body.originalPrice !== "") {
    body.originalPrice = Number(body.originalPrice);
  } else {
    delete body.originalPrice;
  }

  if (typeof body.inStock === "string") {
    body.inStock = body.inStock === "true";
  }

  body.features = parseArrayField(body.features);
  body.colors = parseArrayField(body.colors);
  body.images = parseArrayField(body.images);

  if (req.file) {
    const relativePath = req.file.path.replace(/\\/g, "/");
    body.image = `${req.protocol}://${req.get("host")}/${relativePath}`;
  }

  return body;
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search, sort, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price-asc") sortObj = { price: 1 };
    else if (sort === "price-desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };
    else if (sort === "name") sortObj = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/:id/related
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);

    res.json({ success: true, products: related });
  } catch (error) {
    console.error("getRelatedProducts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, categories });
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/products (admin)
export const createProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req);
    const product = await Product.create(payload);
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    console.error("createProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
