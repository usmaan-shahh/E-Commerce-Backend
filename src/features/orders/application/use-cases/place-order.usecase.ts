import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from '../../domain/aggregate/root';
import { Money } from '../../domain/value-objects/money-vo';
import { Quantity } from '../../domain/value-objects/quatity-vo';
import type { IOrderRepository } from '../../domain/interface/order-interface';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepo: any, // Replace with actual interface
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(input: { productId: string; qty: number }) {
    // 1. Validate product exists and get price from server
    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new NotFoundException('Product not found');

    // 2. Validate quantity and check stock
    const quantity = Quantity.validate(input.qty);
    if (product.stock < quantity.getValue()) {
      throw new BadRequestException('Out of stock');
    }

    // 3. Create order (domain event is recorded here)
    const price = Money.validate(product.price);
    const order = Order.create(input.productId, quantity, price);

    // 4. Update stock and save
    product.stock -= quantity.getValue();
    await this.productRepo.save(product);
    await this.orderRepo.save(order);

    // 5. Publish domain events from application layer
    for (const event of order.pullDomainEvents()) {
      this.eventEmitter.emit(event.constructor.name, event);
    }

    return { orderId: order.toPrimitives().id };
  }
}
