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

export const commerceRouter = router({
  /* -------------------------------------------------------------------------- */
  /*                                 PRODUCTS                                   */
  /* -------------------------------------------------------------------------- */
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        let query = {};
        if (input?.categoryId) {
          query.category = input.categoryId;
        }
        const products = await Product.find(query).populate('category', 'name slug').lean();
        
        // Map to match frontend expectations (Shopify style)
        return products.map(p => ({
          ...p,
          id: p._id.toString(),
          vendor: p.brand,
          productType: p.category ? p.category.name : "",
          priceRange: { min: { amount: p.price.toString(), currencyCode: "INR" } },
          variants: [{ id: p._id.toString() }], // dummy variant ID for cart
          images: (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [{ url: p.imageUrl, altText: p.title }] : [])
        }));
      }),

    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        const p = await Product.findOne({ handle: input.handle }).populate('category', 'name slug').lean();
        if (!p) return null;
        
        return {
          ...p,
          id: p._id.toString(),
          vendor: p.brand,
          productType: p.category ? p.category.name : "",
          priceRange: { min: { amount: p.price.toString(), currencyCode: "INR" } },
          variants: [{ id: p._id.toString() }],
          images: (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [{ url: p.imageUrl, altText: p.title }] : [])
        };
      }),
  }),

  /* -------------------------------------------------------------------------- */
  /*                               CATEGORIES                                   */
  /* -------------------------------------------------------------------------- */
  categories: router({
    list: publicProcedure.query(async () => {
      const categories = await Category.find().lean();
      return categories.map(c => ({
        ...c,
        id: c._id.toString()
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
          .limit(10)
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
      .mutation(async ({ input, ctx }) => {
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
      
      return user.wishlist.map(p => ({
        ...p,
        id: p._id.toString(),
        vendor: p.brand,
        productType: p.category ? p.category.name : "",
        priceRange: { min: { amount: p.price.toString(), currencyCode: "INR" } },
        variants: [{ id: p._id.toString() }]
      }));
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
          message: input.orderType === "enquiry" ? "Enquiry submitted successfully! Our team will contact you shortly." : "Order placed successfully!"
        };
      })
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
