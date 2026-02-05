export class Money {

  private constructor(private readonly amount: number) { }

  static validate(amount: number) {
    if (amount < 0) throw new Error("Money Cannot be Negative");
    return new Money(amount);
  }

  static create(amount: number) {
    return Money.validate(amount);
  }

  add(other: Money) {
    return new Money(this.amount + other.amount);
  }

  getValue() {
    return this.amount;
  }

}

