import { UserDTO } from '../DB';

export const userDTOTypeGuard = (data: unknown): data is UserDTO => {
  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    'username' in data &&
    typeof data.username === 'string' &&
    'age' in data &&
    typeof data.age === 'number' &&
    'hobbies' in data &&
    Array.isArray(data.hobbies) &&
    data.hobbies.every((value) => typeof value === 'string')
  ) {
    return true;
  }

  return false;
};
