const dotenv = require("dotenv");
// .env Configuration
dotenv.config({ path: "./.env" });

const app = require("./app");
const prisma = require("./prisma/client");

// Connecting Database
async function dbConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.error(`Error while connecting to DB`);
  }
}

dbConnection();

// Running the Application
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Running on Port ${process.env.PORT}`);
});
