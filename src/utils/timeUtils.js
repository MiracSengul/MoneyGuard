export function isLessThanOneHour(oldTimestamp) {
    const now = new Date();
    const old = new Date(oldTimestamp);
    return now - old < 60 * 60 * 1000;
}
