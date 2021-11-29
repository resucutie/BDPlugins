export declare type Timezone = string

import { Button } from "@discord/components"

//UserAdd

export interface UserAddProps {
    presets?: {
        userID?: string,
        timezone?: Timezone
    },
    closeOnAdd?: boolean
}

export type UserAddErrorHandler = string

export function UserAdd(props: UserAddProps): ReactComponent


//Timer

export interface TimerProps {
    timezone?: Timezone,
    showSeconds?: boolean,
    className?: string
}

export function Timer(props: TimerProps): ReactComponent


//BasicTimer

interface BasicTimerProps extends TimerProps {
    tooltip?: boolean,
    className?: string
    staticTime?: Date
}

export function BasicTimer(props: BasicTimerProps): ReactComponent


//TimezoneManager
export function getOffset(date?: Date | moment.Moment):Timezone
export function getTimeFromTimezone(utcOffset: Timezone, currentDate?: Date): Date
export function getDateFromCity(city: string, sendAsMoment?: boolean): Date|moment.Moment
export function formatDate(date: string, timezone: Timezone): string


//UserManager
type UserList = {
    [key: string]: Timezone
}
export function addUser(id: string, utcOffset: Timezone)
export function removeUser(id: string)
export function getList(): UserList
export function getTimezone(id: string): Timezone

//Alert
export function createQuestion(title: string | ReactElement, description: string | ReactElement, buttons: Array<{ text: string | ReactElement, color: string}>): Promise<string>