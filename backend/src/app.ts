import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import cors from "cors";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { emailVerificationRouter } from "./routes/email-verification";

const app = express();
app.use(cors());
app.set("trust proxy", true); // so express is aware its behind the nginx ingress proxy
app.use(express.json());
app.use(
  cookieSession({
    // we arent encrypting our cookie as the JWT within it is encrypted
    // this also means that wif we incorporate other programming languages into different services
    // there wont be any decrytion issues
    signed: false,
    // when true this means we will only set a cookie on https connection
    // when we run jest tests, it will change node_env to test, so we will be able to set a cookie on non secure http
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
    // i'll have it on false until I purchase a https license
  })
);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use(emailVerificationRouter);
// so any route that isn't defined above will throw this error
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
