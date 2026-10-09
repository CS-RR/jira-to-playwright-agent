import { test, expect } from '@playwright/test';
import {
  readResponseBody,
  recordAdditionalResponse,
  requirePetId,
  withExecutionEvidence,
} from '../utils/api-test-evidence';

test('retrieve a created pet by ID with GET /pet/{id}', async ({ request }) => {
  await withExecutionEvidence('GET-result.json', 'GET /pet/{id}', async (evidence) => {
    const petId = Math.floor(Math.random() * 100000);
    const pet = {
      id: petId,
      name: `QAI-14-Pet-${petId}`,
      status: 'available',
    };
    evidence.petId = petId;

    const createResponse = await request.post('https://petstore.swagger.io/v2/pet', {
      data: pet,
    });
    const createBody = await readResponseBody(createResponse);
    recordAdditionalResponse(evidence, 'POST /pet', createResponse.status(), createBody);
    expect(createResponse.status()).toBe(200);

    const storedPetId = requirePetId(createBody);
    evidence.petId = storedPetId;

    const response = await request.get(`https://petstore.swagger.io/v2/pet/${storedPetId}`);
    evidence.statusCode = response.status();
    evidence.responseBody = await readResponseBody(response);

    expect(response.status()).toBe(200);
    expect(evidence.responseBody).not.toBeNull();
    expect(evidence.responseBody).toMatchObject({
      id: storedPetId,
      name: pet.name,
      status: pet.status,
    });
    expect(evidence.responseBody).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        status: expect.any(String),
      }),
    );
  });
});
