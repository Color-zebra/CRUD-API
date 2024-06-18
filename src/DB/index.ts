export type UserDTO = {
  username: string;
  age: string;
  hobbies: string[];
};

export type User = UserDTO & {
  id: string;
};

export const DB: User[] = [];
