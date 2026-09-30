import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Users")
export class UserEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  name!: string;
}