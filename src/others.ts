const projectID = "c64278ad-7e9f-4fed-bf14-5af221796833";

async function getBearerToken(refreshToken: string) {
    const resp = await fetch(`https://api.basic.tech/auth/token`, {
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: refreshToken })
    })
    const json = await resp.json()
    return json.access_token
}

export async function getLocation(refreshToken: string) {
    const token = await getBearerToken(refreshToken)
    const options = { method: 'GET', headers: { Authorization: `Bearer ${token}` } };

    const resp = await fetch(`https://api.basic.tech/account/${projectID}/db/log`, options)
    const json = await resp.json()
    return json.data
}

export async function getPlaces(refreshToken: string) {
    const token = await getBearerToken(refreshToken)
    const options = { method: 'GET', headers: { Authorization: `Bearer ${token}` } };

    const resp = await fetch(`https://api.basic.tech/account/${projectID}/db/places`, options)
    const json = await resp.json()
    return json.data
}