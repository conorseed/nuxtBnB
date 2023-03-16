import { getErrorResponse } from "../../../utils/fetchUtils";
import { getApi } from "../../helpers";

export default defineEventHandler(async (event) => {    
    const config = useRuntimeConfig();
    const res = event.res;
    const body = await readBody(event);
    const meta = body.data.object.metadata;
    const algoliaAPI = getApi(config.algolia)

    console.log('meta from webhook', meta)

    try {
        await fetch(
            `${algoliaAPI.apiBase}/indexes/bookings/`,
            {
                headers: algoliaAPI.headers,
                method: "POST",
                body: JSON.stringify({
                    identityId: meta.identityId,
                    homeId: meta.homeId,
                    start: meta.start,
                    end: meta.end,
                }),
            }
        );
    } catch (error) {
        return getErrorResponse(error);
    }
    res.end(`${meta.identityId} booked ${meta.homeId}!!!!`);
});