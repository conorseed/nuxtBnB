import { createHash } from "crypto";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const res = event.res;
    const body = await readBody(event);

    try {
        const sha1 = createHash("sha1");
        const payload = [];

        Object.keys(body).forEach((key) => {
            payload.push(`${key}=${body[key]}`);
        });

        sha1.update(payload.sort().join("&") + config.cloudinary.apiSecret);

        res.end(
            JSON.stringify({
                signature: sha1.digest("hex"),
            })
        );
    } catch (error) {
        console.error(error);
    }
});