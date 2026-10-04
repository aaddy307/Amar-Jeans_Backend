import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  discountValue: { type: Number, required: true },      // 10 = 10% or ₹10
  minCartValue: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },               // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', couponSchema);
