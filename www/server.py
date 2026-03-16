import os, http.server, socketserver
os.chdir('/Users/mizushimatakahiro/Desktop/小学生の学習アプリ')
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8080), handler) as httpd:
    print("Serving on port 8080")
    httpd.serve_forever()
