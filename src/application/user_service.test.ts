import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
import { UserService } from "./user_service";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;
  
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const user = await userService.findUserById("999")
    expect(user).toBeNull();
  })

  it("deve retornar um usuário quando um ID válido for fornecido", async () => {
    const user = await userService.findUserById("1")
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  })
})