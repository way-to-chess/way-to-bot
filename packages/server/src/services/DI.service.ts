import { Container } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service";
import { TgBotService } from "@way-to-bot/server/services/tg_bot/index";
import { AdminEventController } from "@way-to-bot/server/admin/controllers/event.controller";
import { AdminFileController } from "@way-to-bot/server/admin/controllers/file.controller";
import { AdminLeagueController } from "@way-to-bot/server/admin/controllers/league.controller";
import { AdminLocationController } from "@way-to-bot/server/admin/controllers/location.controller";
import { AdminParticipateRequestController } from "@way-to-bot/server/admin/controllers/participate-request.controller";
import { AdminUserController } from "@way-to-bot/server/admin/controllers/user.controller";
import { AdminEventService } from "@way-to-bot/server/admin/services/event.service";
import { AdminEventLeagueService } from "@way-to-bot/server/admin/services/event-league.service";
import { AdminEventLeagueUserService } from "@way-to-bot/server/admin/services/event-league-user.service";
import { AdminFileService } from "@way-to-bot/server/admin/services/file.service";
import { AdminLeagueService } from "@way-to-bot/server/admin/services/league.service";
import { AdminLocationService } from "@way-to-bot/server/admin/services/location.service";
import { AdminParticipateRequestService } from "@way-to-bot/server/admin/services/participate-request.service";
import { AdminUserService } from "@way-to-bot/server/admin/services/user.service";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository";
import { FileRepository } from "@way-to-bot/server/database/repositories/file.repository";
import { LeagueRepository } from "@way-to-bot/server/database/repositories/league.repository";
import { LocationRepository } from "@way-to-bot/server/database/repositories/location.repository";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { ClientEventController } from "@way-to-bot/server/client/controllers/event.controller";
import { ClientFileController } from "@way-to-bot/server/client/controllers/file.controller";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller";
import { ClientUserController } from "@way-to-bot/server/client/controllers/user.controller";
import { ClientEventService } from "@way-to-bot/server/client/services/event.service";
import { ClientFileService } from "@way-to-bot/server/client/services/file.service";
import { ClientParticipateRequestService } from "@way-to-bot/server/client/services/participate-request.service";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service";
import { CommonAuthController } from "@way-to-bot/server/express/controllers/auth.controller";
import { AdminEventLeagueController } from "@way-to-bot/server/admin/controllers/event-league.controller";
import { EventLeagueResultRepository } from "@way-to-bot/server/database/repositories/event-league-result.repository";
import { AdminTgController } from "@way-to-bot/server/admin/controllers/tg.controller";
import { FeedbackRepository } from "@way-to-bot/server/database/repositories/feedback.repository";

// singleton
class DIService {
  private static _instance: DIService;
  private readonly _container: Container;

  private constructor() {
    this._container = new Container();
    this.bindClasses();
  }

  static get getInstance() {
    if (!this._instance) {
      this._instance = new DIService();
    }

    return this._instance;
  }

  get getContainer() {
    return this._container;
  }

  bindClasses() {
    // common
    this._container.bind(DbService).toSelf().inSingletonScope();
    this._container.bind(TgBotService).toSelf().inSingletonScope();

    this._container.bind(EventRepository).toSelf().inSingletonScope();
    this._container.bind(EventLeagueRepository).toSelf().inSingletonScope();
    this._container.bind(EventLeagueUserRepository).toSelf().inSingletonScope();
    this._container.bind(FileRepository).toSelf().inSingletonScope();
    this._container.bind(LeagueRepository).toSelf().inSingletonScope();
    this._container.bind(LocationRepository).toSelf().inSingletonScope();
    this._container
      .bind(ParticipateRequestRepository)
      .toSelf()
      .inSingletonScope();
    this._container.bind(UserRepository).toSelf().inSingletonScope();
    this._container
      .bind(EventLeagueResultRepository)
      .toSelf()
      .inSingletonScope();
    this._container.bind(FeedbackRepository).toSelf().inSingletonScope();

    this._container.bind(CommonAuthController).toSelf().inRequestScope();

    // admin
    this._container.bind(AdminEventController).toSelf().inRequestScope();
    this._container.bind(AdminFileController).toSelf().inRequestScope();
    this._container.bind(AdminLeagueController).toSelf().inRequestScope();
    this._container.bind(AdminLocationController).toSelf().inRequestScope();
    this._container
      .bind(AdminParticipateRequestController)
      .toSelf()
      .inRequestScope();
    this._container.bind(AdminUserController).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueController).toSelf().inRequestScope();
    this._container.bind(AdminTgController).toSelf().inRequestScope();

    this._container.bind(AdminEventService).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueService).toSelf().inRequestScope();
    this._container.bind(AdminEventLeagueUserService).toSelf().inRequestScope();
    this._container.bind(AdminFileService).toSelf().inRequestScope();
    this._container.bind(AdminLeagueService).toSelf().inRequestScope();
    this._container.bind(AdminLocationService).toSelf().inRequestScope();
    this._container
      .bind(AdminParticipateRequestService)
      .toSelf()
      .inRequestScope();
    this._container.bind(AdminUserService).toSelf().inRequestScope();

    //client
    this._container.bind(ClientEventController).toSelf().inRequestScope();
    this._container.bind(ClientFileController).toSelf().inRequestScope();
    this._container
      .bind(ClientParticipateRequestController)
      .toSelf()
      .inRequestScope();
    this._container.bind(ClientUserController).toSelf().inRequestScope();

    this._container.bind(ClientEventService).toSelf().inRequestScope();
    this._container.bind(ClientFileService).toSelf().inRequestScope();
    this._container
      .bind(ClientParticipateRequestService)
      .toSelf()
      .inRequestScope();
    this._container.bind(ClientUserService).toSelf().inRequestScope();
  }
}

export const DiContainer = DIService.getInstance.getContainer;
