import { Property } from "../../domain/entities/property";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { PropertyService } from "./property_service";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const property = await propertyService.findPropertyById("999")
    expect(property).toBeNull();
  })

  it("deve retornar uma propriedade quando um ID válido for passado", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Apartamento");
  });

  it("deve salvar uma nova propriedade com sucesso usando um repositório fake e buscando novamente", async () => {
    const newProperty = new Property("3", "Casa", "Casa com vista para o mar", 6, 200);
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById("3");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Casa");
  });
});