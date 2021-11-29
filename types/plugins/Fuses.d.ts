export type Timezone = string

//UserAdd

interface UserAddProps {
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

