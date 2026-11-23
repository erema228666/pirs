FROM alpine:3.20

RUN apk add --no-cache ca-certificates curl && \
    curl -fsSL -o /usr/local/bin/minio \
      https://dl.min.io/server/minio/release/linux-amd64/archive/minio.RELEASE.2025-04-22T22-12-26Z && \
    chmod +x /usr/local/bin/minio

EXPOSE 9000 9001
ENTRYPOINT ["minio"]
CMD ["server", "/data", "--console-address", ":9001"]