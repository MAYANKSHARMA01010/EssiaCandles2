import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, loginSchema, registerSchema } from "@shared/schema";
import { z } from "zod";

// Session interface
interface SessionData {
  userId?: number;
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let products;
      if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (search) {
        products = await storage.searchProducts(search as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      // Migrate cart from session to user if exists
      const sessionId = req.headers['x-session-id'] as string;
      if (sessionId) {
        await storage.migrateCartToUser(sessionId, user.id);
      }
      
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      
      // Migrate cart from session to user if exists
      const sessionId = req.headers['x-session-id'] as string;
      if (sessionId) {
        await storage.migrateCartToUser(sessionId, user.id);
      }
      
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const userId = req.session.userId;
      const sessionId = req.headers['x-session-id'] as string;
      
      const cartItems = await storage.getCartItems(userId, sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.headers['x-session-id'] as string || 'anonymous';
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.headers['x-session-id'] as string || 'anonymous';
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = req.session?.id || req.headers['x-session-id'] as string || 'anonymous';
      const { order: orderData, items: itemsData } = req.body;
      
      const validatedOrder = insertOrderSchema.parse({
        ...orderData,
        sessionId
      });
      
      const validatedItems = itemsData.map((item: any) => 
        insertOrderItemSchema.parse(item)
      );
      
      const order = await storage.createOrder(validatedOrder, validatedItems);
      
      // Clear cart after successful order
      await storage.clearCart(sessionId);
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
