import settings from "../settingsManager"
import { TTCache } from "./cache"
import constants from "./constants"

async function getUser(id) {
    if (TTCache.has(id)) {
        return TTCache.get(id)
    }
    
    const response: Response = await fetch(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL) + `api/user/${id}`, {
        method: 'GET'
    }).catch((error) => {
       console.error("things went bad", error)
       throw error
    })

    if (response.status === 404) {
        TTCache.set(id, undefined)
        return
    }
    if (response.status === 200) {
        const json = await response.json()
        TTCache.set(id, json)
        return json
    }
}

const doesUserExists = async (id) => Boolean(await getUser(id))

export {
    getUser,
    doesUserExists
}