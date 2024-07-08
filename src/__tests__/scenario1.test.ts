import supertest from 'supertest';
import { app } from '../index';

const ENDPOINT = '/api/users';

const MOCK_USER = {
  username: 'The One',
  age: 777,
  hobbies: ['eat', 'drink', 'do exterminatus'],
};

const NEW_MOCK_USER = {
  username: 'Master Gervant',
  age: 117,
  hobbies: ['gwint', 'Gwint', 'GWINT!'],
};

let mockUserId: null | string = null;

describe('Scenario №1 - Base functional', () => {
  afterAll(() => {
    app.server.close();
  });

  test('Create user', async () => {
    await supertest(app.server)
      .post(ENDPOINT)
      .send(MOCK_USER)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .then((res) => {
        const createdUser = res.body;
        expect(createdUser.username).toBe(MOCK_USER.username);
        expect(createdUser.age).toBe(MOCK_USER.age);
        expect(createdUser.hobbies).toStrictEqual(MOCK_USER.hobbies);
        expect(createdUser.id).toBeTruthy();
        mockUserId = createdUser.id;
      });
  });

  test('Get created user', async () => {
    await supertest(app.server)
      .get(`${ENDPOINT}/${mockUserId}`)
      .expect(200)
      .then((res) => {
        const user = res.body;
        expect(user.username).toBe(MOCK_USER.username);
        expect(user.age).toBe(MOCK_USER.age);
        expect(user.hobbies).toStrictEqual(MOCK_USER.hobbies);
        expect(user.id).toBeTruthy();
      });
  });

  test('Get all users', async () => {
    for (let i = 0; i < 3; i++) {
      await supertest(app.server)
        .post(ENDPOINT)
        .send(MOCK_USER)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
    }

    await supertest(app.server)
      .get(ENDPOINT)
      .expect(200)
      .then((res) => {
        const users = res.body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
      });
  });

  test('Update user', async () => {
    await supertest(app.server)
      .put(`${ENDPOINT}/${mockUserId}`)
      .send(NEW_MOCK_USER)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        const updatedUser = res.body;
        expect(updatedUser.username).toBe(NEW_MOCK_USER.username);
        expect(updatedUser.age).toBe(NEW_MOCK_USER.age);
        expect(updatedUser.hobbies).toStrictEqual(NEW_MOCK_USER.hobbies);
        expect(updatedUser.id).toBe(mockUserId);
      });

    await supertest(app.server)
      .get(`${ENDPOINT}/${mockUserId}`)
      .expect(200)
      .then((res) => {
        const user = res.body;
        expect(user.username).toBe(NEW_MOCK_USER.username);
        expect(user.age).toBe(NEW_MOCK_USER.age);
        expect(user.hobbies).toStrictEqual(NEW_MOCK_USER.hobbies);
        expect(user.id).toBeTruthy();
      });
  });

  test('Delete user', async () => {
    await supertest(app.server).delete(`${ENDPOINT}/${mockUserId}`).expect(204);

    await supertest(app.server)
      .get(ENDPOINT)
      .expect(200)
      .then((res) => {
        const users = res.body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(3);
        expect(
          users.findIndex((item: { id: string }) => item.id === mockUserId)
        ).toBe(-1);
      });
  });
});
