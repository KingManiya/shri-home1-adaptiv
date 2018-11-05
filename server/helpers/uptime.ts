export default function uptime() {
    const isoDate = new Date(process.uptime() * 1000).toJSON();
    return isoDate.substring(11, 19);
}