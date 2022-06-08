FROM denoland/deno:alpine-1.22.2

COPY lock.json mod.ts /action/

RUN deno compile --allow-env --allow-net --allow-read --lock=/action/lock.json -o /action/bin /action/mod.ts

ENTRYPOINT ["/action/bin"]
