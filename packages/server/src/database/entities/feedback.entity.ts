import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IFeedbackEntity } from "@way-to-bot/shared/api/interfaces/entities/feedback.entity";

@Entity("feedbacks")
export class FeedbackEntity implements IFeedbackEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  message!: string;
}
