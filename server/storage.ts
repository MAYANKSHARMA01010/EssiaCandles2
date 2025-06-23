import { products, cartItems, orders, orderItems, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
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

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      (p.scent && p.scent.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return { ...item, product };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + insertCartItem.quantity };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id: orderId,
      createdAt: new Date()
    };
    this.orders.set(orderId, order);

    // Create order items
    items.forEach(insertItem => {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = { ...insertItem, id: orderItemId, orderId };
      this.orderItems.set(orderItemId, orderItem);
    });

    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
