import { Order } from '../aggregate/root';

export interface IOrderRepository {

    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findAll(): Promise<Order[]>;
    delete(id: string): Promise<void>;
    
}
