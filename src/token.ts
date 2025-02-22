export function getBearerTokenFromCookie(): string {
    const cookie = document.cookie;
    const blob = cookie.split("=")[1]
    const parsed = JSON.parse(blob)
    return parsed.refresh
}