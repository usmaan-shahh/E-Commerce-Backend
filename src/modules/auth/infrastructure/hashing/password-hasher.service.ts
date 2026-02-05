import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { IPasswordHasher } from '../../application/ports/password-hasher';

@Injectable()
export class BcryptHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> { return bcrypt.hash(plain, 10)}
  async compare(plain: string, hash: string): Promise<boolean> { return bcrypt.compare(plain, hash)}
}
