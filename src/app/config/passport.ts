/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExists = await User.findOne({ email });

        // if (!isUserExists) {
        //   return done(null, false, { message: "user dose not exits" });
        // }
        if (!isUserExists) {
          return done("User dose not exist");
        }
        if (
          isUserExists.isActive === IsActive.BLOCKED ||
          isUserExists.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${isUserExists.isActive}`
          // );
          return done(`User is ${isUserExists.isActive}`);
        }
        if (isUserExists.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
          return done("User is deleted");
        }
        if (!isUserExists.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
          return done("User is not verified");
        }
        const isGoogleAuthenticated = isUserExists.auths?.some(
          (providerObject) => providerObject.provider == "google"
        );
        if (isGoogleAuthenticated && !isUserExists.password) {
          return done(null, false, {
            message:
              "you have authenticated through google . so if you want to login with creadentials. than at first login with google and set password for your gmail and then you can login with email and password",
          });
        }

        // if (isGoogleAuthenticated) {
        //   return done(
        //     "you have authenticated through google . so if you want to login with creadentials. than at first login with google and set password for your gmail and then you can login with email and password"
        //   );
        // }
        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExists.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "password dose not mathced" });
        }
        return done(null, isUserExists);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not found" });
        }
        let isUserExists = await User.findOne({ email });
        if (isUserExists && !isUserExists.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
          // done("User is not verified")
          return done(null, false, { message: "User is not verified" });
        }

        if (
          isUserExists &&
          (isUserExists.isActive === IsActive.BLOCKED ||
            isUserExists.isActive === IsActive.INACTIVE)
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
          done(`User is ${isUserExists.isActive}`);
        }

        if (isUserExists && isUserExists.isDeleted) {
          return done(null, false, { message: "User is deleted" });
          // done("User is deleted")
        }

        if (!isUserExists) {
          isUserExists = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExists);
      } catch (error) {
        console.log("google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
