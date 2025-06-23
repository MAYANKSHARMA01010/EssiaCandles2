import {
  users,
  addresses,
  products,
  cartItems,
  orders,
  orderItems,
  type User,
  type InsertUser,
  type Address,
  type InsertAddress,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or, like, ilike, isNull, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users & Auth
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  
  // Addresses
  getUserAddresses(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  setDefaultAddress(userId: number, addressId: number, type: 'shipping' | 'billing'): Promise<void>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(userId?: number, sessionId?: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;
  migrateCartToUser(sessionId: string, userId: number): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<(Order & { orderItems: (OrderItem & { product: Product })[] })[]>;
  updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users & Auth
  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Addresses
  async getUserAddresses(userId: number): Promise<Address[]> {
    return await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const [address] = await db
      .insert(addresses)
      .values(insertAddress)
      .returning();
    return address;
  }

  async updateAddress(id: number, updateData: Partial<InsertAddress>): Promise<Address | undefined> {
    const [address] = await db
      .update(addresses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(addresses.id, id))
      .returning();
    return address;
  }

  async deleteAddress(id: number): Promise<boolean> {
    const result = await db.delete(addresses).where(eq(addresses.id, id));
    return (result.rowCount || 0) > 0;
  }

  async setDefaultAddress(userId: number, addressId: number, type: 'shipping' | 'billing'): Promise<void> {
    // First, unset all default addresses of this type for the user
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(and(eq(addresses.userId, userId), eq(addresses.type, type)));

    // Then set the new default
    await db
      .update(addresses)
      .set({ isDefault: true })
      .where(eq(addresses.id, addressId));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`),
          ilike(products.scent, `%${query}%`)
        )
      );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Cart
  async getCartItems(userId?: number, sessionId?: string): Promise<(CartItem & { product: Product })[]> {
    if (!userId && !sessionId) return [];

    let whereCondition;
    if (userId) {
      whereCondition = eq(cartItems.userId, userId);
    } else {
      whereCondition = and(eq(cartItems.sessionId, sessionId!), isNull(cartItems.userId));
    }

    const result = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(whereCondition);

    return result;
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    let whereCondition;
    if (insertCartItem.userId) {
      whereCondition = and(
        eq(cartItems.productId, insertCartItem.productId),
        eq(cartItems.userId, insertCartItem.userId)
      );
    } else if (insertCartItem.sessionId) {
      whereCondition = and(
        eq(cartItems.productId, insertCartItem.productId),
        eq(cartItems.sessionId, insertCartItem.sessionId),
        isNull(cartItems.userId)
      );
    } else {
      throw new Error("Either userId or sessionId must be provided");
    }

    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(whereCondition);

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertCartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create new cart item
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    if (!userId && !sessionId) return false;

    let whereCondition;
    if (userId) {
      whereCondition = eq(cartItems.userId, userId);
    } else {
      whereCondition = and(eq(cartItems.sessionId, sessionId!), isNull(cartItems.userId));
    }

    await db.delete(cartItems).where(whereCondition);
    return true;
  }

  async migrateCartToUser(sessionId: string, userId: number): Promise<void> {
    await db
      .update(cartItems)
      .set({ userId, sessionId: null })
      .where(and(eq(cartItems.sessionId, sessionId), isNull(cartItems.userId)));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();

    // Create order items
    const orderItemsData = items.map(item => ({ ...item, orderId: order.id }));
    await db.insert(orderItems).values(orderItemsData);

    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: number): Promise<(Order & { orderItems: (OrderItem & { product: Product })[] })[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            product: products,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return { ...order, orderItems: items };
      })
    );

    return ordersWithItems;
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Initialize sample products if database is empty
  async initializeSampleProducts(): Promise<void> {
    const existingProducts = await this.getProducts();
    if (existingProducts.length > 0) return;

    const sampleProducts: InsertProduct[] = [
      {
        name: "Lavender Dreams",
        description: "Soothing lavender with vanilla notes",
        price: "28.00",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "scented",
        featured: true,
        scent: "Lavender & Vanilla",
        burnTime: 45,
        size: "8 oz",
        ingredients: "Natural soy wax, cotton wick, lavender essential oil, vanilla fragrance"
      },
      {
        name: "Eucalyptus Mint",
        description: "Fresh eucalyptus with cooling mint",
        price: "25.00",
        image: "https://pixabay.com/get/g41d4a338b2dd1f0a67a36744c6730315d54e4ab2996f2ef27692a46fe872a0151149d3259c0b3431edc4ae5a9effc5a4444d5143c82d99bb6d5ebc1e97b642cf_1280.jpg",
        category: "scented",
        featured: true,
        scent: "Eucalyptus & Mint",
        burnTime: 40,
        size: "8 oz",
        ingredients: "Natural soy wax, cotton wick, eucalyptus essential oil, peppermint oil"
      },
      {
        name: "Rose Bergamot",
        description: "Elegant rose with citrus bergamot",
        price: "32.00",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "scented",
        featured: true,
        scent: "Rose & Bergamot",
        burnTime: 50,
        size: "10 oz",
        ingredients: "Natural soy wax, cotton wick, rose essential oil, bergamot oil"
      },
      {
        name: "Sandalwood Vanilla",
        description: "Warm sandalwood with sweet vanilla",
        price: "30.00",
        image: "https://pixabay.com/get/g1eae6127367b5e2ad0c78744cde0ab7be5807eae65a4e01b10234e3e6432e1df3a58618b21a0c741f737125aa83bf08787a2f3cdac5bd6e689a5c6fe2692f2b9_1280.jpg",
        category: "scented",
        featured: true,
        scent: "Sandalwood & Vanilla",
        burnTime: 48,
        size: "8 oz",
        ingredients: "Natural soy wax, cotton wick, sandalwood oil, vanilla extract"
      },
      {
        name: "Pure White",
        description: "Clean unscented candle for pure light",
        price: "22.00",
        image: "https://pixabay.com/get/g2d1015e580405db50f1b77c1ac1438a4c134d077bcab1aeb8eefbba3fc1f724d01ced9da299bea9a11d951e287b64b865fbb44dc0484a9f9a9b83e33cc90c1a2_1280.jpg",
        category: "unscented",
        featured: false,
        scent: null,
        burnTime: 35,
        size: "6 oz",
        ingredients: "Natural soy wax, cotton wick"
      },
      {
        name: "Holiday Spice",
        description: "Warm cinnamon and orange seasonal blend",
        price: "26.00",
        image: "https://pixabay.com/get/g1e1de51a70a42d9426dd8c1bfbd691475135844edadd701beaa19318fc6ea648dd3950faa264a9079d1193a0fdf844c23746ad392b8db0a5a270a0397483273d_1280.jpg",
        category: "seasonal",
        featured: false,
        scent: "Cinnamon & Orange",
        burnTime: 42,
        size: "8 oz",
        ingredients: "Natural soy wax, cotton wick, cinnamon bark oil, sweet orange oil"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }
}

export const storage = new DatabaseStorage();
