import { test, expect, APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { PetApi } from '../src/api/pet.api';
import { PetFactory } from '../src/factories/pet.factory';
import { Pet, PetStatus } from '../src/models/pet.model';
import { BASE_URL, DEFAULT_HEADERS } from '../src/config';

test.describe.serial('Part 1: Pet CRUD operations', () => {
  let apiContext: APIRequestContext;
  let petApi: PetApi;
  let createdPets: Pet[] = [];
  let soldPet: Pet;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: DEFAULT_HEADERS,
    });
    petApi = new PetApi(apiContext);
  });

  test.afterAll(async () => {
    for (const pet of createdPets) {
      await petApi.delete(pet.id).catch(() => {});
    }
    await apiContext.dispose();
  });

  test('Create 10 pets: 5 available, 4 pending, 1 sold', async () => {
    const statuses: PetStatus[] = [
      ...Array(5).fill('available'),
      ...Array(4).fill('pending'),
      'sold',
    ];

    const petsToCreate = PetFactory.buildMany(statuses);

    for (const pet of petsToCreate) {
      const response = await petApi.create(pet);
      expect(response.status()).toBe(200);

      const body: Pet = await response.json();
      expect(body.name).toBe(pet.name);
      expect(body.status).toBe(pet.status);
      expect(body.id).toBe(pet.id);
      expect(body.category.name).toBe(pet.category.name);
      expect(body.photoUrls).toEqual(pet.photoUrls);
      expect(body.tags).toHaveLength(pet.tags.length);

      createdPets.push(body);
    }

    expect(createdPets).toHaveLength(10);

    const available = createdPets.filter((p) => p.status === 'available');
    const pending = createdPets.filter((p) => p.status === 'pending');
    const sold = createdPets.filter((p) => p.status === 'sold');
    expect(available).toHaveLength(5);
    expect(pending).toHaveLength(4);
    expect(sold).toHaveLength(1);

    soldPet = sold[0];
  });

  test('Get details of the sold pet', async () => {
    const response = await petApi.getById(soldPet.id);
    expect(response.status()).toBe(200);

    const body: Pet = await response.json();
    expect(body.id).toBe(soldPet.id);
    expect(body.name).toBe(soldPet.name);
    expect(body.status).toBe('sold');
    expect(body.category).toEqual(soldPet.category);
    expect(body.photoUrls).toEqual(soldPet.photoUrls);
    expect(body.tags).toEqual(soldPet.tags);
  });

  test('GET non-existent pet returns 404', async () => {
    const response = await petApi.getById(999_999_999);
    expect(response.status()).toBe(404);
  });

  test('DELETE a pet then GET returns 404', async () => {
    const pet = PetFactory.build({ status: 'available' });
    const createRes = await petApi.create(pet);
    expect(createRes.status()).toBe(200);

    const deleteRes = await petApi.delete(pet.id);
    expect(deleteRes.status()).toBe(200);

    const getRes = await petApi.getById(pet.id);
    expect(getRes.status()).toBe(404);
  });
});

