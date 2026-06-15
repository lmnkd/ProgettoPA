import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import process from "process";

/**
 * Middleware Auth0 — verifica il JWT Bearer token.
 * Da applicare alle route che richiedono autenticazione.
 */
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
});