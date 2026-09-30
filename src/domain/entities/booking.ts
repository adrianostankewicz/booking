import { FullRefund } from "../cancelation/full_refund";
import { PartialRefund } from "../cancelation/partial_refund";
import { RefundRuleFactory } from "../cancelation/refund_rule_factory";
import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly guest: User;
  private readonly dateRange: DateRange;
  private readonly guestsCount: number;
  private totalPrice: number;
  private status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED';

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
      throw new Error('A propriedade não está disponível para o período selecionado.');
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

  getGuestCount(): number {
    return this.guestsCount;
  }

  getGuests(): number {
    return this.guestsCount;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getGuest(): User {
    return this.guest;
  }

  getStatus(): 'CONFIRMED' | 'CANCELLED' {
    return this.status;
  }

  cancel(currentDate: Date): void {
    if (this.status === 'CANCELLED') {
      throw new Error('A reserva já está cancelada');
    }

    const checkInDate = this.dateRange.getStartDate();
    const timeDifference = checkInDate.getTime() - currentDate.getTime();
    const daysUntilCheckIn = timeDifference / (1000 * 3600 * 24);

    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.status = 'CANCELLED';
  }
}