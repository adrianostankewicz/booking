import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly guest: User;
  private readonly dateRange: DateRange;
  private readonly guestsCount: number;
  private readonly totalPrice: number;
  private readonly status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED';

  constructor(
    id: string,
    property: Property,
    guest: User,
    dateRange: DateRange,
    guestsCount: number
  ){
    if (guestsCount <= 0) {
      throw new Error('O número de hóspedes deve ser maior que zero');
    }
    property.validateGuestCount(guestsCount);

    if(!property.isAvailable(dateRange)) {
      throw new Error('A propriedade não está disponível para o período selecionado');
    }
    
    this.id = id;
    this.property = property;
    this.guest = guest;
    this.dateRange = dateRange;
    this.guestsCount = guestsCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = 'CONFIRMED';

    this.property.addBooking(this);
  }

  getID(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.guest;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuests(): number {
    return this.guestsCount;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getStatus(): 'CONFIRMED' | 'CANCELLED' {
    return this.status;
  }
}