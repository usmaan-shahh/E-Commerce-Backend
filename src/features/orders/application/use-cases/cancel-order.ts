import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { IOrderRepository } from "../../domain/interface/order-interface";
import { OrderEvents } from "../../domain/events/order.events";
import { OrderCancelledEvent } from "../../domain/events/order-cancelled.event";

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(orderId: string) {

    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    try {
      order.cancel(); // Aggregate Rule
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepository.save(order);

    // Publish domain events
    for (const event of order.pullDomainEvents()) {
      if (event instanceof OrderCancelledEvent) {
        this.eventEmitter.emit(OrderEvents.OrderCancelled, event);
      }
    }

    return { status: 'CANCELLED' };
  }
}
