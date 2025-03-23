// @ts-types="npm:@types/express@4.17.15"

import express from "npm:express@4.21.2";
import { Sequelize, DataTypes } from 'sequelize';

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);

const sequelize = new Sequelize('blog', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
})

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
