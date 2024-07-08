export type UserDTO = {
  username: string;
  age: number;
  hobbies: string[];
};

export type User = UserDTO & {
  id: string;
};

export const DB: User[] = [
  // {
  //   age: '5',
  //   hobbies: ['drink', 'eat'],
  //   username: 'Booba',
  //   id: 'd930f89e-441e-482c-ac37-26bb95b9e0dd',
  // },
  // {
  //   age: '5',
  //   hobbies: ['drink', 'eat'],
  //   username: 'Booba',
  //   id: 'a90e10d0-56c8-4201-9d12-853a6270bb86',
  // },
  // {
  //   age: '5',
  //   hobbies: ['drink', 'eat'],
  //   username: 'Booba',
  //   id: 'a61cf6aa-afeb-4b0f-a79f-4ae7eef2ea9d',
  // },
];
