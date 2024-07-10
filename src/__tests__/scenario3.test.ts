import supertest from 'supertest';
import { app } from '../index';

const ENDPOINT = '/api/users';

const NON_EXISTING_USER_ID = 'd930f89e-441e-482c-ac37-26bb95b9e0dd';

const MOCK_USER_DATA = {
  username: 'Master Gervant',
  age: 117,
  hobbies: ['gwint', 'Gwint', 'GWINT!'],
};

describe('Scenario №3 - Edge cases', () => {
  afterAll(() => {
    app.server.close();
  });

  test('Getting non-existing user', async () => {
    await supertest(app.server)
      .get(`${ENDPOINT}/${NON_EXISTING_USER_ID}`)
      .expect(404)
      .then((res) => {
        const msg = res.text;
        expect(msg).toBe('No user');
      });
  });

  test('Deleting non-existing user', async () => {
    await supertest(app.server)
      .delete(`${ENDPOINT}/${NON_EXISTING_USER_ID}`)
      .expect(404)
      .then((res) => {
        const msg = res.text;
        expect(msg).toBe('No user');
      });
  });

  test('Updating non-existing user with no body', async () => {
    await supertest(app.server)
      .put(`${ENDPOINT}/${NON_EXISTING_USER_ID}`)
      .expect(400)
      .then((res) => {
        const msg = res.text;
        expect(msg).toBe('Incorrect JSON');
      });
  });

  test('Updating non-existing user with valid body', async () => {
    await supertest(app.server)
      .put(`${ENDPOINT}/${NON_EXISTING_USER_ID}`)
      .send(MOCK_USER_DATA)
      .expect(404)
      .then((res) => {
        const msg = res.text;
        expect(msg).toBe('No user');
      });
  });
});
