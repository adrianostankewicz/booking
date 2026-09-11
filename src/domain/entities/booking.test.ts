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

  it('deve lançar um erro se o número de hóspedes for zero ou negativo', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 5, 150);
    const user = new User("1", "João");
    const dateRange = new DateRange(new Date('2026-08-10'), new Date('2026-08-15'));
    
    expect(() => {
      new Booking("1", property, user, dateRange, 0);
    }).toThrow('O número de hóspedes deve ser maior que zero');
  });

  it('deve lançar um erro ao tentar reservar com número de hóspedes acima do máximo permitido', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 4, 150);
    const user = new User("1", "João");
    const dateRange = new DateRange(new Date('2026-08-10'), new Date('2026-08-15'));
    
    expect(() => {
      new Booking("1", property, user, dateRange, 5);
    }).toThrow('Número máximo de hóspedes excedido. O máximo permitido é 4.');
  });

  it('deve calcular o preço total com desconto', () => {
    //Arrange
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-10'));

    //Act
    const booking = new Booking('789', property, user, dateRange, 4);

    //Assert
    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9); // 300 * 9 dias = 2700, com desconto de 10% aplicado
  });

  it('não deve realizar um agendamento, quando uma propriedade não estiver disponível', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-10'));

    const booking = new Booking('789', property, user, dateRange, 4);
    const dateRange2 = new DateRange(new Date('2024-07-02'), new Date('2024-07-11'));

    expect(() => {
      new Booking("790", property, user, dateRange2, 4);
    }).toThrow('A propriedade não está disponível para o período selecionado');
  });

  it('deve cancelar uma reserva sem reembolso quando faltam menos de 1 dia para o check-in', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-22'));

    const booking = new Booking('789', property, user, dateRange, 4);

    const currentDate = new Date('2024-07-20');
    booking.cancel(currentDate);
    
    expect(booking.getStatus()).toBe('CANCELLED');
    expect(booking.getTotalPrice()).toBe(600);
  });

  it('deve cancelar uma reserva com reembolso total quando a data for superior a 7 dias antes do check-in', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-25'));

    const booking = new Booking('789', property, user, dateRange, 4);

    const currentDate = new Date('2024-07-10');
    booking.cancel(currentDate);
    
    expect(booking.getStatus()).toBe('CANCELLED');
    expect(booking.getTotalPrice()).toBe(0);
  });

  it('deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 a 7 dias antes do check-in', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-25'));

    const booking = new Booking('789', property, user, dateRange, 4);

    const currentDate = new Date('2024-07-15');
    booking.cancel(currentDate);
    
    expect(booking.getStatus()).toBe('CANCELLED');
    expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
  });

  it('não deve permitir cancelar a mesma reserva mais de uma vez', () => {
    const property = new Property('123', 'Casa de Praia', 'Uma bela casa na praia', 4, 300);
    const user = new User('456', 'João Silva');
    const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-25'));

    const booking = new Booking('789', property, user, dateRange, 4);

    const currentDate = new Date('2024-07-15');
    booking.cancel(currentDate);
    
    expect(() => {
      booking.cancel(currentDate);
    }).toThrow('A reserva já está cancelada');
  });
});