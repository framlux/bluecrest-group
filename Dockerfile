FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# No build secrets: all config, including the Turnstile site key, is read at runtime from the pod's env.
RUN pnpm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# If you use /public assets (favicons, images, etc.)
COPY --from=build /app/public ./public

# Standalone server + traced deps (puts server.js in /app/server.js)
COPY --from=build /app/.next/standalone ./

# Next expects to find these at /app/.next/static
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
