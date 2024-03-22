import { load } from "./load.js";

describe("load", () => {
  it("works", async () => {
    const data = await load({
      fromDirectory: "./.data",
      options: { fileExtsToInclude: ["md"] },
    });
    console.log(data);
  });
});
