import { test, expect } from '@playwright/test';
import { withExecutionEvidence, readResponseBody } from '../utils/api-test-evidence';

test('create a new pet with POST /pet', async ({ request }) => {
  await withExecutionEvidence('POST-result.json', 'POST /pet', async (evidence) => {
    const petId = Math.floor(Math.random() * 100000);
    const pet = {
      id: petId,
      name: `QAI-13-Pet-${petId}`,
      status: 'available',
    };
    evidence.petId = petId;

    const response = await request.post('https://petstore.swagger.io/v2/pet', {
      data: pet,
    });
    evidence.statusCode = response.status();
    evidence.responseBody = await readResponseBody(response);

    expect(response.status()).toBe(200);
    expect(evidence.responseBody).toMatchObject(pet);
  });
});
