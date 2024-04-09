const express = require("express");
const connectDB = require("./db/conn");
const userRoutes = require("./router/user.router.js");
const dotenv = require("dotenv");
const cors = require("cors"); // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
