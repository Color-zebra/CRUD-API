import supertest from 'supertest';
import { app } from '../index';
import { UserDTO } from '../DB';

const ENDPOINT = '/api/users';

const INVALID_REQUEST_BODIES: Array<{
  username: string | number | null | undefined;
  age: string | number | null | undefined;
  hobbies:
    | string
    | number
    | null
    | undefined
    | Array<string | number | null | undefined>;
}> = [
  {
    username: 123,
    age: 777,
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
  {
    username: null,
    age: 777,
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
  {
    username: undefined,
    age: 777,
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
  {
    username: 'The One',
    age: '777',
    hobbies: null,
  },
  {
    username: 'The One',
    age: 777,
    hobbies: [123, null, undefined],
  },
];

const REQUESTS_WITHOUT_REQUIRED_FIELDS: Array<Partial<UserDTO>> = [
  {
    username: 'The One',
    age: 777,
  },
  {
    username: 'The One',
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
  {
    age: 777,
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
  {
    username: 'The One',
  },
  {
    age: 777,
  },
  {
    hobbies: ['eat', 'drink', 'do exterminatus'],
  },
];

const invalidJSON = `{
  'username': 'Master Gervant',
  'age': 117,
  'hobbies: ['gwint', 'Gwint', 'GWINT!'],
}`;

describe('Scenario №2 - Invalid requests', () => {
  afterAll(() => {
    app.server.close();
  });

  test('Requests with invalid fields', async () => {
    for (const item of INVALID_REQUEST_BODIES) {
      await supertest(app.server)
        .post(ENDPOINT)
        .send(item)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400);
    }
  });

  test('Requests with JSON with invalid syntax', async () => {
    await supertest(app.server)
      .post(ENDPOINT)
      .send(invalidJSON)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        const msg = res.text;
        expect(msg).toBe('Incorrect JSON');
      });
  });

  test('Requests without required fields', async () => {
    for (const item of REQUESTS_WITHOUT_REQUIRED_FIELDS) {
      await supertest(app.server)
        .post(ENDPOINT)
        .send(item)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400);
    }
  });

  test('Requests with invalid uuid', async () => {
    const INVALID_UUID_MESSAGE = 'Invalid user ID';
    await supertest(app.server)
      .get(`${ENDPOINT}/bad-uuid`)
      .expect(400)
      .then((res) => {
        expect(res.text).toBe(INVALID_UUID_MESSAGE);
      });
  });
});
