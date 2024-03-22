import { z } from "zod";

describe("/stats", () => {
  it.only("POST", async () => {
    const response = await fetch("http://localhost:3000/etl/stats", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

    console.log(json);
  });
});
