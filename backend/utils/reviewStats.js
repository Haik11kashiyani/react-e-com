import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const refreshProductRating = async (productId) => {
  if (!productId) return;

  const [stats] = await Review.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: Number((stats?.averageRating || 0).toFixed(1)),
    reviews: stats?.reviewCount || 0,
  });
};
