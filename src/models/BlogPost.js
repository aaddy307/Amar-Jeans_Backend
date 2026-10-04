import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },       // HTML or markdown
  coverImage: { type: String, default: "" },
  tags: [String],
  published: { type: Boolean, default: false },
  author: { type: String, default: "Amar Jeans Team" }
}, { timestamps: true });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
