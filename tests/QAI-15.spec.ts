import { test, expect } from '@playwright/test';
import {
  readResponseBody,
  recordAdditionalResponse,
  requirePetId,
  withExecutionEvidence,
} from '../utils/api-test-evidence';

test('update an existing pet status with PUT /pet', async ({ request }) => {
  await withExecutionEvidence('PUT-result.json', 'PUT /pet', async (evidence) => {
    const petId = Math.floor(Math.random() * 100000);
    const pet = {
      id: petId,
      name: `QAI-15-Pet-${petId}`,
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

    const updatedPet = {
      id: storedPetId,
      name: pet.name,
      status: 'sold',
    };
    const updateResponse = await request.put('https://petstore.swagger.io/v2/pet', {
      data: updatedPet,
    });
    evidence.statusCode = updateResponse.status();
    evidence.responseBody = await readResponseBody(updateResponse);

    expect(updateResponse.status()).toBe(200);
    expect(evidence.responseBody).toMatchObject({
      id: storedPetId,
      status: 'sold',
    });

    const verificationResponse = await request.get(
      `https://petstore.swagger.io/v2/pet/${storedPetId}`,
    );
    const verificationBody = await readResponseBody(verificationResponse);
    recordAdditionalResponse(
      evidence,
      'GET /pet/{id}',
      verificationResponse.status(),
      verificationBody,
    );

    expect(verificationResponse.status()).toBe(200);
    expect(verificationBody).not.toBeNull();
    expect(verificationBody).toMatchObject({
      id: storedPetId,
      status: 'sold',
    });
  });
});
