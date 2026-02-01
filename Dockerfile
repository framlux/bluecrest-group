FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=secret,id=SENDGRID_API_KEY,env=SENDGRID_API_KEY \
    --mount=type=secret,id=TURNSTILE_SECRET,env=TURNSTILE_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_SANITY_PROJECT_ID,env=NEXT_PUBLIC_SANITY_PROJECT_ID \
    --mount=type=secret,id=NEXT_PUBLIC_TURNSTILE_SITE_KEY,env=NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    pnpm run build

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
