export function isValidShortCode(code) {
    return /^[a-zA-Z0-9]{8}$/.test(code);
}