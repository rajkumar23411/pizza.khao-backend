const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require("./db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const productRoutes = require("./routes/productRoutes");

dotenv.config({ path: "./config.env" });

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRoute);
app.use("/api", productRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});
