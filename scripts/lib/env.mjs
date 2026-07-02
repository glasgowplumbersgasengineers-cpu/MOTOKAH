import fs from "fs";
import path from "path";

const ENV_FILES = [".env", ".env.local", ".env.production"];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)=["']?(.*?)["']?\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]])
  );
}

export function loadEnv(root = process.cwd()) {
  const fileEnv = ENV_FILES.reduce(
    (acc, file) => ({ ...acc, ...parseEnvFile(path.join(root, file)) }),
    {}
  );
  return { ...fileEnv, ...process.env };
}

export function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required env vars: ${missing.join(", ")}. Run vercel env pull .env.local or set them in your shell.`
    );
  }
}
