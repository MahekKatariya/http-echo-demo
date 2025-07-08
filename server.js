const http = require('http');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Create HTTP server
const server = http.createServer((req, res) => {
    // Extract request information
    const method = req.method;
    const requestUrl = req.url;
    const parsedUrl = url.parse(requestUrl, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    const timestamp = new Date().toISOString();
    
    // Handle health check endpoint for Docker
    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp: timestamp }));
        return;
    }
    
    // Print to console (main requirement)
    console.log(`${method} ${requestUrl}`);
    
    // Prepare response data
    const responseData = {
        method: method,
        path: pathname,
        fullUrl: requestUrl,
        query: query,
        timestamp: timestamp,
        headers: req.headers
    };
    
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Handle requests with body (POST, PUT, PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                // Try to parse JSON body
                if (body) {
                    responseData.body = JSON.parse(body);
                }
            } catch (e) {
                // If not JSON, store as string
                responseData.body = body;
            }
            
            // Send response
            res.writeHead(200);
            res.end(JSON.stringify(responseData, null, 2));
        });
    } else {
        // For GET, DELETE, HEAD and other methods without body
        res.writeHead(200);
        res.end(JSON.stringify(responseData, null, 2));
    }
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`🚀 HTTP Echo Server running on http://${HOST}:${PORT}`);
    console.log(`📝 Server will print the path and method for each request`);
    console.log(`🔗 Try: curl http://localhost:${PORT}/test`);
    console.log(`🔗 Try: curl -X POST http://localhost:${PORT}/api/users`);
    console.log('');
    console.log('--- Request Log ---');
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});