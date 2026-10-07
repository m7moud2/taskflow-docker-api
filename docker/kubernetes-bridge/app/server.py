import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


APP_VERSION = os.environ.get("APP_VERSION", "dev")
PORT = int(os.environ.get("PORT", "8080"))


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/healthz":
            body = json.dumps({"status": "ok", "version": APP_VERSION}).encode()
            content_type = "application/json"
        elif self.path == "/":
            body = (
                "<!doctype html><html><head><title>Docker to Kubernetes</title>"
                "</head><body><h1>Docker to Kubernetes</h1>"
                f"<p>Version: {APP_VERSION}</p>"
                f"<p>Runtime: {os.environ.get('RUNTIME', 'container')}</p>"
                "</body></html>"
            ).encode()
            content_type = "text/html; charset=utf-8"
        else:
            self.send_error(404)
            return

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        print("%s - %s" % (self.address_string(), format % args), flush=True)


server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
print(f"Serving version {APP_VERSION} on port {PORT}", flush=True)
server.serve_forever()
