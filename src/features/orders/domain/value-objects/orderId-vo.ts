import { nanoid } from 'nanoid';

export class OrderId {
  private constructor(private readonly value: string) {}

  static create(id?: string) {
    return new OrderId(id ?? nanoid());
  }

  getValue() {
    return this.value;
  }
}
