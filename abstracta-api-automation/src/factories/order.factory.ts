import { Order } from '../models/order.model';

function randomOrderId(): number {
  return Math.floor(Math.random() * 10) + 1; // Petstore GET only supports IDs 1–10
}

export class OrderFactory {
  static build(overrides: Partial<Order> = {}): Order {
    const id = overrides.id ?? randomOrderId();
    return {
      id,
      petId: 0,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
      ...overrides,
    };
  }
}

