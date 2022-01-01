import React from "react";
import useAsync from "../hooks/useAsync";
import settings from "../settingsManager";
import { doesUserExists } from "../utils/tt";
import { getTimezone, isExistingUser } from "../utils/userList";

export default function ({ userID, includeTT = settings.get("tt", true), children }: { userID: UserID, includeTT?: boolean, children: Function}) {
    const state = useAsync(async () => ({
        timezone: await getTimezone(userID, { includeTT }),
        offlineTz: await getTimezone(userID, { includeTT: false })
    }))

    const render = children(state)

    return render && !state.loading && state.value?.timezone ? render : null
}