import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, delay } from 'rxjs';
import { DemoService } from './demo.service';
import { API_CONFIG } from '../config/api.config';
import { DEMO_USERS } from './mock-data';
import { Product, Category } from '../models/types';

/**
 * Demo HTTP interceptor.
 * When running in demo mode, intercepts all API calls and returns
 * realistic mock responses, eliminating the need for a running backend.
 *
 * For CRUD operations (menu, categories), the interceptor mutates the
 * DemoService signals so that subsequent GET calls reflect changes.
 */
export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const demoService = inject(DemoService);
  const url = req.url.replace(API_CONFIG.baseUrl, '');

  const SIM_DELAY = 80; // ms — simulate minimal network latency (low to keep UI snappy)

  // ──────────────────────────────────────────────
  //  AUTH
  // ──────────────────────────────────────────────

  if (url.includes('/auth/login') && req.method === 'POST') {
    const body = req.body as { email?: string; username?: string; password?: string } | null;
    const email = body?.email || body?.username || '';
    const password = body?.password || '';

    if ((email === 'admin' && password === 'admin') ||
        (email === 'cliente' && password === 'cliente')) {
      const user = demoService.findUser(email)!;
      return of(new HttpResponse({
        status: 200,
        body: { data: user.token }
      })).pipe(delay(SIM_DELAY));
    }
    return of(new HttpResponse({
      status: 401,
      body: { data: null, errors: [{ code: 'PC0006', description: 'Credenciales incorrectas.\n\nDemo:\n  admin / admin\n  cliente / cliente' }] }
    })).pipe(delay(SIM_DELAY));
  }

  if (url.includes('/auth/register') && req.method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { data: { id: 'demo-new-user', email: 'demo@demo.com', role: 'USER' } }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  USERS
  // ──────────────────────────────────────────────

  // GET /user → admin list all
  if ((url === '/user' || url === '/user/') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: { data: DEMO_USERS }
    })).pipe(delay(SIM_DELAY));
  }

  // GET /user/{id}
  const userGetMatch = url.match(/^\/user\/([^/]+)$/);
  if (userGetMatch && req.method === 'GET') {
    const userId = userGetMatch[1];
    const user = DEMO_USERS.find(u => u.id === userId);
    if (user) {
      return of(new HttpResponse({
        status: 200,
        body: {
          data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address || '',
            role: user.role,
          }
        }
      })).pipe(delay(SIM_DELAY));
    }
    return of(new HttpResponse({
      status: 200,
      body: {
        data: {
          id: userId,
          email: 'usuario@demo.com',
          firstName: 'Usuario',
          lastName: 'Demo',
          phone: '555-0000',
          role: 'USER'
        }
      }
    })).pipe(delay(SIM_DELAY));
  }

  // PATCH /user/{id} — profile update
  if (userGetMatch && req.method === 'PATCH') {
    const body: any = req.body;
    return of(new HttpResponse({
      status: 200,
      body: {
        data: {
          id: userGetMatch[1],
          email: body.email || 'usuario@demo.com',
          firstName: body.firstName || 'Usuario',
          lastName: body.lastName || 'Demo',
          phone: body.phone || '555-0000',
          address: body.address || '',
          role: body.role || 'USER',
        }
      }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  MENU  (reads from DemoService signals so CRUD is reflected)
  // ──────────────────────────────────────────────

  // GET /menu (list all products)
  if ((url === '/menu' || url === '/menu/') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: { data: demoService.products() }
    })).pipe(delay(SIM_DELAY));
  }

  // GET /menu/{id}
  const menuIdMatch = url.match(/^\/menu\/([^/]+)$/);
  if (menuIdMatch && req.method === 'GET') {
    const product = demoService.products().find(p => p.id === menuIdMatch[1]);
    if (product) {
      return of(new HttpResponse({
        status: 200,
        body: { data: product }
      })).pipe(delay(SIM_DELAY));
    }
  }

  // POST /menu/create-product
  if (url.includes('/menu/create-product') && req.method === 'POST') {
    const body: any = req.body;
    const newProduct: Product = {
      id: 'demo-' + crypto.randomUUID().slice(0, 8),
      name: body.name || 'Producto Demo',
      description: body.description || '',
      price: body.price || 0,
      stock: body.stock ?? 100,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      category: body.categoryId || body.category || 'uncategorized',
      categoryName: '',
      available: body.available !== undefined ? body.available : true,
      additionals: body.additionals || [],
      garnishes: body.garnishes || [],
      isDishOfTheDay: body.dishOfTheDay || body.isDishOfTheDay || false,
    };
    // Push into demo service so GET /menu reflects it
    demoService.products.update(list => [...list, newProduct]);
    return of(new HttpResponse({
      status: 200,
      body: { data: newProduct, message: 'Producto creado exitosamente' }
    })).pipe(delay(SIM_DELAY));
  }

  // PATCH /menu/update-product/{id}
  const updateMenuMatch = url.match(/\/menu\/update-product\/([^/]+)/);
  if (updateMenuMatch && req.method === 'PATCH') {
    const productId = updateMenuMatch[1];
    const body: any = req.body;
    demoService.products.update(list =>
      list.map(p =>
        p.id === productId
          ? { ...p, ...body, category: body.categoryId || body.category || p.category, isDishOfTheDay: body.dishOfTheDay ?? body.isDishOfTheDay ?? p.isDishOfTheDay }
          : p
      )
    );
    const updated = demoService.products().find(p => p.id === productId);
    return of(new HttpResponse({
      status: 200,
      body: { data: updated || null, message: 'Producto actualizado' }
    })).pipe(delay(SIM_DELAY));
  }

  // DELETE /menu/delete-product/{id}
  const deleteMenuMatch = url.match(/\/menu\/delete-product\/([^/]+)/);
  if (deleteMenuMatch && req.method === 'DELETE') {
    const productId = deleteMenuMatch[1];
    demoService.products.update(list => list.filter(p => p.id !== productId));
    return of(new HttpResponse({
      status: 200,
      body: { data: null, message: 'Producto eliminado' }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  CATEGORIES
  // ──────────────────────────────────────────────

  // GET /categories (or /menu/categories)
  if (url.includes('/categories') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: { data: demoService.categories() }
    })).pipe(delay(SIM_DELAY));
  }

  // POST /menu/create-category
  if (url.includes('/menu/create-category') && req.method === 'POST') {
    const body: any = req.body;
    const newCat: Category = {
      id: 'demo-cat-' + crypto.randomUUID().slice(0, 6),
      name: body.name || 'Nueva Categoría',
      active: true,
      icon: body.icon || '🍽️',
    };
    demoService.categories.update(list => [...list, newCat]);
    return of(new HttpResponse({
      status: 200,
      body: { data: newCat, message: 'Categoría creada' }
    })).pipe(delay(SIM_DELAY));
  }

  // PATCH /menu/update-category/{id}
  const updateCatMatch = url.match(/\/menu\/update-category\/([^/]+)/);
  if (updateCatMatch && req.method === 'PATCH') {
    const catId = updateCatMatch[1];
    const body: any = req.body;
    demoService.categories.update(list =>
      list.map(c => c.id === catId ? { ...c, name: body.name || c.name } : c)
    );
    return of(new HttpResponse({
      status: 200,
      body: { data: null, message: 'Categoría actualizada' }
    })).pipe(delay(SIM_DELAY));
  }

  // DELETE /menu/delete-category/{id}
  const deleteCatMatch = url.match(/\/menu\/delete-category\/([^/]+)/);
  if (deleteCatMatch && req.method === 'DELETE') {
    const catId = deleteCatMatch[1];
    demoService.categories.update(list => list.filter(c => c.id !== catId));
    return of(new HttpResponse({
      status: 200,
      body: { data: null, message: 'Categoría eliminada' }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  GARNISHES
  // ──────────────────────────────────────────────

  if (url.includes('/garnishes')) {
    const allGarnishes = demoService.products()
      .flatMap(p => p.garnishes || [])
      .filter((g, i, arr) => arr.findIndex(x => x.id === g.id) === i);
    return of(new HttpResponse({
      status: 200,
      body: { data: allGarnishes }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  ORDERS
  // ──────────────────────────────────────────────

  // POST /order/create-order
  if (url.includes('/order/create-order') && req.method === 'POST') {
    const order = demoService.generateOrder();
    return of(new HttpResponse({
      status: 200,
      body: { data: order, message: 'Orden creada exitosamente' }
    })).pipe(delay(SIM_DELAY));
  }

  // POST /order/update-status/{orderId}
  const statusMatch = url.match(/\/order\/update-status\/([^/]+)/);
  if (statusMatch && req.method === 'POST') {
    const orderId = statusMatch[1];
    demoService.toggleOrderStatus(orderId);
    const order = demoService.orders().find(o => o.id === orderId);
    return of(new HttpResponse({
      status: 200,
      body: { data: order || null }
    })).pipe(delay(SIM_DELAY));
  }

  // GET /order/user-orders/{userId}
  const userOrdersMatch = url.match(/\/order\/user-orders\/([^/]+)/);
  if (userOrdersMatch && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        data: {
          content: demoService.orders().slice(0, 10),
          totalElements: demoService.orders().length,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true,
          empty: demoService.orders().length === 0,
        }
      }
    })).pipe(delay(SIM_DELAY));
  }

  // GET /order/ — admin list all orders
  if ((url === '/order' || url === '/order/') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        data: {
          content: demoService.orders(),
          totalElements: demoService.orders().length,
          totalPages: 1,
          size: 50,
          number: 0,
          first: true,
          last: true,
          empty: demoService.orders().length === 0,
        }
      }
    })).pipe(delay(SIM_DELAY));
  }

  // ──────────────────────────────────────────────
  //  PASSWORD RESET
  // ──────────────────────────────────────────────

  if (url.includes('/password/forgot-password') && req.method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { data: null, message: 'Si el email existe, recibirás un correo' }
    })).pipe(delay(500));
  }

  if (url.includes('/password/reset-password') && req.method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { data: null, message: 'Contraseña actualizada exitosamente' }
    })).pipe(delay(500));
  }

  // Fallback: passthrough
  return next(req);
};
