import { rejectHitBadRequest, getApi, sendJSON } from "../helpers";
import { unWrap, getErrorResponse } from "../../utils/fetchUtils";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const req = event.req;
    const res = event.res;
    const body = await readBody(event);
    const algoliaAPI = getApi(config.algolia)

    if (!body) {
        rejectHitBadRequest(res);
        return;
    }

    const homeId = uuidv4();
    const payload = {
        ...body,
        reviewCount: 0,
        reviewValue: 0,
        userId: req.identity.id,
    };

    try {
        const availability = [];
        payload.availabilityRanges.forEach((range) => {
            const start = new Date(range.start).getTime() / 1000;
            const end = new Date(range.end).getTime() / 1000;
            for (var day = start; day <= end; day += 86400) {
                availability.push(day);
            }
        });

        delete payload.availabilityRanges;
        payload.availability = availability;

        const resp = await unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/homes/${homeId}`,
                {
                    headers: algoliaAPI.headers,
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            )
        );

        if (!resp.ok) {
            res.statusCode = 500;
            res.end();
            return;
        }

        const resp2 = await unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/users/${req.identity.id}/partial`,
                {
                    headers: algoliaAPI.headers,
                    method: "POST",
                    body: JSON.stringify({
                        homeId: {
                            _operation: "Add",
                            value: homeId,
                        },
                    }),
                }
            )
        );

        if (!resp2.ok) {
            res.statusCode = 500;
            res.end();
            return;
        }
    } catch (error) {
        return getErrorResponse(error);
    }
    sendJSON({ homeId }, res);
});