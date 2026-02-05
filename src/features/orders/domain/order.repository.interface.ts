import { Order } from '../domain/aggregate-root';

/**
 * Repository interface for Order - defines the contract for persistence
 * This stays in the domain layer to follow DDD principles
 */
export interface IOrderRepository {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findAll(): Promise<Order[]>;
    delete(id: string): Promise<void>;
}
