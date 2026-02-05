import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IUserService } from '../ports/user-service';
import type { IPasswordHasher } from '../ports/password-hasher';


@Injectable()
export class RegisterUseCase {
    
  constructor(
    @Inject('IUserService') private readonly userServiceInterface: IUserService,
    @Inject('IPasswordHasher') private readonly PasswordHasherInterface: IPasswordHasher
    
  ) {}

  async execute(email: string, password: string) {

    const existing = await this.userServiceInterface.findByEmail(email, true);

    if (existing) throw new ConflictException('Email Already Registered');

    const hashedPassword = this.PasswordHasherInterface.hash(password);

    const user = await this.userServiceInterface.createUser({ email, password: hashedPassword});
   
    return { message: 'User registered successfully. Please Login to continue'};
  }
}
