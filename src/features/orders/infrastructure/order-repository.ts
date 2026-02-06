import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../domain/aggregate/root';
import { IOrderRepository } from '../domain/interface/order-interface';
import { OrderEntity } from './order-entity';
import { OrderMapper } from './order-mapper';

@Injectable()
export class OrderRepository implements IOrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }

    async save(order: Order): Promise<Order> {
        const entity = OrderMapper.toPersistence(order);
        const savedEntity = await this.orderRepository.save(entity);
        return OrderMapper.toDomain(savedEntity);
    }

    async findById(id: string): Promise<Order | null> {
        const entity = await this.orderRepository.findOne({ where: { id } });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<Order[]> {
        const entities = await this.orderRepository.find();
        return entities.map((entity) => OrderMapper.toDomain(entity));
    }

    async delete(id: string): Promise<void> {
        await this.orderRepository.delete(id);
    }
}
