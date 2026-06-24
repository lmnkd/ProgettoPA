export interface AppJwtPayload {
    cf: string;
    roles: ("user" | "operator" | "both")[];
}