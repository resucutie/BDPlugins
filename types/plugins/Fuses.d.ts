/// <reference path="../others/moment.d.ts" />

declare type Timezone = string

//UserAdd

declare interface UserAddProps {
    defaultVals?: {
        userID?: UserID,
        timezone?: Timezone,
        userPicker?: {
            existingUsers?: boolean
            bots?: boolean
        }
    }
    closeOnAdd?: boolean
    isModal?: boolean
    [key: string]: any
}

declare type UserAddErrorHandler = string

declare function UserAdd(props: UserAddProps): ReactComponent


//Timer

declare interface TimerProps {
    timezone?: Timezone,
    showSeconds?: boolean,
    className?: string,
    [key: string]: any
}

declare function Timer(props: TimerProps): ReactComponent


//BasicTimer

interface BasicTimerProps extends TimerProps {
    tooltip?: boolean,
    className?: string
    staticTime?: Date
}

declare function BasicTimer(props: BasicTimerProps): ReactComponent


//TimezoneManager
declare function getOffset(date?: Date | moment.Moment):Timezone
declare function getTimeFromTimezone(utcOffset: Timezone, currentDate?: Date): Date
declare function getDateFromCity(city: string, sendAsMoment?: boolean): Date|moment.Moment
declare function formatDate(date: string, timezone: Timezone): string


//UserManager
type UserList = {
    [key: UserID]: Timezone
}
declare function addUser(id: string, utcOffset: Timezone)
declare function removeUser(id: string)
declare function getList(): UserList
declare function getTimezone(id: string): Timezone

//Alert
declare function createQuestion(title: string | ReactElement, description: string | ReactElement, buttons: Array<{ text: string | ReactElement, color: string}>): Promise<string>