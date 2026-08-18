export class DateRange {
  private readonly startDate: Date;
  private readonly endDate: Date;
  
  constructor(startDate: Date, endDate: Date) {
    if (endDate <= startDate) {
      throw new Error('A data de término não pode ser inferior à data de início');
    }
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getTotalNights(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }

  overlaps(other: DateRange): boolean {
    return (
      this.startDate < other.endDate && other.getStartDate() < this.endDate);
  }
}