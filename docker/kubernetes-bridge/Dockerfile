FROM python:3.13-alpine

ARG APP_VERSION=dev

ENV APP_VERSION=${APP_VERSION}
ENV PORT=8080

WORKDIR /app
COPY app/server.py .

USER 10001:10001
EXPOSE 8080

CMD ["python", "-u", "server.py"]
