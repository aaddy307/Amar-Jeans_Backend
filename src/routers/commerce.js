import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "../_core/localCart.js";
import { Order } from "../models/Order.js";

const cartLineInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const cartLineUpdateSchema = z.object({
  lineId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
});

// Helper to map a raw Product mongo doc to frontend-ready shape
function mapProduct(p) {
  return {
    ...p,
    id: p._id.toString(),
    vendor: p.brand,
    productType: p.category ? p.category.name : "",
    priceRange: { min: { amount: p.price.toString(), currencyCode: "INR" } },
    variants: [{ id: p._id.toString() }],
    images: (p.images && p.images.length > 0)
      ? p.images
      : (p.imageUrl ? [{ url: p.imageUrl, altText: p.title }] : [])
  };
}

export const commerceRouter = router({
  /* -------------------------------------------------------------------------- */
  /*                                 PRODUCTS                                   */
  /* -------------------------------------------------------------------------- */
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.string().optional(),
        gender: z.enum(['men', 'women', 'unisex']).optional(),
        fit: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        isNew: z.boolean().optional(),
        isBestseller: z.boolean().optional(),
        isTrending: z.boolean().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const query = {};
        if (input?.categoryId) query.category = input.categoryId;
        if (input?.gender && input.gender !== 'unisex') query.gender = input.gender;
        if (input?.fit) query.fit = input.fit;
        if (input?.size) query.sizes = input.size;
        if (input?.color) query.colors = input.color;
        if (input?.isNew === true) query.isNew = true;
        if (input?.isBestseller === true) query.isBestseller = true;
        if (input?.isTrending === true) query.isTrending = true;
        if (input?.minPrice !== undefined || input?.maxPrice !== undefined) {
          query.price = {};
          if (input?.minPrice !== undefined) query.price.$gte = input.minPrice;
          if (input?.maxPrice !== undefined) query.price.$lte = input.maxPrice;
        }
        if (input?.search) {
          query.$or = [
            { title: { $regex: input.search, $options: 'i' } },
            { description: { $regex: input.search, $options: 'i' } },
            { tags: { $regex: input.search, $options: 'i' } }
          ];
        }

        const products = await Product.find(query).populate('category', 'name slug').lean();
        return products.map(mapProduct);
      }),

    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        const p = await Product.findOne({ handle: input.handle }).populate('category', 'name slug').lean();
        if (!p) return null;
        return mapProduct(p);
      }),

    related: publicProcedure
      .input(z.object({ productId: z.string(), categoryId: z.string().optional() }))
      .query(async ({ input }) => {
        const query = { _id: { $ne: input.productId } };
        if (input.categoryId) query.category = input.categoryId;
        const products = await Product.find(query).limit(8).populate('category', 'name slug').lean();
        return products.map(mapProduct);
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                               CATEGORIES                                   */
  /* -------------------------------------------------------------------------- */
  categories: router({
    list: publicProcedure.query(async () => {
      const categories = await Category.find().lean();
      // Get product count per category
      const counts = await Promise.all(
        categories.map(c => Product.countDocuments({ category: c._id }))
      );
      return categories.map((c, i) => ({
        ...c,
        id: c._id.toString(),
        productCount: counts[i]
      }));
    }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                REVIEWS                                     */
  /* -------------------------------------------------------------------------- */
  reviews: router({
    listByProduct: publicProcedure
      .input(z.object({ productId: z.string() }))
      .query(async ({ input }) => {
        return await Review.find({ product: input.productId })
          .sort({ createdAt: -1 })
          .lean();
      }),

    listRecent: publicProcedure
      .query(async () => {
        return await Review.find()
          .sort({ createdAt: -1 })
          .limit(12)
          .populate('product', 'title images handle')
          .lean();
      }),

    create: publicProcedure
      .input(z.object({
        productId: z.string(),
        authorName: z.string().min(1),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1)
      }))
      .mutation(async ({ input }) => {
        const review = await Review.create({
          product: input.productId,
          authorName: input.authorName,
          rating: input.rating,
          comment: input.comment
        });
        return { success: true, review };
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                 CART                                       */
  /* -------------------------------------------------------------------------- */
  cart: router({
    create: publicProcedure
      .input(z.object({ lines: z.array(cartLineInputSchema).min(1).max(50) }))
      .mutation(async ({ input }) => createCart(input.lines)),

    get: publicProcedure
      .input(z.object({ cartId: z.string().min(1) }))
      .query(async ({ input }) => getCart(input.cartId)),

    addLines: publicProcedure
      .input(z.object({
        cartId: z.string().min(1),
        lines: z.array(cartLineInputSchema).min(1).max(50),
      }))
      .mutation(async ({ input }) => addCartLines(input.cartId, input.lines)),

    updateLines: publicProcedure
      .input(z.object({
        cartId: z.string().min(1),
        lines: z.array(cartLineUpdateSchema).min(1).max(50),
      }))
      .mutation(async ({ input }) => {
        const toRemove = input.lines.filter(l => l.quantity === 0).map(l => l.lineId);
        const toUpdate = input.lines.filter(l => l.quantity > 0);
        let cart = null;
        if (toUpdate.length) cart = await updateCartLines(input.cartId, toUpdate);
        if (toRemove.length) cart = await removeCartLines(input.cartId, toRemove);
        if (!cart) cart = await getCart(input.cartId);
        return cart;
      }),

    removeLines: publicProcedure
      .input(z.object({
        cartId: z.string().min(1),
        lineIds: z.array(z.string().min(1)).min(1).max(50),
      }))
      .mutation(async ({ input }) => removeCartLines(input.cartId, input.lineIds)),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                WISHLIST                                    */
  /* -------------------------------------------------------------------------- */
  wishlist: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await User.findById(ctx.user.id).populate('wishlist').lean();
      if (!user || !user.wishlist) return [];
      return user.wishlist.map(p => mapProduct(p));
    }),

    toggle: protectedProcedure
      .input(z.object({ productId: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const user = await User.findById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        const index = user.wishlist.indexOf(input.productId);
        if (index === -1) {
          user.wishlist.push(input.productId);
        } else {
          user.wishlist.splice(index, 1);
        }
        await user.save();
        return { success: true, added: index === -1 };
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                ORDERS & ENQUIRIES                          */
  /* -------------------------------------------------------------------------- */
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string().min(2),
        customerEmail: z.string().email(),
        customerPhone: z.string().min(7),
        shippingAddress: z.string().optional().default(""),
        city: z.string().optional().default(""),
        pincode: z.string().optional().default(""),
        totalPrice: z.string().optional().default("0"),
        notes: z.string().optional().default(""),
        orderType: z.enum(["order", "enquiry"]).optional().default("enquiry"),
        couponCode: z.string().optional().default(""),
        discountAmount: z.string().optional().default("0"),
        items: z.array(z.object({
          productId: z.string().optional(),
          title: z.string().optional(),
          price: z.number().optional(),
          quantity: z.number().optional().default(1),
          size: z.string().optional().default("32"),
          image: z.string().optional()
        })).optional().default([])
      }))
      .mutation(async ({ input, ctx }) => {
        const prefix = input.orderType === "enquiry" ? "ENQ-" : "ORD-";
        const orderNumber = prefix + Math.floor(100000 + Math.random() * 900000);
        const order = await Order.create({
          userId: ctx.user?.id || undefined,
          orderNumber,
          orderType: input.orderType,
          status: "pending",
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          city: input.city,
          pincode: input.pincode,
          totalPrice: input.totalPrice,
          items: input.items,
          notes: input.notes
        });
        return {
          success: true,
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          message: input.orderType === "enquiry"
            ? "Enquiry submitted successfully! Our team will contact you shortly."
            : "Order placed successfully!"
        };
      })
  }),

  /* -------------------------------------------------------------------------- */
  /*                                COUPONS                                     */
  /* -------------------------------------------------------------------------- */
  coupons: router({
    validate: publicProcedure
      .input(z.object({
        code: z.string().min(1),
        cartTotal: z.number()
      }))
      .query(async ({ input }) => {
        const { Coupon } = await import("../models/Coupon.js");
        const coupon = await Coupon.findOne({ code: input.code.toUpperCase().trim(), active: true }).lean();
        if (!coupon) return { valid: false, message: "Invalid coupon code" };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { valid: false, message: "Coupon has expired" };
        }
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
          return { valid: false, message: "Coupon usage limit reached" };
        }
        if (input.cartTotal < coupon.minCartValue) {
          return { valid: false, message: `Minimum cart value ₹${coupon.minCartValue} required` };
        }
        const discount = coupon.discountType === 'percent'
          ? Math.floor(input.cartTotal * coupon.discountValue / 100)
          : coupon.discountValue;
        return {
          valid: true,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount,
          message: `Coupon applied! You save ₹${discount}`
        };
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  BLOG                                      */
  /* -------------------------------------------------------------------------- */
  blog: router({
    list: publicProcedure.query(async () => {
      const { BlogPost } = await import("../models/BlogPost.js");
      const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).lean();
      return posts.map(p => ({ ...p, id: p._id.toString() }));
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const { BlogPost } = await import("../models/BlogPost.js");
        const post = await BlogPost.findOne({ slug: input.slug, published: true }).lean();
        if (!post) return null;
        return { ...post, id: post._id.toString() };
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                               NEWSLETTER                                   */
  /* -------------------------------------------------------------------------- */
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        phone: z.string().optional().default("")
      }))
      .mutation(async ({ input }) => {
        const { NewsletterSubscriber } = await import("../models/NewsletterSubscriber.js");
        try {
          await NewsletterSubscriber.create({ email: input.email, phone: input.phone });
          return { success: true, message: "You're subscribed! Welcome to the Amar Jeans family." };
        } catch (err) {
          if (err.code === 11000) {
            return { success: true, message: "You're already subscribed!" };
          }
          throw err;
        }
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                               SETTINGS                                     */
  /* -------------------------------------------------------------------------- */
  settings: router({
    get: publicProcedure.query(async () => {
      const { SiteSettings } = await import("../models/SiteSettings.js");
      return await SiteSettings.getSettings();
    }),
  }),
});
