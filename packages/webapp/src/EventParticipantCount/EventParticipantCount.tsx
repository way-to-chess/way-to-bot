import clsx from "clsx";
import classes from "./EventParticipantCount.module.css";
import {ParticipantsIcon} from "../Icons/ParticipantsIcon";
import {FC} from "react";

const getClassName = (
    participantsCount: number,
    participantsLimit?: number | null,
) => {
    const percent = participantsLimit
        ? Math.min((participantsCount * 100) / participantsLimit, 100)
        : 0;

    if (percent === 100) {
        return classes.full;
    }

    if (percent >= 70 && percent < 100) {
        return classes.danger;
    }

    if (percent >= 30 && percent < 70) {
        return classes.warning;
    }

    return undefined;
};

interface IEventParticipantCount {
    currentCount: number;
    maxCount?: number | null;
}

const EventParticipantCount: FC<IEventParticipantCount> = (
    {
        currentCount,
        maxCount,
    }) => {
    const className = getClassName(currentCount, maxCount);

    return (
        <div className={clsx(classes.count, className)}>
            {ParticipantsIcon}
            {maxCount ? `${currentCount} / ${maxCount}` : currentCount}
        </div>
    );
};

export {EventParticipantCount};
