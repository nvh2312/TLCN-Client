const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const importRouter = require("./routes/importRoutes");
const commentRouter = require("./routes/commentRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const locationRouter = require("./routes/locationRoutes");

const app = express();
// Add headers before the routes are defined
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );
} else {
  app.use(cors(
    {
      origin: "https://hctech.onrender.com",
      methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    }
  ));
}
// Serving static files
// 1) GLOBAL MIDDLEWARE
// Set security HTTP headers
// app.use(helmet());
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["ratingsQuantity", "ratingsAverage", "price"],
  })
);

// Serving static files

// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/imports", importRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/payments", transactionRouter);
app.use("/api/v1/locations", locationRouter);
const __variableOfChoice = path.resolve();
app.use(express.static(path.join(__variableOfChoice, "/fe/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__variableOfChoice, "/fe/dist/index.html"))
);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // res.status(200).render("404");
});

app.use((err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
