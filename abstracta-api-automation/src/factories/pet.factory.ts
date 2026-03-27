import { Pet, PetStatus } from '../models/pet.model';

function randomSafeId(): number {
  return Math.floor(Math.random() * 900_000_000) + 100_000_000;
}

export class PetFactory {
  static build(overrides: Partial<Pet> = {}): Pet {
    const id = overrides.id ?? randomSafeId();
    return {
      id,
      name: `PerfDog-${id}`,
      category: { id: 1, name: 'Dogs' },
      photoUrls: ['https://example.com/photo.jpg'],
      tags: [{ id: 1, name: 'test' }],
      status: 'available' as PetStatus,
      ...overrides,
    };
  }

  static buildMany(statuses: PetStatus[]): Pet[] {
    return statuses.map((status) => PetFactory.build({ status }));
  }
}

