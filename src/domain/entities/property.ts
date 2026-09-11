import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  private readonly bookings: Booking[] = []
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly maxGuests: number,
    private readonly basePricePerNight: number
  ) {

    if (!name) {
      throw new Error('O nome é obrigatório');
    }
    if (maxGuests <= 0) {
      throw new Error('O número máximo de hóspedes deve ser maior que zero');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getPricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestCount(guests: number): void {
    if (guests > this.maxGuests) {
      throw new Error(`Número máximo de hóspedes excedido. O máximo permitido é ${this.maxGuests}.`);
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      totalPrice *= 0.9; // Aplica desconto de 10%
    }
    
    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) => 
        booking.getStatus() === 'CONFIRMED' &&
        booking.getDateRange().overlaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }
}