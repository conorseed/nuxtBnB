import { rejectHitBadRequest, getApi, sendJSON } from "../../helpers"
import { unWrap, getErrorResponse } from "../../../utils/fetchUtils"
import stripeLib from "stripe"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const req = event.req;
    const res = event.res;
    const body = await readBody(event);
    const algoliaAPI = getApi(config.algolia)
    if (
        !body ||
        !body.homeId ||
        !body.start ||
        !body.end ||
        !body.start >= body.end
    ) {
        return rejectHitBadRequest(res);
    }

    const nights = (body.end - body.start) / 86400;
    const stripe = stripeLib(config.stripe.secretKey);
    let home = null;

    try {
        const resp = await unWrap(
            await fetch(
                `${algoliaAPI.apiBase}/indexes/homes/${body.homeId}`,
                {
                    headers: algoliaAPI.headers,
                }
            )
        );
        home = resp.json;
    } catch (error) {
        return getErrorResponse(error);
    }

    const session = await stripe.checkout.sessions.create({
        metadata: {
            identityId: req.identity.id,
            homeId: body.homeId,
            start: body.start,
            end: body.end,
        },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${config.rootUrl}/home/${body.homeId}?result=success`,
        cancel_url: `${config.rootUrl}/home/${body.homeId}?result=cancel`,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    unit_amount: home.pricePerNight * nights * 100,
                    product_data: {
                        name: "Reservation for " + home.title,
                        images: [
                            `https://res.cloudinary.com/${config.public.cloudinary.cloudName}/image/upload/${home.images[0]}`,
                        ],
                    },
                },
            },
        ],
    });

    sendJSON({ id: session.id }, res);
});