require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const userRouter = require("./Routes/userRouter");
const roomsRouter = require("./Routes/roomsRouter");
const reservationsRouter = require("./Routes/reservationsRouter");
const opinionRouter = require("./Routes/reviewsRouter");
const vouchersRouter = require("./Routes/voucherRouter");
// const analyticsRouter = require("./Routes/Tools/analytics");
// const reportsRouter = require("./Routes/Tools/reports");
// const permissionsRouter = require("./Routes/Tools/permissions");
// const searchRouter = require("./Routes/Tools/search");
const dashboardRouter = require("./Routes/dashboardRouter");

const app = express();

// Konfiguracja CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Zezwól na żądania z twojego front-endu
    credentials: true, // Opcja wymagana, gdy front-end i back-end są na różnych domenach
  })
);
// Konfiguracja sesji
app.use(
  session({
    secret: process.env.SESSION_SECRET, //secret to session
    resave: false, // Nie zapisuj sesji, jeśli nie była modyfikowana
    saveUninitialized: false, // Nie twórz sesji, dopóki nie jest potrzebna
    cookie: {
      secure: false, // Ustaw na true jeśli używasz HTTPS jak lokalnie to false
      httpOnly: true, // Pomaga zabezpieczyć aplikację przed atakami typu XSS
      maxAge: 24 * 60 * 60 * 1000, // Czas życia cookie, tutaj ustawiony na 24 godziny
    },
  })
);

app.use(express.json({ limit: "3mb" })); // Ustawia limit na 3 megabajt
app.use("/users", userRouter);
app.use("/rooms", roomsRouter);
app.use("/reservations", reservationsRouter);
app.use("/reviews", opinionRouter);
app.use("/vouchers", vouchersRouter);
//app.use("/analytics", analyticsRouter);
//app.use("/reports", reportsRouter);
//app.use("/permissions", permissionsRouter);
//app.use("/search", searchRouter);
app.use(dashboardRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000; //port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
