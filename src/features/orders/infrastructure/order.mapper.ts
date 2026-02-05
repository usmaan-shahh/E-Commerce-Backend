import { Order } from '../domain/aggregate-root';
import { OrderEntity } from './order.entity';
import { OrderId } from '../domain/value-objects/orderId-vo';
import { Quantity } from '../domain/value-objects/quatity-vo';
import { Money } from '../domain/value-objects/money-vo';

export class OrderMapper {
    /**
     * Convert domain Order to database OrderEntity
     */
    static toPersistence(order: Order): OrderEntity {
        const primitives = order.toPrimitives();

        const entity = new OrderEntity();
        entity.id = primitives.id;
        entity.productId = primitives.productId;
        entity.quantity = primitives.quantity;
        entity.total = primitives.total;
        entity.status = primitives.status;

        return entity;
    }

    /**
     * Convert database OrderEntity to domain Order
     */
    static toDomain(entity: OrderEntity): Order {
        return Order.fromPrimitives({
            id: entity.id,
            productId: entity.productId,
            quantity: entity.quantity,
            total: entity.total,
            status: entity.status,
        });
    }
}
