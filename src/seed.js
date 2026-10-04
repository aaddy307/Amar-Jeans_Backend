import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { Review } from "./models/Review.js";
import { SiteSettings } from "./models/SiteSettings.js";
import { BlogPost } from "./models/BlogPost.js";
import { Coupon } from "./models/Coupon.js";

const DENIM_IMAGES = {
  slim: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop",
  ],
  regular: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop",
  ],
  cargo: [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&auto=format&fit=crop",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&auto=format&fit=crop",
  ],
  baggy: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&auto=format&fit=crop",
  ],
};

export async function seedInitialData() {
  try {
    await SiteSettings.getSettings(); // ensure defaults created

    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      console.log("[Seed] Data already exists, skipping seed.");
      return;
    }

    console.log("[Seed] Populating initial categories...");
    const categories = await Category.insertMany([
      { name: "Slim Fit Jeans", slug: "slim-fit-jeans", image: DENIM_IMAGES.slim[0] },
      { name: "Regular Fit Jeans", slug: "regular-fit-jeans", image: DENIM_IMAGES.regular[0] },
      { name: "Cargo & Tactical Denim", slug: "cargo-jeans", image: DENIM_IMAGES.cargo[0] },
      { name: "Denim Jackets & Shirts", slug: "denim-jackets", image: DENIM_IMAGES.jacket[0] },
      { name: "Baggy & Wide Leg", slug: "baggy-jeans", image: DENIM_IMAGES.baggy[0] },
    ]);

    const catSlim    = categories.find(c => c.slug === "slim-fit-jeans");
    const catReg     = categories.find(c => c.slug === "regular-fit-jeans");
    const catCargo   = categories.find(c => c.slug === "cargo-jeans");
    const catJacket  = categories.find(c => c.slug === "denim-jackets");
    const catBaggy   = categories.find(c => c.slug === "baggy-jeans");

    const SIZES = ["28", "30", "32", "34", "36", "38"];

    console.log("[Seed] Populating 20 products...");
    const productsData = [
      // ── SLIM FIT ──────────────────────────────────────────
      {
        title: "Amar Premium Midnight Blue Slim Fit Stretch Jeans",
        handle: "amar-midnight-blue-slim-fit",
        description: "Engineered for maximum comfort and crisp tailored style. Made from 98% organic cotton denim with 2% elastane for seamless flex.",
        price: 1999, compareAtPrice: 2799,
        isTrending: true, isNew: false, isBestseller: true,
        gender: "men", fit: "slim", sizes: SIZES, colors: ["Midnight Blue", "Black"],
        category: catSlim._id,
        images: [
          { url: DENIM_IMAGES.slim[0], altText: "Midnight Blue Slim Fit Front" },
          { url: DENIM_IMAGES.slim[1], altText: "Midnight Blue Slim Fit Back" }
        ],
        tags: ["slim", "stretch", "bestseller", "indigo"],
        averageRating: 4.9, totalReviews: 24
      },
      {
        title: "Amar Onyx Jet Black Biker Slim Jeans",
        handle: "amar-onyx-black-biker-jeans",
        description: "Sleek jet-black stretch denim with articulated knee detail and tapered leg. Deep black reactive dye that does not fade.",
        price: 2199, compareAtPrice: 2999,
        isTrending: true, isNew: false, isBestseller: true,
        gender: "men", fit: "slim", sizes: SIZES, colors: ["Jet Black"],
        category: catSlim._id,
        images: [
          { url: DENIM_IMAGES.slim[1], altText: "Onyx Black Biker Jeans" },
          { url: DENIM_IMAGES.slim[0], altText: "Onyx Black Slim Detail" }
        ],
        tags: ["black", "biker", "tapered", "slim"],
        averageRating: 4.7, totalReviews: 18
      },
      {
        title: "Amar Ice Blue Light Wash Slim Fit",
        handle: "amar-ice-blue-light-wash-slim",
        description: "Crisp light wash indigo with subtle fade treatment. Perfect everyday slim fit for casual and smart-casual occasions.",
        price: 1699, compareAtPrice: 2299,
        isTrending: false, isNew: true, isBestseller: false,
        gender: "men", fit: "slim", sizes: SIZES, colors: ["Ice Blue"],
        category: catSlim._id,
        images: [
          { url: DENIM_IMAGES.slim[2], altText: "Ice Blue Light Wash Slim" },
          { url: DENIM_IMAGES.slim[3], altText: "Light Wash Detail" }
        ],
        tags: ["light-wash", "slim", "new"],
        averageRating: 4.5, totalReviews: 8
      },
      {
        title: "Amar Charcoal Grey Slim Fit Stretch",
        handle: "amar-charcoal-grey-slim-fit",
        description: "Urban charcoal grey stretch denim. Versatile all-season slim fit with premium stitching and 4-way flex.",
        price: 1899, compareAtPrice: 2599,
        isTrending: false, isNew: true, isBestseller: false,
        gender: "men", fit: "slim", sizes: SIZES, colors: ["Charcoal Grey"],
        category: catSlim._id,
        images: [
          { url: DENIM_IMAGES.slim[3], altText: "Charcoal Grey Slim" },
          { url: DENIM_IMAGES.slim[0], altText: "Grey Slim Detail" }
        ],
        tags: ["grey", "slim", "stretch"],
        averageRating: 4.6, totalReviews: 11
      },

      // ── REGULAR FIT ──────────────────────────────────────
      {
        title: "Amar Heritage Classic Straight Cut Indigo Denim",
        handle: "amar-heritage-classic-straight",
        description: "Timeless classic straight fit denim featuring double copper stitching, heavy 14oz denim weight, and vintage wash.",
        price: 1799, compareAtPrice: 2499,
        isTrending: false, isNew: false, isBestseller: true,
        gender: "men", fit: "regular", sizes: SIZES, colors: ["Raw Indigo", "Dark Wash"],
        category: catReg._id,
        images: [
          { url: DENIM_IMAGES.regular[0], altText: "Heritage Classic Straight" },
          { url: DENIM_IMAGES.regular[1], altText: "Heritage Classic Back" }
        ],
        tags: ["classic", "straight", "raw-denim", "regular"],
        averageRating: 4.8, totalReviews: 32
      },
      {
        title: "Amar Dark Wash Mid-Rise Regular Fit",
        handle: "amar-dark-wash-mid-rise-regular",
        description: "Premium dark wash mid-rise regular fit jeans. Copper rivets, 5-pocket design, built for all-day comfort.",
        price: 1599, compareAtPrice: 2199,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "men", fit: "regular", sizes: SIZES, colors: ["Dark Wash", "Black"],
        category: catReg._id,
        images: [
          { url: DENIM_IMAGES.regular[1], altText: "Dark Wash Regular" },
          { url: DENIM_IMAGES.regular[2], altText: "Dark Wash Detail" }
        ],
        tags: ["dark-wash", "regular", "everyday"],
        averageRating: 4.5, totalReviews: 19
      },
      {
        title: "Amar Stone Wash Relaxed Regular Fit",
        handle: "amar-stone-wash-relaxed-regular",
        description: "Classic stone-washed regular fit with relaxed thigh and straight leg. Factory-direct quality, premium finish.",
        price: 1499, compareAtPrice: null,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "men", fit: "regular", sizes: SIZES, colors: ["Stone Wash"],
        category: catReg._id,
        images: [
          { url: DENIM_IMAGES.regular[2], altText: "Stone Wash Regular" },
          { url: DENIM_IMAGES.regular[0], altText: "Stone Wash Front" }
        ],
        tags: ["stone-wash", "regular", "relaxed"],
        averageRating: 4.3, totalReviews: 7
      },

      // ── CARGO ────────────────────────────────────────────
      {
        title: "Amar Tactical 6-Pocket Heavy Duty Cargo Jeans",
        handle: "amar-tactical-6-pocket-cargo",
        description: "Urban utility meets premium denim craftsmanship. Features reinforced deep cargo pockets and heavy wash treatment.",
        price: 2499, compareAtPrice: 3299,
        isTrending: true, isNew: false, isBestseller: true,
        gender: "men", fit: "cargo", sizes: SIZES, colors: ["Dark Olive", "Midnight Blue", "Black"],
        category: catCargo._id,
        images: [
          { url: DENIM_IMAGES.cargo[0], altText: "Tactical Cargo Jeans" },
          { url: DENIM_IMAGES.cargo[1], altText: "Cargo Pockets Detail" }
        ],
        tags: ["cargo", "tactical", "utility", "trending"],
        averageRating: 5.0, totalReviews: 28
      },
      {
        title: "Amar Urban Streetwear Cargo Denim Jogger",
        handle: "amar-urban-cargo-jogger",
        description: "Cargo denim meets jogger silhouette. Ribbed ankle, elastic waist + belt loops, deep cargo pockets. The street-ready everyday pant.",
        price: 2199, compareAtPrice: 2899,
        isTrending: true, isNew: true, isBestseller: false,
        gender: "men", fit: "cargo", sizes: SIZES, colors: ["Black", "Charcoal"],
        category: catCargo._id,
        images: [
          { url: DENIM_IMAGES.cargo[1], altText: "Cargo Jogger Front" },
          { url: DENIM_IMAGES.cargo[0], altText: "Cargo Jogger Side" }
        ],
        tags: ["cargo", "jogger", "streetwear", "new"],
        averageRating: 4.8, totalReviews: 14
      },
      {
        title: "Amar Heavy Duty Double-Knee Cargo Denim",
        handle: "amar-double-knee-cargo-denim",
        description: "Work-ready double knee reinforced cargo jeans. 14oz ring-spun denim, 6 deep pockets, triple-stitched seams.",
        price: 2699, compareAtPrice: 3499,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "men", fit: "cargo", sizes: SIZES, colors: ["Raw Indigo", "Washed Black"],
        category: catCargo._id,
        images: [
          { url: DENIM_IMAGES.cargo[0], altText: "Double Knee Cargo" },
          { url: DENIM_IMAGES.cargo[1], altText: "Double Knee Detail" }
        ],
        tags: ["cargo", "workwear", "heavy-duty"],
        averageRating: 4.9, totalReviews: 9
      },

      // ── JACKETS ──────────────────────────────────────────
      {
        title: "Amar Heavyweight Trucker Denim Jacket",
        handle: "amar-heavyweight-trucker-jacket",
        description: "The ultimate outerwear layer. Premium stone-washed blue denim jacket with custom brass button hardware and interior pockets.",
        price: 3499, compareAtPrice: 4499,
        isTrending: true, isNew: false, isBestseller: true,
        gender: "unisex", fit: "other", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Classic Blue", "Black"],
        category: catJacket._id,
        images: [
          { url: DENIM_IMAGES.jacket[0], altText: "Denim Trucker Jacket" },
          { url: DENIM_IMAGES.jacket[1], altText: "Jacket Back Detail" }
        ],
        tags: ["jacket", "outerwear", "denim", "trucker"],
        averageRating: 4.9, totalReviews: 36
      },
      {
        title: "Amar Oversized Denim Shirt Jacket",
        handle: "amar-oversized-denim-shirt-jacket",
        description: "Wear it open as a jacket or buttoned as a denim shirt. Oversized boxy fit, heavyweight 12oz denim.",
        price: 2799, compareAtPrice: 3499,
        isTrending: false, isNew: true, isBestseller: false,
        gender: "unisex", fit: "other", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Light Wash", "Indigo"],
        category: catJacket._id,
        images: [
          { url: DENIM_IMAGES.jacket[1], altText: "Denim Shirt Jacket" },
          { url: DENIM_IMAGES.jacket[0], altText: "Shirt Jacket Open" }
        ],
        tags: ["jacket", "shirt", "oversized", "new"],
        averageRating: 4.6, totalReviews: 12
      },
      {
        title: "Amar Washed Black Slim Denim Jacket",
        handle: "amar-washed-black-slim-denim-jacket",
        description: "Jet black washed slim-cut trucker jacket. Minimal design, premium quality, timeless wardrobe staple.",
        price: 3199, compareAtPrice: 4099,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "men", fit: "slim", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Washed Black"],
        category: catJacket._id,
        images: [
          { url: DENIM_IMAGES.jacket[0], altText: "Black Slim Denim Jacket" },
          { url: DENIM_IMAGES.jacket[1], altText: "Black Jacket Detail" }
        ],
        tags: ["jacket", "black", "slim"],
        averageRating: 4.7, totalReviews: 15
      },

      // ── BAGGY ────────────────────────────────────────────
      {
        title: "Amar Vintage Baggy Wide Leg Denim",
        handle: "amar-vintage-baggy-wide-leg",
        description: "Retro 90s-inspired wide leg baggy denim. High-rise fit, roomy thigh, straight wide leg — the ultimate street-style statement.",
        price: 2299, compareAtPrice: 2999,
        isTrending: true, isNew: true, isBestseller: false,
        gender: "unisex", fit: "baggy", sizes: SIZES, colors: ["Light Wash", "Bleached", "Indigo"],
        category: catBaggy._id,
        images: [
          { url: DENIM_IMAGES.baggy[0], altText: "Vintage Baggy Wide Leg" },
          { url: DENIM_IMAGES.baggy[1], altText: "Baggy Wide Leg Side" }
        ],
        tags: ["baggy", "wide-leg", "vintage", "trending", "new"],
        averageRating: 4.8, totalReviews: 20
      },
      {
        title: "Amar Relaxed Baggy Indigo Denim",
        handle: "amar-relaxed-baggy-indigo",
        description: "Maximum comfort, maximum style. Relaxed baggy fit with deep indigo wash and lived-in texture.",
        price: 1999, compareAtPrice: 2699,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "men", fit: "baggy", sizes: SIZES, colors: ["Raw Indigo", "Dark Indigo"],
        category: catBaggy._id,
        images: [
          { url: DENIM_IMAGES.baggy[1], altText: "Relaxed Baggy Indigo" },
          { url: DENIM_IMAGES.baggy[0], altText: "Baggy Indigo Front" }
        ],
        tags: ["baggy", "indigo", "relaxed"],
        averageRating: 4.5, totalReviews: 9
      },
      {
        title: "Amar Streetwear Balloon Fit Denim",
        handle: "amar-streetwear-balloon-fit",
        description: "Balloon leg silhouette with tapered ankle. Bold street-ready style meets Amar Jeans' signature heavy-gauge denim.",
        price: 2499, compareAtPrice: 3199,
        isTrending: true, isNew: true, isBestseller: false,
        gender: "unisex", fit: "baggy", sizes: SIZES, colors: ["Ice Blue", "Black"],
        category: catBaggy._id,
        images: [
          { url: DENIM_IMAGES.baggy[0], altText: "Balloon Fit Denim" },
          { url: DENIM_IMAGES.baggy[1], altText: "Balloon Leg Detail" }
        ],
        tags: ["baggy", "balloon", "streetwear", "trending", "new"],
        averageRating: 4.7, totalReviews: 6
      },

      // ── WOMEN ────────────────────────────────────────────
      {
        title: "Amar Women's High-Rise Slim Indigo Jeans",
        handle: "amar-womens-high-rise-slim-indigo",
        description: "Flattering high-rise slim fit for women. Signature Amar Jeans indigo, stretch blend for all-day comfort.",
        price: 1899, compareAtPrice: 2499,
        isTrending: true, isNew: true, isBestseller: false,
        gender: "women", fit: "slim", sizes: ["26", "28", "30", "32", "34"], colors: ["Indigo", "Dark Wash", "Black"],
        category: catSlim._id,
        images: [
          { url: DENIM_IMAGES.slim[2], altText: "Women's High Rise Slim" },
          { url: DENIM_IMAGES.slim[3], altText: "Women's Slim Detail" }
        ],
        tags: ["women", "slim", "high-rise", "new"],
        averageRating: 4.9, totalReviews: 22
      },
      {
        title: "Amar Women's Wide Leg Flare Denim",
        handle: "amar-womens-wide-leg-flare",
        description: "Effortlessly chic wide-leg flare denim. 70s-inspired silhouette with premium stretch denim and Amar's signature durability.",
        price: 2199, compareAtPrice: 2899,
        isTrending: false, isNew: true, isBestseller: false,
        gender: "women", fit: "baggy", sizes: ["26", "28", "30", "32", "34"], colors: ["Light Wash", "Mid Blue"],
        category: catBaggy._id,
        images: [
          { url: DENIM_IMAGES.baggy[0], altText: "Women's Flare Denim" },
          { url: DENIM_IMAGES.baggy[1], altText: "Wide Leg Flare Detail" }
        ],
        tags: ["women", "flare", "wide-leg", "new"],
        averageRating: 4.8, totalReviews: 17
      },
      {
        title: "Amar Women's Straight Fit Classic Denim",
        handle: "amar-womens-straight-classic",
        description: "Timeless straight fit women's denim. Mid-rise, 5-pocket, crafted from heavy-gauge ring-spun denim.",
        price: 1699, compareAtPrice: 2299,
        isTrending: false, isNew: false, isBestseller: false,
        gender: "women", fit: "regular", sizes: ["26", "28", "30", "32", "34"], colors: ["Raw Indigo", "Black", "Stone Wash"],
        category: catReg._id,
        images: [
          { url: DENIM_IMAGES.regular[0], altText: "Women's Straight Classic" },
          { url: DENIM_IMAGES.regular[1], altText: "Women's Straight Detail" }
        ],
        tags: ["women", "straight", "classic"],
        averageRating: 4.6, totalReviews: 13
      },
      {
        title: "Amar Women's Cargo Denim with Utility Pockets",
        handle: "amar-womens-cargo-utility",
        description: "Functional fashion meets street credibility. Women's cargo denim with 4 utility pockets, relaxed waist, tapered leg.",
        price: 2299, compareAtPrice: 2999,
        isTrending: true, isNew: true, isBestseller: false,
        gender: "women", fit: "cargo", sizes: ["26", "28", "30", "32", "34"], colors: ["Olive", "Black", "Dark Wash"],
        category: catCargo._id,
        images: [
          { url: DENIM_IMAGES.cargo[0], altText: "Women's Cargo Denim" },
          { url: DENIM_IMAGES.cargo[1], altText: "Women's Cargo Pockets" }
        ],
        tags: ["women", "cargo", "utility", "trending", "new"],
        averageRating: 4.8, totalReviews: 10
      },
    ];

    const insertedProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Inserted ${insertedProducts.length} products.`);

    // Seed reviews for top products
    const reviewsData = [];
    const reviewTemplates = [
      { name: "Rahul Sharma",    rating: 5, comment: "Exceptional quality denim! The fit around waist and thighs is spot on. Truly high-end comfort." },
      { name: "Vikram Waghmare", rating: 5, comment: "Super durable material and stretch makes it perfect for daily wear. Amar Jeans never disappoints." },
      { name: "Priya Mehta",     rating: 5, comment: "Ordered 3 pairs for my husband. He loves them! Great quality and fast delivery." },
      { name: "Karan Verma",     rating: 5, comment: "Finally found jeans that fit perfectly! Factory direct price is unbeatable." },
      { name: "Amit Rathod",     rating: 4, comment: "Really good quality for the price. Will definitely order again." },
    ];

    insertedProducts.slice(0, 6).forEach(product => {
      reviewTemplates.forEach(r => {
        reviewsData.push({ product: product._id, ...r });
      });
    });

    await Review.insertMany(reviewsData);
    console.log(`[Seed] Inserted ${reviewsData.length} reviews.`);

    // Seed blog posts
    await BlogPost.insertMany([
      {
        title: "How to Care for Your Raw Denim Jeans",
        slug: "how-to-care-for-raw-denim",
        excerpt: "Raw denim ages beautifully with proper care. Here's everything you need to know about washing, storing, and maintaining your Amar Jeans.",
        content: "<p>Raw denim is one of the most unique textiles in fashion. Unlike pre-washed denim, raw denim has not been washed after the dyeing process, giving it a stiff, dark appearance that softens and fades uniquely to your body over time.</p><h2>Washing Tips</h2><p>Wait at least 6 months before the first wash. Turn inside out, use cold water, and hang dry away from direct sunlight.</p><h2>Storage</h2><p>Fold rather than hang to preserve the denim structure. Avoid damp storage areas.</p>",
        coverImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&auto=format&fit=crop",
        tags: ["denim care", "raw denim", "tips"],
        published: true, author: "Amar Jeans Team"
      },
      {
        title: "Finding Your Perfect Denim Fit — The Amar Guide",
        slug: "finding-your-perfect-denim-fit",
        excerpt: "Slim, regular, baggy, cargo — understanding which denim fit works for your body type and style.",
        content: "<p>Choosing the right jeans fit can transform your entire look. At Amar Jeans, we manufacture every fit category with the same premium materials.</p><h2>Slim Fit</h2><p>Best for athletic builds, tapered from thigh to ankle. Our slim fits include 2% elastane for comfort.</p><h2>Regular Fit</h2><p>The timeless choice — room in thigh and seat, straight through the leg.</p><h2>Baggy / Wide Leg</h2><p>Fashion-forward and supremely comfortable. Street-style ready.</p><h2>Cargo</h2><p>Utility-first design with deep pockets and reinforced stitching for heavy-duty wear.</p>",
        coverImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop",
        tags: ["fit guide", "buying guide", "fashion"],
        published: true, author: "Amar Jeans Team"
      },
      {
        title: "Denim Trends 2026 — What's Hot This Season",
        slug: "denim-trends-2026",
        excerpt: "From wide-leg silhouettes to utility cargo, here are the denim trends dominating 2026 — and how to wear them.",
        content: "<p>2026 is shaping up to be a landmark year for denim. Here are the top trends we're seeing on the streets.</p><h2>Wide Leg is King</h2><p>The 90s comeback continues. Wide leg and balloon-fit jeans are everywhere, in both men's and women's fashion.</p><h2>Cargo Everything</h2><p>Utility pockets have moved from workwear to high fashion. Our cargo jeans range is leading this trend.</p><h2>Dark Wash Returns</h2><p>After years of light washes, deep midnight blue and jet black are making a strong comeback for evening-appropriate denim.</p>",
        coverImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&auto=format&fit=crop",
        tags: ["trends", "fashion", "2026"],
        published: true, author: "Amar Jeans Team"
      }
    ]);
    console.log("[Seed] Inserted blog posts.");

    // Seed coupons
    await Coupon.insertMany([
      { code: "AMAR10", discountType: "percent", discountValue: 10, minCartValue: 999, active: true },
      { code: "SHARKTANK20", discountType: "percent", discountValue: 20, minCartValue: 1499, active: true },
      { code: "BULK15", discountType: "percent", discountValue: 15, minCartValue: 4999, active: true },
      { code: "FIRST200", discountType: "flat", discountValue: 200, minCartValue: 1999, active: true }
    ]);
    console.log("[Seed] Inserted coupons.");
    console.log("[Seed] ✅ All initial data seeded successfully!");

  } catch (err) {
    console.error("[Seed] Seeding error:", err);
  }
}
