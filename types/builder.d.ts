declare module "styles" {
    export function inject(): void;
    export function remove(): void;
}

declare module "common/classes/settings" {
    export default class SettingsManager<T> {
        constructor(pluginName: string, defaultSettings?: T);
        settings: T;
        get<T = any>(key: string, defaultValue?: T): T;
        set(key: string, value: any): void;
    }
}

declare module "common/classes/updater";
declare module "common/hooks/zustand";
declare module "common/hooks/createUpdateWrapper";
declare module "common/hooks/useForceUpdate";
declare module "common/util/any";
declare module "common/util/findInTree";
declare module "common/util/findInReactTree";
declare module "common/util/noerror";
declare module "common/util/prevent";
declare module "common/util/regex";
declare module "common/util/resolve";
declare module "common/apis/clyde" {
    export type BotMessage = {
        state?: "SENT" | "SENDING",
        author?: {
            id: string;
            avatar: string;
            bot: boolean;
            discriminator: string;
            username: string;
        },
        content: any;
    }

    export function sendMessage(channelId: string, message: BotMessage): void
}
declare module "common/apis/strings";
declare module "common/apis/commands" {
    export type Command = {
        description: string;
        id: string;
        name: string;
        options: {
            name: string;
            description: string;
            type: number,
            required?: boolean
        }[];
        type?: number;
        execute: (options: {
            [key: string]: {
                type: string
                text: string
                userId: UserID
            }[]
        }, props: { channel: ChannelObject, guild: GuildObject }) => void;
        predicate: (props: { channelId: string, guildId: string }) => boolean;
        __registerId?: string;
    };

    export type CommandSection = {
        icon: string;
        id: string;
        name: string;
        type: 0 | 1 | 2 | 3 | 4;
    };

    export const DiscordCommands: {
        BUILT_IN_COMMANDS: Command[];
        BUILT_IN_SECTIONS: CommandSection[];
    }

    export const ApplicationCommandOptionType: {
        BOOLEAN: 5;
        CHANNEL: 7;
        INTEGER: 4;
        MENTIONABLE: 9;
        ROLE: 8;
        STRING: 3;
        SUB_COMMAND: 1;
        SUB_COMMAND_GROUP: 2;
        USER: 6;
    }

    export const ApplicationCommandSectionType: {
        BUILT_IN: 0;
        DM: 2;
        GUILD: 1;
    };

    export const ApplicationCommandType: {
        BOT: 3;
        BUILT_IN: 0;
        BUILT_IN_INTEGRATION: 2;
        BUILT_IN_TEXT: 1
        PLACEHOLDER: 4;
    };

    export const ApplicationCommandPermissionType: {
        ROLE: 1;
        USER: 2;
    }

    // const DiscordCommandTypes: {
    //     ApplicationCommandOptionType: {
    //         BOOLEAN: 5;
    //         CHANNEL: 7;
    //         INTEGER: 4;
    //         MENTIONABLE: 9;
    //         ROLE: 8;
    //         STRING: 3;
    //         SUB_COMMAND: 1;
    //         SUB_COMMAND_GROUP: 2;
    //         USER: 6;
    //     };
    //     ApplicationCommandSectionType: {
    //         BUILT_IN: 0;
    //         DM: 2;
    //         GUILD: 1;
    //     };
    //     ApplicationCommandType: {
    //         BOT: 3;
    //         BUILT_IN: 0;
    //         BUILT_IN_INTEGRATION: 2;
    //         BUILT_IN_TEXT: 1
    //         PLACEHOLDER: 4;
    //     };
    //     ApplicationCommandPermissionType: {
    //         ROLE: 1;
    //         USER: 2;
    //     }
    // }


    export function registerCommand(caller: string, options: Command)

    export function unregisterAllCommands(caller: string)
}
declare module "react-spring";
declare module "common/components/category" {
    type CategoryLooks = {
        COMPAT: string,
        DEFAULT: string
    }

    interface CategoryProps {
        children?: ReactElement,
        look?: CategoryLooks,
        label: string | ReactElement
    }
    export default function Category(props: {
        children?: ReactElement,
        look?: CategoryLooks,
        label: string | ReactElement
        className?: string
    }): ReactElement;
    
    //@ts-ignore
    Category.Looks = CategoryLooks
}
// declare module "lodash";

declare module "*.scss";