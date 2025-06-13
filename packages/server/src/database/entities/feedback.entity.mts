import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feedbacks")
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  message!: string;
}
