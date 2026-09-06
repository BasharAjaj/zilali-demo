import http.server, socketserver, os, sys
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a): pass
with socketserver.TCPServer(('127.0.0.1', PORT), H) as httpd:
    print(f'serving http://127.0.0.1:{PORT}')
    httpd.serve_forever()
