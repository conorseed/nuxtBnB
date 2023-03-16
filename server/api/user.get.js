import { getApi, sendJSON } from "../helpers";
import { unWrap, getErrorResponse } from "../../utils/fetchUtils";

export default defineEventHandler(async (event) => {
    const req = event.req;
    const res = event.res;
    const config = useRuntimeConfig();
    const userData = await getById(req.identity.id, config);
    const algoliaAPI = getApi(config.algolia)

    if (userData.status == 200) {
        sendJSON(userData.json, res);
        return;
    }
    const payload = makeUserPayload(req.identity);
    await create(req.identity.id, payload, config);
    sendJSON(payload, res);
});

async function getById(id, config) {
    try {
        return unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/users/${id}`,
                {
                    headers: algoliaAPI.headers,
                }
            )
        );
    } catch (error) {
        return getErrorResponse(error);
    }
}

function makeUserPayload(identity) {
    return {
        name: identity.name,
        email: identity.email,
        image: identity.image,
        homeId: [],
        reviewCount: 0,
        description: "",
        joined: new Date().toISOString(),
    };
}

async function create(id, payload, config) {
    try {
        return unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/users/${id}`,
                {
                    headers: algoliaAPI.headers,
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            )
        );
    } catch (error) {
        return getErrorResponse(error);
    }
}