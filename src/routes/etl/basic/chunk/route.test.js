import { z } from "zod";

describe("/chunk", () => {
  it.only("POST", async function () {
    this.timeout(10000);

    const response = await fetch("http://localhost:3000/etl/chunk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numTokensInChunk: 100,
        numTokensInOverlap: 20,
      }),
    });

    const json = await (async () => {
      try {
        return await response.json();
      } catch (error) {
        console.log(response.status, response.statusText);
        console.log("Error parsing JSON response", error);
        throw error;
      }
    })();

    const zResponse = z.object({
      ok: z.literal(true),
      data: z.object({}),
    });

    zResponse.parse(json);
  });
});
