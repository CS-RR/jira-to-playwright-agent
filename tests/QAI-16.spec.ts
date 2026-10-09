import { test, expect } from '@playwright/test';
import {
  readResponseBody,
  recordAdditionalResponse,
  requirePetId,
  withExecutionEvidence,
} from '../utils/api-test-evidence';

test('delete a pet with DELETE /pet/{id} and verify removal', async ({ request }) => {
  await withExecutionEvidence('DELETE-result.json', 'DELETE /pet/{id}', async (evidence) => {
    const petId = Math.floor(Math.random() * 100000);
    const pet = {
      id: petId,
      name: `QAI-16-Pet-${petId}`,
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

    const deleteResponse = await request.delete(
      `https://petstore.swagger.io/v2/pet/${storedPetId}`,
    );
    evidence.statusCode = deleteResponse.status();
    evidence.responseBody = await readResponseBody(deleteResponse);

    expect(deleteResponse.status()).toBe(200);
    expect(JSON.stringify(evidence.responseBody)).toContain(String(storedPetId));

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

    expect(verificationResponse.status()).toBe(404);
    expect(JSON.stringify(verificationBody)).toMatch(/not found/i);
  });
});
