import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const corsOptions = {
  origin: (origin: string | undefined, callback) => {
    // No CORS check in development
    if (process.env.NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    if (!origin) {
      callback(null, false);
      return;
    }
    // Ignore ports
    origin = origin.replace(/:[0-9]+$/, "");

    if (origin.endsWith(".recipe-wiki.com")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
app.use(cors(corsOptions));

app.use(express.static("public"));
app.use("/images", express.static("images"));

export { app };
