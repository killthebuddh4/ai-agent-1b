import { z } from "zod";

describe("/search", () => {
  it.only("POST", async function () {
    this.timeout(20000);

    const text = "but I try my best";
    const maxDistance = 0.3;

    const response = await fetch(
      `http://localhost:3000/etl/search?text=${text}&maxDistance=${maxDistance}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const json = await (async () => {
      try {
        return await response.json();
      } catch (error) {
        console.log(response.status, response.statusText);
        console.log("Error parsing JSON response", error);
        throw error;
      }
    })();

    console.log(JSON.stringify(json, null, 2));

    const zResponse = z.object({
      ok: z.literal(true),
      data: z.object({}),
    });

    zResponse.parse(json);
  });
});
