// @ts-types="npm:@types/express@4.17.15"

import express from "npm:express@4.21.2";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);
