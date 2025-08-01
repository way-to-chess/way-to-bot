import {FC, ReactNode} from "react";
import {eventApi} from "../../Store/Event/EventApi";
import {getNotNil} from "@way-to-bot/shared/utils/getNotNil";
import classes from "../SingleEventPage.module.css";
import {Typography} from "../../Typography/Typography";
import {EventParticipantCount} from "../../EventParticipantCount/EventParticipantCount";
import {UserListItem} from "../../UserListItem/UserListItem";
import {IUserEntity} from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {TrophyIcon} from "lucide-react";
import {sortByKey} from "../../Utils/SortByKey";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";

const POSTFIX_BY_PLACE: Record<number, ReactNode> = {
    1: <TrophyIcon size={14} color={"rgb(255, 204, 0)"}/>,
    2: <TrophyIcon size={14} color={"rgb(148, 148, 148)"}/>,
    3: <TrophyIcon size={14} color={"rgb(139, 66, 1)"}/>
}

const AllParticipants: FC<{ users: IUserEntity[], title: string }> = ({users, title}) => {
    const trigger = (
        <button className={classes.all}>
            <Typography type={"text1"} value={"Все"} color={"mainColor"}/>
        </button>
    )

    return <BottomSheet trigger={trigger} title={title}>
        <div className={classes.participants}>
            {users.map((user) => {
                const icon = "place" in user ? POSTFIX_BY_PLACE[Number(user.place)] : null
                const text = <Typography type={"title4"} value={user.rating}/>
                const postfix = <>{icon} {text}</>

                return (
                    <UserListItem
                        {...user}
                        className={classes.participant}
                        key={user.id}
                        postfix={postfix}
                    />
                )
            })}
        </div>
    </BottomSheet>
}


const EventParticipants: FC<{ eventId: string }> = ({eventId}) => {
    const {data} = eventApi.useGetEventByIdQuery(eventId);

    const event = getNotNil(data, "SingleEventPage -> Participants -> event can't be null")

    const {
        participantsLimit,
        eventLeagues
    } = event

    const maxCount = eventLeagues.length === 1 ? participantsLimit : null

    return eventLeagues.map(({participants, name}) => {
        const sorted = sortByKey(participants, "place", ESortDirection.DESC)

        const sliced = sorted.slice(0, 5)

        const leagueName = eventLeagues.length === 1 ? "Участники" : (name === "DEFAULT" ? "Стандартная лига" : name)

        return (
            <div className={classes.block}>
                <div className={classes.participantBlock}>
                    <Typography type={"title4"} value={leagueName}/>
                    <EventParticipantCount currentCount={sorted.length} maxCount={maxCount}/>
                    {sorted.length > 5 ? <AllParticipants users={sorted} title={leagueName}/> : null}
                </div>
                {
                    sliced.length > 0 ?
                        <div className={classes.participants}>
                            {sliced.map((user) => {
                                const icon = "place" in user ? POSTFIX_BY_PLACE[Number(user.place)] : null
                                const text = <Typography type={"title4"} value={user.rating}/>
                                const postfix = <>{icon} {text}</>

                                return (
                                    <UserListItem
                                        {...user}
                                        className={classes.participant}
                                        key={user.id}
                                        postfix={postfix}
                                    />
                                )
                            })}
                        </div> : null
                }
            </div>
        )
    })
}

export {EventParticipants}