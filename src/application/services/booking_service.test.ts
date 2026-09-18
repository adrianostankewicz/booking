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
});