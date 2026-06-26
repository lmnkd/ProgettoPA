import { createClient } from "redis";

const redis = createClient({
    url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
        process.env.REDIS_PORT || 6379
    }`,
});

redis.on("connect", () => {
    console.log("Redis connesso");
});

redis.on("error", (err) => {
    console.error("Errore Redis:", err);
});

export const connectRedis = async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
};

export default redis;