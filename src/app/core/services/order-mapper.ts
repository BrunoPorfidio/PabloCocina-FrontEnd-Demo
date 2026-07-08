import { OrderResponse } from '../models/types';

/**
 * Normalizes an OrderResponse from backend into a consistent client-side shape.
 *
 * Handles three data-source layouts:
 * 1. New backend — fields on the root object (userName, userPhone, etc.)
 * 2. Legacy frontend snapshot — nested `details` object
 * 3. Old backend — nested `user` relationship
 *
 * Also deduplicates garnishes by ID or name and infers an order number from the
 * first six hex digits of the UUID when no explicit number is provided.
 *
 * @param order Raw order from the API
 * @returns Normalised order ready for the UI
 */
export function mapOrderResponse(order: OrderResponse): OrderResponse {
    // Prioridad de datos:
    // 1. Campos directos del root (Nuevo Backend)
    // 2. Datos en 'details' (Snapshot frontend viejo)
    // 3. Relación User (Legacy)

    let customerName = 'Cliente';
    if (order.userName || order.userLastname) {
        customerName = `${order.userName || ''} ${order.userLastname || ''}`.trim();
    } else if (order.details && order.details.customerName) {
        customerName = order.details.customerName;
    } else if (order.user) {
        customerName = `${order.user.firstName} ${order.user.lastName || ''}`.trim();
    }

    let phone = 'Sin teléfono';
    if (order.userPhone) {
        phone = order.userPhone;
    } else if (order.details && order.details.phone) {
        phone = order.details.phone;
    } else if (order.user && order.user.phone) {
        phone = order.user.phone;
    }

    // Dirección
    const deliveryAddress = order.deliveryAddress || order.details?.address || order.user?.address || '';
    const deliveryType = deliveryAddress ? 'delivery' : 'pickup';

    // Notas y Pago (Siguen viniendo en details o se infieren)
    const notes = order.details?.notes || '';
    const paymentMethod = order.details?.paymentMethod || 'cash';

    // Mapeo y limpieza de Items
    const items = order.items.map(item => {
        // Fix: Deduplicate garnishes by ID or Name to prevent visual clutter
        let uniqueGarnishes = item.garnishes || [];
        if (uniqueGarnishes.length > 0) {
            const seen = new Set();
            uniqueGarnishes = uniqueGarnishes.filter(g => {
                const key = g.id || g.name; // Use ID if available, else Name
                const duplicate = seen.has(key);
                seen.add(key);
                return !duplicate;
            });
        }

        return {
            ...item,
            garnishes: uniqueGarnishes
        };
    });

    return {
        ...order,
        items: items,
        number: typeof order.number === 'number' ? order.number : (parseInt(order.id.substring(0, 6), 16) || 0),
        details: {
            customerName,
            phone,
            deliveryType,
            address: deliveryAddress,
            notes,
            paymentMethod
        }
    };
}
