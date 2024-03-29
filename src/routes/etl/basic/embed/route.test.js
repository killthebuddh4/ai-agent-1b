import { z } from "zod";

describe("/embed", () => {
  it("POST", async function () {
    this.timeout(20000);

    const response = await fetch("http://localhost:3000/etl/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
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
