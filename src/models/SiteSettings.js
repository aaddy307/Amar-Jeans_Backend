import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "AMAR JEANS" },
  supportEmail: { type: String, default: "contact@amarjeans.com" },
  supportPhone: { type: String, default: "+91 9834557990 / +91 8149987987" },
  storeAddress: {
    type: String,
    default: "opp new fire brigade Chinchpada nalambi road amb (w)\nchnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501"
  },
  instagramUrl: { type: String, default: "https://www.instagram.com/amarjeans990/" },
  whatsappNumber: { type: String, default: "919834557990" },

  // Announcement bar messages (auto-rotating marquee)
  announcementMessages: [{
    text: { type: String, required: true },
    link: { type: String, default: "" },
    active: { type: Boolean, default: true }
  }],

  // Hero slides for homepage carousel (managed from admin)
  heroSlides: [{
    headline: { type: String, default: "" },
    subText: { type: String, default: "" },
    ctaText: { type: String, default: "Shop Now" },
    ctaLink: { type: String, default: "/products" },
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true }
  }],

  // Free shipping threshold
  freeShippingThreshold: { type: Number, default: 1500 }
}, { timestamps: true });

siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      announcementMessages: [
        { text: "🏭 FACTORY DIRECT PRICES — No middlemen, maximum value", link: "/products", active: true },
        { text: "🎉 Extra 10% OFF with code AMAR10 — Min cart ₹999", link: "/products", active: true },
        { text: "📦 FREE SHIPPING on orders above ₹1500 | Pan-India Delivery", link: "/products", active: true },
        { text: "👖 BULK ORDERS WELCOME — Custom fit available", link: "/contact", active: true },
        { text: "🏭 SINCE 1995 — 30+ years of premium denim craftsmanship", link: "/", active: true }
      ],
      heroSlides: [
        {
          headline: "AMAR JEANS",
          subText: "Premium Denim — Factory Direct Since 1995",
          ctaText: "Explore Catalog",
          ctaLink: "/products",
          imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=90&w=2400",
          active: true
        },
        {
          headline: "URBAN CARGO",
          subText: "Tactical 6-Pocket Heavy Duty Denim",
          ctaText: "Shop Cargo",
          ctaLink: "/products?cat=cargo-jeans",
          imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=90&w=2400",
          active: true
        },
        {
          headline: "BULK ORDERS",
          subText: "Custom Fit Manufacturing — Wholesale Welcome",
          ctaText: "Get Quote",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=2400",
          active: true
        }
      ]
    });
  }
  return settings;
};

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
