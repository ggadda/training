import { APIRequestContext } from '@playwright/test';
import { Pet, PetStatus } from '../models/pet.model';

export class PetApi {
  constructor(private readonly request: APIRequestContext) {}

  async create(pet: Omit<Pet, 'id'> & { id?: number }) {
    return this.request.post('./pet', { data: pet });
  }

  async getById(petId: number) {
    return this.request.get(`./pet/${petId}`);
  }

  async findByStatus(status: PetStatus) {
    return this.request.get('./pet/findByStatus', { params: { status } });
  }

  async update(pet: Pet) {
    return this.request.put('./pet', { data: pet });
  }

  async delete(petId: number) {
    return this.request.delete(`./pet/${petId}`);
  }
}

