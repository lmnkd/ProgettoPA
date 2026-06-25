import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { publicKey } from "../config/keys";
import { AppJwtPayload } from "../types/jwt-payload";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";


// Funzione per scremare nelle rotte tramite autenticazione JWT

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ error: AppErrorsMessage.MISSING_TOKEN });
        return;
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as AppJwtPayload;
        (req as any).user = payload;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: AppErrorsMessage.TOKEN_EXPIRED });
        } else {
            res.status(401).json({ error: AppErrorsMessage.INVALID_TOKEN });
        }
    }
}

// Funzione per autenticazione con ruoli

export function requireRole(role: "user" | "operator" | "admin") {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user as AppJwtPayload;

        if (!user || !user.roles.includes(role)) {
            res.status(403).json({ error: AppErrorsMessage.PERMISSION_DENIED });
            return;
        }
        next();
    };
}