import { getApi, sendJSON } from "../../helpers";
import { unWrap, getErrorResponse } from "../../../utils/fetchUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const req = event.req;
    const res = event.res;
    const algoliaAPI = getApi(config.algolia)
    try {
        const payload = await unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/homes/query`,
                {
                    headers: algoliaAPI.headers,
                    method: "POST",
                    body: JSON.stringify({
                        filters: `userId:${req.identity.id}`,
                        attributesToRetrieve: ["objectID", "title"],
                        attributesToHighlight: [],
                    }),
                }
            )
        );
        sendJSON(payload.json.hits, res);
    } catch (error) {
        return getErrorResponse(error);
    }
});