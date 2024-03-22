import { z } from "zod";

describe("/load", () => {
  it("POST", async () => {
    const response = await fetch("http://localhost:3000/etl/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromDirectory: "./.data",
        options: { fileExtsToInclude: ["md"] },
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
      data: z.object({
        numLoaded: z.number().positive(),
      }),
    });

    zResponse.parse(json);
  });
});
