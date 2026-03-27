import { test, expect, APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { PetApi } from '../src/api/pet.api';
import { StoreApi } from '../src/api/store.api';
import { PetFactory } from '../src/factories/pet.factory';
import { OrderFactory } from '../src/factories/order.factory';
import { Pet } from '../src/models/pet.model';
import { Order } from '../src/models/order.model';
import { BASE_URL, DEFAULT_HEADERS } from '../src/config';
import { retryRequest } from '../src/utils/retry';

test.describe.serial('Part 2: Available pets and orders', () => {
  let apiContext: APIRequestContext;
  let petApi: PetApi;
  let storeApi: StoreApi;
  let setupPets: Pet[] = [];
  let savedPets: Pet[] = [];
  let createdOrders: Order[] = [];

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: DEFAULT_HEADERS,
    });
    petApi = new PetApi(apiContext);
    storeApi = new StoreApi(apiContext);

    // Create 5 known available pets so the suite is self-contained
    const pets = PetFactory.buildMany(Array(5).fill('available'));
    for (const pet of pets) {
      const res = await petApi.create(pet);
      if (res.status() === 200) setupPets.push(await res.json());
    }
  });

  test.afterAll(async () => {
    for (const order of createdOrders) {
      await storeApi.deleteOrder(order.id).catch(() => {});
    }
    for (const pet of setupPets) {
      await petApi.delete(pet.id).catch(() => {});
    }
    await apiContext.dispose();
  });

  test('List available pets and save 5 of them', async () => {
    const response = await retryRequest(() => petApi.findByStatus('available'));
    expect(response.status()).toBe(200);

    const allAvailable: Pet[] = await response.json();
    expect(Array.isArray(allAvailable)).toBe(true);
    expect(allAvailable.length).toBeGreaterThanOrEqual(5);

    // Filter to pets with valid structure before picking
    const validPets = allAvailable.filter(
      (p) => p.id != null && p.name != null && p.status === 'available',
    );
    expect(validPets.length).toBeGreaterThanOrEqual(5);

    savedPets = validPets.slice(0, 5);
    expect(savedPets).toHaveLength(5);

    for (const pet of savedPets) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet.status).toBe('available');
    }
  });

  test('Create an order for each of the 5 saved pets', async () => {
    expect(savedPets).toHaveLength(5);

    for (const pet of savedPets) {
      const orderData = OrderFactory.build({ petId: pet.id });
      const response = await storeApi.createOrder(orderData);
      expect(response.status()).toBe(200);

      const body: Order = await response.json();
      expect(body.petId).toBe(pet.id);
      expect(body.quantity).toBe(orderData.quantity);
      expect(body.status).toBe('placed');
      expect(body).toHaveProperty('id');

      createdOrders.push(body);
    }

    expect(createdOrders).toHaveLength(5);

    const petIdsInOrders = createdOrders.map((o) => o.petId);
    const petIdsFromSaved = savedPets.map((p) => p.id);
    expect(petIdsInOrders).toEqual(petIdsFromSaved);
  });

  test('Verify each order can be retrieved by ID', async () => {
    const verifiableOrders = createdOrders.filter(
      (o) => o.id >= 1 && o.id <= 10,
    );

    for (const order of verifiableOrders) {
      const response = await storeApi.getOrderById(order.id);
      expect(response.status()).toBe(200);

      const body: Order = await response.json();
      expect(body.id).toBe(order.id);
      expect(body.petId).toBe(order.petId);
    }
  });
});

