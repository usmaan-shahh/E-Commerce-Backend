type UserSafe = {
  id: string;
  email: string;
};

type UserWithPassword = UserSafe & {
  password: string;
};

export interface IUserService {

  createUser(data: {
    email: string;
    password: string;
  }): Promise<UserSafe>;

  findByEmail(
    email: string,
    withPassword?: boolean,
  ): Promise<UserWithPassword | UserSafe | null>;

}
 