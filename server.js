//api Documentaition
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
//packages imports
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
//files imports
import connectDB from "./config/db.js";
//routes import
import testRoutes from "./routes/testRoutes.js ";
import authRoutes from "./routes/authRoutes.js";
import errroMiddelware from "./middelwares/errroMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoutes from "./routes/jobsRoute.js";

dotenv.config();

//mongodb connection
connectDB();

// Swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8000",
        //   url: "https://nodejs-job-portal-app.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

//rest object
const app = express(); //now app varaible ke ander saare features aa chuke h express k

//middelware
app.use(helmet()); // ued to secure header part which contain token
app.use(xss()); //cross site scripitng attack se save krta
app.use(mongoSanitize()); //to save mongodb database
app.use(express.json()); //to tell application of using json data
app.use(cors()); //help to communicate two different port
app.use(morgan("dev")); //shows in console which restful api hits

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middelware
app.use(errroMiddelware);

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
