const express = require("express");
const db = require("./utils/db");
const path = require("path");

const middleware = require("./utils/middleware");
const recipesRouter = require("./controllers/recipes");
const usersRouter = require("./controllers/users");
const reviewsRouter = require("./controllers/reviews");
const loginRouter = require("./controllers/login");
const app = express();

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.get('/health', (req, res) => {
  if (db.isDBConnectedisDBConnected) {
    res.status(200).json({ status: 'healthy', db: 'connected' })
  } else {
    res.status(503).json({ status: 'degraded', db: 'connecting' })
  }
})

app.use("/api/recipes", recipesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
