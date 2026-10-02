import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { Review } from "./models/Review.js";
import { SiteSettings } from "./models/SiteSettings.js";

export async function seedInitialData() {
  try {
    await SiteSettings.getSettings();

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log("[Seed] Populating initial categories...");
      const categories = await Category.insertMany([
        {
          name: "Slim Fit Jeans",
          slug: "slim-fit-jeans",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop"
        },
        {
          name: "Regular Fit Jeans",
          slug: "regular-fit-jeans",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop"
        },
        {
          name: "Cargo & Tactical Denim",
          slug: "cargo-jeans",
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop"
        },
        {
          name: "Denim Jackets & Shirts",
          slug: "denim-jackets",
          image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop"
        },
      ]);

      const catSlim = categories.find(c => c.slug === "slim-fit-jeans");
      const catReg = categories.find(c => c.slug === "regular-fit-jeans");
      const catCargo = categories.find(c => c.slug === "cargo-jeans");
      const catJacket = categories.find(c => c.slug === "denim-jackets");

      console.log("[Seed] Populating initial products...");
      const productsData = [
        {
          title: "Amar Premium Midnight Blue Slim Fit Stretch Jeans",
          handle: "amar-midnight-blue-slim-fit",
          description: "Engineered for maximum comfort and crisp tailored style. Made from 98% organic cotton denim with 2% elastane for seamless flex.",
          price: 1999,
          compareAtPrice: 2799,
          isTrending: true,
          category: catSlim._id,
          images: [
            { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop", altText: "Midnight Blue Slim Fit Front" },
            { url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop", altText: "Midnight Blue Slim Fit Detail" }
          ],
          tags: ["slim", "stretch", "bestseller", "indigo"],
          brand: "AMAR JEANS",
          averageRating: 4.9,
          totalReviews: 12
        },
        {
          title: "Amar Tactical 6-Pocket Heavy Duty Cargo Jeans",
          handle: "amar-tactical-6-pocket-cargo",
          description: "Urban utility meets premium denim craftsmanship. Features reinforced deep cargo pockets and heavy wash treatment.",
          price: 2499,
          compareAtPrice: 3299,
          isTrending: true,
          category: catCargo._id,
          images: [
            { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop", altText: "Tactical Cargo Jeans" }
          ],
          tags: ["cargo", "tactical", "utility", "trending"],
          brand: "AMAR JEANS",
          averageRating: 5.0,
          totalReviews: 8
        },
        {
          title: "Amar Heritage Classic Straight Cut Indigo Denim",
          handle: "amar-heritage-classic-straight",
          description: "Timeless classic straight fit denim featuring double copper stitching, heavy 14oz denim weight, and vintage wash.",
          price: 1799,
          compareAtPrice: 2499,
          isTrending: false,
          category: catReg._id,
          images: [
            { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop", altText: "Heritage Classic Straight" }
          ],
          tags: ["classic", "straight", "raw-denim"],
          brand: "AMAR JEANS",
          averageRating: 4.8,
          totalReviews: 15
        },
        {
          title: "Amar Heavyweight Trucker Denim Jacket",
          handle: "amar-heavyweight-trucker-jacket",
          description: "The ultimate outerwear layer. Premium stone-washed blue denim jacket with custom brass button hardware and interior pockets.",
          price: 3499,
          compareAtPrice: 4499,
          isTrending: true,
          category: catJacket._id,
          images: [
            { url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop", altText: "Denim Trucker Jacket" }
          ],
          tags: ["jacket", "outerwear", "denim"],
          brand: "AMAR JEANS",
          averageRating: 4.9,
          totalReviews: 20
        },
        {
          title: "Amar Onyx Jet Black Biker Stretch Jeans",
          handle: "amar-onyx-black-biker-jeans",
          description: "Sleek jet-black stretch denim with articulated knee ribs and tapered leg. Deep black reactive dye that does not fade.",
          price: 2199,
          compareAtPrice: 2999,
          isTrending: true,
          category: catSlim._id,
          images: [
            { url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop", altText: "Onyx Black Biker Jeans" }
          ],
          tags: ["black", "biker", "tapered"],
          brand: "AMAR JEANS",
          averageRating: 4.7,
          totalReviews: 9
        }
      ];

      const insertedProducts = await Product.insertMany(productsData);

      // Seed some reviews for first product
      if (insertedProducts.length > 0) {
        await Review.insertMany([
          {
            product: insertedProducts[0]._id,
            authorName: "Rahul Sharma",
            rating: 5,
            comment: "Exceptional quality denim! The fit around waist and thighs is spot on. Truly high-end comfort."
          },
          {
            product: insertedProducts[0]._id,
            authorName: "Vikram Waghmare",
            rating: 5,
            comment: "Super durable material and stretch makes it perfect for daily wear. Amar Jeans never disappoints."
          }
        ]);
      }
      console.log("[Seed] Successfully seeded initial products & reviews!");
    }
  } catch (err) {
    console.error("[Seed] Seeding error:", err);
  }
}
