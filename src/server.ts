import express from "express";
import { route as loadRoute } from "./routes/etl/load/route.js";
import { route as statsRoute } from "./routes/etl/stats/route.js";

console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);
console.log("stats route", statsRoute);

const app = express();

app.use(express.json());

app.get("/heartbeat", (_, res) => {
  res.json({ ok: true });
});

app.post("/etl/load", loadRoute);
app.get("/etl/stats", statsRoute);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
