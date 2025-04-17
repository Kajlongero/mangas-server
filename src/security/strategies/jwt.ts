import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { authOptions } from "../../configs";

const atBearerOpts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authOptions.JWT_AT_SECRET,
};

const rtBodyOpts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
  secretOrKey: authOptions.JWT_RT_SECRET,
};

const rtHeadersOpts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("refreshToken"),
  secretOrKey: authOptions.JWT_RT_SECRET,
};

export const accessJwtBearerStrategy = new Strategy(
  atBearerOpts,
  async (payload, done) => done(null, payload)
);

export const refreshJwtBodyStrategy = new Strategy(
  rtBodyOpts,
  async (payload, done) => done(null, payload)
);

export const refreshJwtHeaderStrategy = new Strategy(
  rtHeadersOpts,
  async (payload, done) => done(null, payload)
);
