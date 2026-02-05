export interface IUserService {

  createUser(data: { email: string; password: string }): Promise<{ id: string }>

  findByEmail(email: string, withPassword?: boolean): Promise< Object  | null>;

}

