import { Product, Category, OrderResponse, ORDER_STATUS } from '../models/types';

// --- DEMO PRODUCTS ---
const DEMO_PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════
  // 🍔 BURGERS
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-001',
    name: 'Classic Burger',
    description: 'Jugoso medallón de carne 200g con queso cheddar, lechuga, tomate y cebolla caramelizada en pan brioche artesanal.',
    price: 8500,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'cat-1',
    categoryName: 'Burgers',
    available: true,
    additionals: [
      { id: 'add-001', name: 'Extra Cheddar', price: 800, active: true },
      { id: 'add-002', name: 'Bacon', price: 1200, active: true },
      { id: 'add-003', name: 'Huevo', price: 600, active: true },
    ],
    garnishes: [
      { id: 'garn-001', name: 'Papas Fritas', active: true },
      { id: 'garn-002', name: 'Aros de Cebolla', active: true },
    ],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-003',
    name: 'Veggie Supreme',
    description: 'Medallón de lentejas y quinoa con hummus, palta, rúcula y pan integral.',
    price: 7800,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    category: 'cat-1',
    categoryName: 'Burgers',
    available: true,
    additionals: [
      { id: 'add-005', name: 'Hummus extra', price: 700, active: true },
    ],
    garnishes: [
      { id: 'garn-003', name: 'Ensalada', active: true },
    ],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-009',
    name: 'Doble Cheese Burger',
    description: 'Dos medallones de carne 150g c/u, doble cheddar, bacon crujiente, cebolla morada y salsa especial en pan brioche.',
    price: 11200,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    category: 'cat-1',
    categoryName: 'Burgers',
    available: true,
    additionals: [
      { id: 'add-001', name: 'Extra Cheddar', price: 800, active: true },
      { id: 'add-002', name: 'Bacon extra', price: 1200, active: true },
      { id: 'add-003', name: 'Huevo', price: 600, active: true },
      { id: 'add-006', name: 'Jalapeños', price: 500, active: true },
      { id: 'add-007', name: 'Pulled Pork', price: 1500, active: true },
    ],
    garnishes: [
      { id: 'garn-001', name: 'Papas Fritas', active: true },
      { id: 'garn-002', name: 'Aros de Cebolla', active: true },
      { id: 'garn-003', name: 'Ensalada', active: true },
    ],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-010',
    name: 'Smash Burger',
    description: 'Medallón fino de carne 120g, sellado a la plancha con queso americano, pickles, cebolla picada y salsa smash.',
    price: 7500,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400',
    category: 'cat-1',
    categoryName: 'Burgers',
    available: true,
    additionals: [
      { id: 'add-001', name: 'Extra Cheddar', price: 800, active: true },
      { id: 'add-002', name: 'Bacon', price: 1200, active: true },
      { id: 'add-006', name: 'Jalapeños', price: 500, active: true },
    ],
    garnishes: [
      { id: 'garn-001', name: 'Papas Fritas', active: true },
      { id: 'garn-002', name: 'Aros de Cebolla', active: true },
    ],
    isDishOfTheDay: false,
  },
  // ═══════════════════════════════════════════
  // 🌮 MEXICAN
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-011',
    name: 'Burrito Clásico',
    description: 'Tortilla de harina rellena de carne deshebrada, arroz, frijoles, queso, crema y salsa verde.',
    price: 9800,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    category: 'cat-5',
    categoryName: 'Mexican',
    available: true,
    additionals: [
      { id: 'add-008', name: 'Extra Queso', price: 700, active: true },
      { id: 'add-004', name: 'Guacamole', price: 1000, active: true },
      { id: 'add-009', name: 'Crema', price: 500, active: true },
      { id: 'add-006', name: 'Jalapeños', price: 500, active: true },
    ],
    garnishes: [
      { id: 'garn-004', name: 'Nachos', active: true },
      { id: 'garn-005', name: 'Porción de Arroz', active: true },
    ],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-012',
    name: 'Burrito Bowl',
    description: 'Base de arroz con carne deshebrada, frijoles, pico de gallo, guacamole, crema y queso rallado en bowl.',
    price: 10200,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400',
    category: 'cat-5',
    categoryName: 'Mexican',
    available: true,
    additionals: [
      { id: 'add-008', name: 'Extra Queso', price: 700, active: true },
      { id: 'add-004', name: 'Guacamole extra', price: 1000, active: true },
      { id: 'add-009', name: 'Crema', price: 500, active: true },
    ],
    garnishes: [
      { id: 'garn-004', name: 'Nachos', active: true },
    ],
    isDishOfTheDay: true,  // 🌟 Plato destacado del día
  },
  {
    id: 'mock-prod-014',
    name: 'Quesadilla de Pollo',
    description: 'Tortilla de harina rellena de pollo deshebrado, queso fundido, pimiento salteado y cebolla.',
    price: 7200,
    stock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
    category: 'cat-5',
    categoryName: 'Mexican',
    available: true,
    additionals: [
      { id: 'add-008', name: 'Extra Queso', price: 700, active: true },
      { id: 'add-004', name: 'Guacamole', price: 1000, active: true },
      { id: 'add-009', name: 'Crema', price: 500, active: true },
    ],
    garnishes: [
      { id: 'garn-005', name: 'Porción de Arroz', active: true },
    ],
    isDishOfTheDay: false,
  },
  // ═══════════════════════════════════════════
  // 🥟 EMPANADAS
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-015',
    name: 'Empanada de Carne',
    description: 'Clásica empanada de carne cortada a cuchillo, huevo duro, aceitunas verdes y comino. (Porción x3)',
    price: 5400,
    stock: 30,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-011', name: 'Porción extra (x3)', price: 5400, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-016',
    name: 'Empanada de Pollo',
    description: 'Pollo deshebrado con salsa blanca, morrón, cebolla y un toque de curry suave. (Porción x3)',
    price: 5200,
    stock: 25,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-012', name: 'Porción extra (x3)', price: 5200, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-017',
    name: 'Empanada de Jamón y Queso',
    description: 'Jamón cocido y queso mozzarella fundido, clásica y cremosa. (Porción x3)',
    price: 4800,
    stock: 28,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-013', name: 'Porción extra (x3)', price: 4800, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-018',
    name: 'Empanada de Verdura',
    description: 'Espinaca, acelga, queso blanco, nueces y pasas de uva. (Porción x3)',
    price: 5000,
    stock: 22,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-014', name: 'Porción extra (x3)', price: 5000, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-019',
    name: 'Empanada de Humita',
    description: 'Choclo cremoso, salsa blanca, queso y albahaca fresca. (Porción x3)',
    price: 5200,
    stock: 20,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-015', name: 'Porción extra (x3)', price: 5200, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-020',
    name: 'Empanada Caprese',
    description: 'Tomate, mozzarella fresca, albahaca y reducción de aceto. (Porción x3)',
    price: 5500,
    stock: 18,
    imageUrl: 'https://unsplash.com/photos/gd54Nf3We7k/download?w=400',
    category: 'cat-6',
    categoryName: 'Empanadas',
    available: true,
    additionals: [
      { id: 'add-016', name: 'Porción extra (x3)', price: 5500, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: true,
  },
  // ═══════════════════════════════════════════
  // 🥗 ENSALADAS & SIDES
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-004',
    name: 'Loaded Fries',
    description: 'Papas crujientes con cheddar fundido, bacon, verdeo y crema agria.',
    price: 6500,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    category: 'cat-2',
    categoryName: 'Sides',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-005',
    name: 'Onion Rings',
    description: 'Aros de cebolla empanizados con salsa BBQ ahumada.',
    price: 5500,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
    category: 'cat-2',
    categoryName: 'Sides',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-021',
    name: 'Ensalada Caesar',
    description: 'Lechuga romana, crutones caseros, parmesano en lascas y dressing Caesar original con pollo grillado.',
    price: 7800,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    category: 'cat-2',
    categoryName: 'Sides',
    available: true,
    additionals: [
      { id: 'add-017', name: 'Extra pollo', price: 1200, active: true },
      { id: 'add-018', name: 'Extra crutones', price: 400, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  // ═══════════════════════════════════════════
  // 🥤 DRINKS
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-006',
    name: 'Milkshake',
    description: 'Clásico batido de vainilla con crema y lluvia de chocolate.',
    price: 4800,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    category: 'cat-3',
    categoryName: 'Drinks',
    available: true,
    additionals: [
      { id: 'add-019', name: 'Con brownie', price: 1200, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-007',
    name: 'Craft Beer',
    description: 'IPA artesanal 473ml, amarga y refrescante.',
    price: 5200,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
    category: 'cat-3',
    categoryName: 'Drinks',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-023',
    name: 'Gaseosa',
    description: 'Gaseosa Coca-Cola 500ml. Consultá variedad (Sprite, Fanta) con el mozo.',
    price: 2200,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    category: 'cat-3',
    categoryName: 'Drinks',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-024',
    name: 'Agua Saborizada',
    description: 'Agua saborizada natural de limón y menta 500ml.',
    price: 2000,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400',
    category: 'cat-3',
    categoryName: 'Drinks',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-025',
    name: 'Limonada',
    description: 'Limonada natural con hierbabuena y jengibre 500ml.',
    price: 2500,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    category: 'cat-3',
    categoryName: 'Drinks',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  // ═══════════════════════════════════════════
  // 🍰 DESSERTS
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-008',
    name: 'Brownie Sunday',
    description: 'Brownie de chocolate caliente con bocha de helado de crema y dulce de leche.',
    price: 6200,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    category: 'cat-4',
    categoryName: 'Desserts',
    available: true,
    additionals: [
      { id: 'add-020', name: 'Helado extra', price: 800, active: true },
      { id: 'add-021', name: 'Dulce de leche extra', price: 500, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-027',
    name: 'Flan Casero',
    description: 'Flan casero con crema y dulce de leche.',
    price: 4800,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
    category: 'cat-4',
    categoryName: 'Desserts',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-028',
    name: 'Cheesecake',
    description: 'Cheesecake de maracuyá con base de galletitas y salsa de frutos rojos.',
    price: 5800,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400',
    category: 'cat-4',
    categoryName: 'Desserts',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
  // ═══════════════════════════════════════════
  // 🔥 COMBOS
  // ═══════════════════════════════════════════
  {
    id: 'mock-prod-030',
    name: 'Combo Clásico',
    description: 'Classic Burger + Papas Fritas + Bebida (Milkshake o Gaseosa). El combo más elegido.',
    price: 13500,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    category: 'cat-7',
    categoryName: 'Combos',
    available: true,
    additionals: [
      { id: 'add-022', name: 'Aros de Cebolla extra', price: 1500, active: true },
    ],
    garnishes: [],
    isDishOfTheDay: false,
  },
  {
    id: 'mock-prod-032',
    name: 'Combo Familiar',
    description: '2 Doble Cheese + 2 Papas Grandes + 4 Bebidas + 4 Brownies. Para toda la familia.',
    price: 38000,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    category: 'cat-7',
    categoryName: 'Combos',
    available: true,
    additionals: [],
    garnishes: [],
    isDishOfTheDay: false,
  },
];

// --- DEMO CATEGORIES ---
const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Burgers', active: true, icon: '🍔' },
  { id: 'cat-5', name: 'Mexican', active: true, icon: '🌮' },
  { id: 'cat-6', name: 'Empanadas', active: true, icon: '🥟' },
  { id: 'cat-2', name: 'Sides', active: true, icon: '🥗' },
  { id: 'cat-3', name: 'Drinks', active: true, icon: '🥤' },
  { id: 'cat-4', name: 'Desserts', active: true, icon: '🍰' },
  { id: 'cat-7', name: 'Combos', active: true, icon: '🔥' },
];

// --- DEMO USERS ---
const DEMO_USERS = [
  {
    id: 'demo-admin-1',
    email: 'admin',
    firstName: 'Admin',
    lastName: 'Demo',
    role: 'ADMIN' as const,
    token: 'demo-jwt-admin-2026',
    phone: '555-0100',
    address: 'Av. Siempre Viva 123, CABA',
  },
  {
    id: 'demo-client-1',
    email: 'cliente',
    firstName: 'Cliente',
    lastName: 'Demo',
    role: 'USER' as const,
    token: 'demo-jwt-cliente-2026',
    phone: '1122223333',
    address: 'Calle Falsa 456, CABA',
  },
];

// --- HELPER FUNCTIONS ---
function generateOrderNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDemoProduct(overrides?: Partial<Product>): Product {
  const base = randomPick(DEMO_PRODUCTS);
  return { ...base, ...overrides };
}

export function generateDemoOrder(): OrderResponse {
  const now = new Date();
  const items = [];
  const numItems = randomInt(1, 3);

  for (let i = 0; i < numItems; i++) {
    const product = generateDemoProduct();
    const qty = randomInt(1, 3);
    const selectedAdds = product.additionals.filter(() => Math.random() > 0.5);
    items.push({
      productName: product.name,
      unitPrice: product.price,
      quantity: qty,
      subtotal: product.price * qty + selectedAdds.reduce((s, a) => s + a.price * qty, 0),
      additionals: selectedAdds.map(a => ({ name: a.name, price: a.price })),
      garnishes: product.garnishes?.filter(() => Math.random() > 0.6).map(g => ({ name: g.name })) || [],
    });
  }

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const clientNames = ['Juan Pérez', 'María López', 'Carlos García', 'Ana Martínez', 'Pedro Rodríguez'];
  const clientName = randomPick(clientNames);

  return {
    id: crypto.randomUUID(),
    number: generateOrderNumber(),
    userId: 'demo-client-1',
    userName: clientName,
    userLastname: clientName.split(' ')[1] || '',
    userPhone: '555-' + String(randomInt(1000, 9999)),
    items,
    total,
    deliveryAddress: Math.random() > 0.5 ? `Calle ${randomInt(100, 9999)}, CABA` : '',
    status: ORDER_STATUS.TO_PRINT,
    createdAt: now.toISOString(),
  };
}

export { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_USERS };