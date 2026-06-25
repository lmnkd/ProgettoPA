export interface AppJwtPayload {
    cf: string;
    roles: ("admin" | "user" | "operator" | "both")[];
}

// Composizione token