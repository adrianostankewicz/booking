import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe('Booking Entity', () => {
  it('deve criar uma instância de Booking com todos os atributos', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 200);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-10'));
    const booking = new Booking('789', property, user, dateRange, 2);

    expect(booking.getID()).toBe('789');
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getGuests()).toBe(2);
  });
});