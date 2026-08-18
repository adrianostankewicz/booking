import { DateRange } from './date_range';

describe(
  'DateRange Value Object', () => {
    it('deve criar uma instância de DateRange com a data de início e a data de término e verificar o retorno dessas datas', () => {
      const startDate = new Date('2026-07-07');
      const endDate = new Date('2026-07-08');
      const dateRange = new DateRange(startDate, endDate);
      expect(dateRange.getStartDate()).toEqual(startDate);
      expect(dateRange.getEndDate()).toEqual(endDate);
    });

    it('deve lancar um erro quando a data de término for menor que a data de início', () => {
      expect(() => {
        new DateRange(new Date('2026-07-08'), new Date('2026-07-07'));
      }).toThrow('A data de término não pode ser inferior à data de início');  
    })

    it('deve calcular o total de noites corretamente', () => {
      const startDate = new Date('2026-07-07');
      const endDate = new Date('2026-07-10');
      const dateRange = new DateRange(startDate, endDate);
      const totalNigths = dateRange.getTotalNights();

      expect(totalNigths).toBe(3);

      const startDate1 = new Date('2026-07-05');
      const endDate1 = new Date('2026-07-10');
      const dateRange1 = new DateRange(startDate1, endDate1);
      const totalNigths1 = dateRange1.getTotalNights();

      expect(totalNigths1).toBe(5);
    });

    it('deve verificar se dois intervalos de data se sobrepoem', () => {
        const dateRange1 = new DateRange(new Date('2026-07-07'), new Date('2026-07-10'));
        const dateRange2 = new DateRange(new Date('2026-07-09'), new Date('2026-07-12'));

        const overlaps = dateRange1.overlaps(dateRange2);

        expect(overlaps).toBe(true);
    });

    it('deve lançar erro quando as datas forem iguais', () => {
      const date = new Date('2026-07-07');
      expect(() => {
        new DateRange(date, date);
      }).toThrow('A data de término não pode ser inferior à data de início');
    });
  }
);