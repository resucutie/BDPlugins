import settings from "../settingsManager"
import constants from "./constants"

async function getUser(id) {
    const response = await fetch(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL) + `api/user/${id}`, {
        method: 'GET'
    })

    if (response.status === 404) return
    if (response.status === 200) return await response.json()
}

async function doesUserExists(id) {
    const response = await fetch(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL) + `api/user/${id}`, {
        method: 'GET'
    })

    if (response.status === 404) return false
    if (response.status === 200) return true
}

export {
    getUser,
    doesUserExists
}