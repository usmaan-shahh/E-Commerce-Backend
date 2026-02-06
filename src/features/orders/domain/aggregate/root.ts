import { Money } from "../value-objects/money-vo";
import { OrderId } from "../value-objects/orderId-vo";
import { Quantity } from "../value-objects/quatity-vo";
import { OrderCreatedEvent } from "../events/order-created.event";


export type OrderStatus = "CREATED" | "PAID" | "CANCELLED";

export class Order {
  private status: OrderStatus = 'CREATED';
  private domainEvents: any[] = [];

  private constructor(
    private readonly id: OrderId,
    private readonly productId: string,
    private readonly quantity: Quantity,
    private total: Money,
  ) { }

  private recordEvent(event: any) {
    this.domainEvents.push(event);
  }

  pullDomainEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  /* To create an Order, you must give me a productId, quantity, and unit price.
I  will calculate the total safely and generate an OrderId for you */
  static create(productId: string, quantity: Quantity, price: Money) {
    const total = Money.validate(price.getValue() * quantity.getValue());
    const order = new Order(OrderId.create(), productId, quantity, total);

    // Record domain event
    order.recordEvent(
      new OrderCreatedEvent(
        order.id.getValue(),
        order.productId,
        order.quantity.getValue(),
        order.total.getValue(),
      )
    );

    return order;
  }

  markPaid() {
    if (this.status !== 'CREATED') {
      throw new Error('Only created orders can be paid');
    }
    this.status = 'PAID';
  }

  cancel() {
    if (this.status === 'PAID') {
      throw new Error('Paid orders cannot be cancelled');
    }
    this.status = 'CANCELLED';
  }

  toPrimitives() {
    return {
      id: this.id.getValue(),
      productId: this.productId,
      quantity: this.quantity.getValue(),
      total: this.total.getValue(),
      status: this.status,
    };
  }

  static fromPrimitives(row: {
    id: string;
    productId: string;
    quantity: number;
    total: number;
    status: OrderStatus;
  }) {
    const order = new Order(
      OrderId.create(row.id),
      row.productId,
      Quantity.create(row.quantity),
      Money.create(row.total),
    );
    order.status = row.status;
    return order;
  }
}
