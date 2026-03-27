import { APIRequestContext } from '@playwright/test';
import { Order } from '../models/order.model';

export class StoreApi {
  constructor(private readonly request: APIRequestContext) {}

  async createOrder(order: Omit<Order, 'id'> & { id?: number }) {
    return this.request.post('./store/order', { data: order });
  }

  async getOrderById(orderId: number) {
    return this.request.get(`./store/order/${orderId}`);
  }

  async deleteOrder(orderId: number) {
    return this.request.delete(`./store/order/${orderId}`);
  }

  async getInventory() {
    return this.request.get('./store/inventory');
  }
}

