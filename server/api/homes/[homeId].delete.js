import { getErrorResponse } from "../../../utils/fetchUtils";
import { getApi, sendJSON } from "../../helpers";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const req = event.req;
    const res = event.res;
    const homeId = event.context.params.homeId;
    const algoliaAPI = getApi(config.algolia)
    try {
        await fetch(
            `${algoliaAPI.apiBase}/indexes/homes/${homeId}`,
            {
                headers: algoliaAPI.headers,
                method: "DELETE",
            }
        );

        await fetch(
            `${algoliaAPI.apiBase}/indexes/users/${req.identity.id}/partial`,
            {
                headers: algoliaAPI.headers,
                method: "POST",
                body: JSON.stringify({
                    homeId: {
                        _operation: "Remove",
                        value: homeId,
                    },
                }),
            }
        );
    } catch (error) {
        return getErrorResponse(error);
    }

    sendJSON({}, res);
});