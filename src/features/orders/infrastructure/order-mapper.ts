import { Order } from '../domain/aggregate/root';
import { OrderEntity } from './order-entity';

export class OrderMapper {

    //toPersistence converts Domain Entity to Database ORM Entity
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

    //Mapper converts Database ORM Entity to Domain Entity
    static toDomain(entity: OrderEntity): Order {
        return Order.fromPrimitives(
            {
                id: entity.id,
                productId: entity.productId,
                quantity: entity.quantity,
                total: entity.total,
                status: entity.status,
            });
    }

}
