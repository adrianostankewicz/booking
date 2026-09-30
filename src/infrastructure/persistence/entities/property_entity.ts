import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Properties")
export class PropertyEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({name: "max_guests"})
  maxGuests!: number;

  @Column({name: "base_price_per_night", type: "decimal"})
  basePricePerNight!: number;
}