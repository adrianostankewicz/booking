import { Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { BookingMapper } from "../persistence/mappers/booking_mapper";
import { BookingEntity } from "../persistence/entities/booking_entity";

export class TypeORMBookingRepository implements BookingRepository {
  private readonly repository: Repository<BookingEntity>;

  constructor(repository: Repository<BookingEntity>) {
    this.repository = repository;
  }
  
  async save(booking: Booking): Promise<void> {
    const bookingEntity = BookingMapper.toPersistence(booking);
    await this.repository.save(bookingEntity);
  }

  async findById(id: string): Promise<Booking | null> {
    const bookingEntity = await this.repository.findOne({ where: { id }, relations: { property: true, guest: true }});
    return bookingEntity ? BookingMapper.toDomain(bookingEntity) : null;
  }
}