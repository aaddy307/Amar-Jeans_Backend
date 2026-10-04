import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  handle: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: null },

  // Flags
  isTrending: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },

  // Classification
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
  fit: { type: String, enum: ['slim', 'regular', 'baggy', 'cargo', 'straight', 'biker', 'other'], default: 'regular' },

  // Variants
  sizes: [{ type: String }],          // e.g. ["28","30","32","34","36","38"]
  colors: [{ type: String }],         // e.g. ["Midnight Blue","Black","Grey"]

  // Images: first is primary, second is hover image on cards
  images: [{ url: String, altText: String }],

  tags: [String],
  brand: { type: String, default: "AMAR JEANS" },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
