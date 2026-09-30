import { DateRange } from '../value_objects/date_range';
import { Booking } from './booking';
import { Property } from './property';
import { User } from './user';

describe('Property Entity', () => {
  it('deve criar uma instância de Property com todos os atributos', () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma bela casa de praia com vista para o mar.",
      4,
      200
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de Praia");
    expect(property.getDescription()).toBe("Uma bela casa de praia com vista para o mar.");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it('deve lançar um erro se o nome for vazio', () => {
    expect(() => {
      new Property("1", "", "Descrição", 4, 200);
    }).toThrow('O nome é obrigatório');
  });

  it('deve lançar um erro se o número máximo de hóspedes for zero ou negativo', () => {
    expect(() => {
      new Property("1", "Casa de Praia", "Descrição", 0, 200);
    }).toThrow('O número máximo de hóspedes deve ser maior que zero');
  });

  it('deve validar o numero máximo de hóspedes', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 4, 200);
    expect(() => {
      property.validateGuestCount(6);
    }).toThrow(`Número máximo de hóspedes excedido. O máximo permitido é 4.`);
  });

  it('não deve aplicar desconto para estadias menores que 7 noites', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 4, 200);
    const dateRange = new DateRange(new Date('2026-08-10'), new Date('2026-08-16')); // 6 noites
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(1200); // 6 noites * 200 por noite
  });

  it('deve aplicar desconto para estadias de 7 noites ou mais', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 4, 200);
    const dateRange = new DateRange(new Date('2026-08-10'), new Date('2026-08-17')); // 7 noites
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(1260); // 7 noites * 200 * 0.9 por noite
  });

  it('deve verificar disponibilidade da propriedade)', () => {
    const property = new Property("1", "Casa de Praia", "Descrição", 4, 200);
    const user = new User("1", "João");
    const dateRange = new DateRange(new Date('2026-08-10'), new Date('2026-08-18'));
    const dateRange2 = new DateRange(new Date('2026-08-15'), new Date('2026-08-20'));

    new Booking("1", property, user, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});