import { Booking } from "../../domain/entities/booking";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakebookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;

    mockPropertyService = new PropertyService(mockPropertyRepository) as jest.Mocked<PropertyService>;
    mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;

    fakebookingRepository = new FakeBookingRepository();

    bookingService = new BookingService(
      fakebookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("deve criar uma reserva com sucesso usando repositório fake", async () => {

    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);
    
    //Arrange
    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      guestCount: 2,
    };

    //Act
    const result = await bookingService.createBooking(bookingDTO);

    //Assert
    expect(result).toBeInstanceOf(Booking);
    expect(result.getTotalPrice()).toBe(500);
    expect(result.getStatus()).toBe("CONFIRMED");

    const savedBooking = await fakebookingRepository.findById(result.getID());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getID()).toBe(result.getID());
  });

  it("deve lançar um erro quando a propriedade não for encontrada", async () => {
    
    //Arrange
    mockPropertyService.findPropertyById.mockResolvedValue(null);
    
    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Propriedade não encontrada");
  });

  it("deve lançar um erro quando o usuário não for encontrado", async () => {
    // Arrange
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1")
    } as any;

    // Act
    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);
    
    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      guestCount: 2,
    };

    //Assert
    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Usuário não encontrado");
  });

  it("deve lançar um erro ao tentar criar reserva para um período já reservado", async () => {

    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);
    
    //Arrange
    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      guestCount: 2,
    };

    //Act
    const result = await bookingService.createBooking(bookingDTO);

    mockProperty.isAvailable = jest.fn().mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
        throw new Error("A propriedade não está disponível para o período selecionado.");
    });

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "A propriedade não está disponível para o período selecionado.");
  });

  it("deve cancelar uma reserva existente usando o repositório fake", async () => {

    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);
    
    //Arrange
    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      guestCount: 2,
    };

    //Act
    const booking = await bookingService.createBooking(bookingDTO);

    const spyFindById = jest.spyOn(fakebookingRepository, "findById");

    await bookingService.cancelBooking(booking.getID());

    const canceledBooking = await fakebookingRepository.findById(booking.getID());
    expect(canceledBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getID());
    expect(spyFindById).toHaveBeenCalledTimes(2);
    spyFindById.mockRestore();
  });
});