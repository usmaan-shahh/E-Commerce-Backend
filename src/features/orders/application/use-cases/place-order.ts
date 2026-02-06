import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from '../../domain/aggregate/root';
import { Money } from '../../domain/value-objects/money-vo';
import { Quantity } from '../../domain/value-objects/quantity-vo';
import type { IOrderRepository } from '../../domain/interface/order-interface';
import { OrderEvents } from '../../domain/events/order.events';
import { OrderCreatedEvent } from '../../domain/events/order-created.event';
//TODO: Impot products when it is implemented

@Injectable()
export class PlaceOrderUseCase {

  constructor(
    @Inject('IOrderRepository')
    private readonly OrderRepositoryInterface: IOrderRepository,
    // TODO: Inject Product Interface  when products feature is implemented
    private readonly eventEmitter: EventEmitter2,

  ) { }

  async execute(input: { productId: string; qty: number }) {

    // TODO: Validate product exists and get price from server when products feature is implemented

    const quantity = Quantity.validate(input.qty);
    // TODO: Check Product Stock from server when products feature is implemented


    // TODO: Get actual price from product repository
    const price = Money.validate(100); // Temporary hardcoded price
    const order = Order.create(input.productId, quantity, price);

    // TODO: update stock and save
    await this.OrderRepositoryInterface.save(order);

    // Publish domain events from application layer
    for (const event of order.pullDomainEvents()) {

      if (event instanceof OrderCreatedEvent) {
        this.eventEmitter.emit(OrderEvents.OrderCreated, event);
      }

    }

    return { orderId: order.toPrimitives().id };

  }
}
