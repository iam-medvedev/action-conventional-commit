FROM denoland/deno:alpine-1.22.2

COPY mod.ts /action/

RUN deno compile --allow-env --allow-net --allow-read -o /action/bin /action/mod.ts

ENTRYPOINT ["/action/bin"]
