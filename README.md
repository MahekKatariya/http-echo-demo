# HTTP Echo Demo

A complete containerized development environment featuring a Node.js HTTP echo server with supporting infrastructure tools for modern application deployment and monitoring.

## Project Overview

This project provides:
- **HTTP Echo Server**: Node.js application that logs and responds with request details
- **Infrastructure Tools**: Complete DevOps toolkit for container management, monitoring, and secrets management
- **CI/CD Pipeline**: GitHub Actions workflow for automated deployment
- **Docker Support**: Full containerization with Docker Compose orchestration

## Project Structure

```
http-echo-demo/
├── server.js              # Main HTTP echo server
├── package.json           # Node.js dependencies
├── Dockerfile            # Container build configuration
├── docker-compose.yaml   # Main application orchestration
├── .github/workflows/    # CI/CD pipeline
└── tools/               # Infrastructure tools
    ├── traefik/         # Reverse proxy & SSL termination
    ├── dozzle/          # Container log viewer
    └── vault/           # Secrets management
```

## Features

### HTTP Echo Server
- ✅ Prints requested path and HTTP method to console
- ✅ Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- ✅ Returns JSON response with request details
- ✅ Handles query parameters
- ✅ Processes request bodies for POST/PUT/PATCH requests
- ✅ CORS enabled for cross-origin requests
- ✅ No external dependencies

### Infrastructure Tools
- ✅ **Traefik**: Automatic reverse proxy with SSL/TLS termination
- ✅ **Dozzle**: Real-time Docker container log viewer
- ✅ **Vault**: Secure secrets management and storage
- ✅ **CI/CD**: GitHub Actions automated deployment pipeline
- ✅ **Docker**: Full containerization with health checks

## Quick Start

### Option 1: Run with Node.js

1. **Start the server:**
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

2. **Server will start on port 3000:**
   ```
   🚀 HTTP Echo Server running on http://0.0.0.0:3000
   📝 Server will print the path and method for each request
   ```

### Option 2: Run with Docker

1. **Build and run with Docker:**
   ```bash
   docker build -t http-echo-demo .
   docker run -p 3000:3000 http-echo-demo
   ```

2. **Or use Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Run in detached mode:**
   ```bash
   docker-compose up -d
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

## Usage Examples

### Basic GET Request
```bash
curl http://localhost:3000/test
```
**Console Output:** `GET /test`

**Response:**
```json
{
  "method": "GET",
  "path": "/test",
  "fullUrl": "/test",
  "query": {},
  "timestamp": "2025-01-06T09:01:50.000Z",
  "headers": { ... }
}
```

### POST Request with Body
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```
**Console Output:** `POST /api/users`

### GET Request with Query Parameters
```bash
curl http://localhost:3000/search?q=nodejs&limit=10
```
**Console Output:** `GET /search?q=nodejs&limit=10`

### Other HTTP Methods
```bash
# PUT request
curl -X PUT http://localhost:3000/update/123

# DELETE request
curl -X DELETE http://localhost:3000/delete/456

# PATCH request
curl -X PATCH http://localhost:3000/patch/789
```

## Testing with Browser

Open your browser and navigate to:
- http://localhost:3000/
- http://localhost:3000/test
- http://localhost:3000/api/users
- http://localhost:3000/any/path/you/want

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Response Format

The server returns a JSON response with the following structure:

```json
{
  "method": "HTTP_METHOD",
  "path": "/requested/path",
  "fullUrl": "/requested/path?query=params",
  "query": {
    "param1": "value1",
    "param2": "value2"
  },
  "timestamp": "2025-01-06T09:01:50.000Z",
  "headers": {
    "host": "localhost:3000",
    "user-agent": "curl/7.68.0",
    ...
  },
  "body": "request body for POST/PUT/PATCH requests"
}
```

## Use Cases

- **API Testing**: Test your HTTP client implementations
- **Debugging**: See exactly what requests your application is making
- **Learning**: Understand HTTP methods and request structure
- **Development**: Mock server for frontend development

## Infrastructure Tools

This project includes a complete set of infrastructure tools for production-ready deployments:

### 🔄 Traefik - Reverse Proxy & Load Balancer
**Location**: [`tools/traefik/`](tools/traefik/)

Modern HTTP reverse proxy with automatic service discovery and SSL termination.

**Features**:
- Automatic Let's Encrypt SSL certificates
- Service discovery via Docker labels
- Load balancing and health checks
- Web dashboard for monitoring

**Quick Start**:
```bash
# Create network
docker network create traefik

# Start Traefik
cd tools/traefik
docker-compose up -d
```

**Documentation**: [📖 Traefik README](tools/traefik/README.md)

---

### 📊 Dozzle - Container Log Viewer
**Location**: [`tools/dozzle/`](tools/dozzle/)

Real-time Docker container log viewer with web interface.

**Features**:
- Real-time log streaming
- Multi-container support
- Search and filtering
- User authentication
- Mobile-friendly interface

**Quick Start**:
```bash
# Generate secure password
docker run -it --rm amir20/dozzle generate admin --password "your-password" --name "admin" > tools/dozzle/data/users.yaml

# Start Dozzle
cd tools/dozzle
docker-compose up -d
```

**Access**: `https://your-domain.com/dozzle`

**Documentation**: [📖 Dozzle README](tools/dozzle/README.md)

---

### 🔐 Vault - Secrets Management
**Location**: [`tools/vault/`](tools/vault/)

HashiCorp Vault for secure secrets storage and management.

**Features**:
- Secure secret storage
- Dynamic secrets generation
- Web UI and API access
- Audit logging
- Multiple authentication methods

**Quick Start**:
```bash
# Start Vault
cd tools/vault
docker-compose up -d

# Access UI for initialization
# https://your-domain.com (via Traefik)
```

**Documentation**: [📖 Vault README](tools/vault/README.md)

---

### 🚀 CI/CD Pipeline
**Location**: [`.github/workflows/`](.github/workflows/)

Automated GitHub Actions workflow for building and deploying containers.

**Features**:
- Automatic Docker image building
- Multi-environment deployment (dev/prod)
- Container registry integration
- SSH deployment to servers

**Triggers**:
- Push to `main` branch (production)
- Push to `development` branch (staging)

## Docker

### Building the Image
```bash
docker build -t http-echo-demo .
```

### Running the Container
```bash
# Run on default port 3000
docker run -p 3000:3000 http-echo-demo

# Run on custom port
docker run -p 8080:3000 -e PORT=3000 http-echo-demo

# Run in background
docker run -d -p 3000:3000 --name http-echo http-echo-demo
```

### Docker Compose Commands
```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop and remove
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate
```

### Health Check
The Docker container includes a health check that monitors the `/health` endpoint:
```bash
# Check container health
docker ps

# View health check logs
docker inspect http-echo-demo | grep -A 10 Health
```

## Complete Deployment Guide

### 1. Infrastructure Setup

```bash
# Clone repository
git clone <repository-url>
cd http-echo-demo

# Create Traefik network
docker network create traefik

# Start infrastructure tools
cd tools/traefik
docker-compose up -d

cd ../dozzle
# Generate Dozzle password first
docker run -it --rm amir20/dozzle generate admin --password "secure-password" --name "admin" > data/users.yaml
docker-compose up -d

cd ../vault
docker-compose up -d
```

### 2. Application Deployment

```bash
# Return to project root
cd ../..

# Deploy main application
docker-compose up -d
```

### 3. Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| **HTTP Echo Server** | `https://your-domain.com` | Main application |
| **Traefik Dashboard** | `https://your-domain.com` | Proxy management |
| **Dozzle Logs** | `https://your-domain.com/dozzle` | Container logs |
| **Vault UI** | `https://your-domain.com` | Secrets management |

### 4. Production Checklist

- [ ] Update domain names in all `docker-compose.yaml` files
- [ ] Configure Let's Encrypt email in Traefik
- [ ] Generate secure passwords for Dozzle
- [ ] Initialize and unseal Vault
- [ ] Set up GitHub Actions secrets for deployment
- [ ] Configure firewall rules (ports 80, 443)
- [ ] Set up monitoring and backups

## Requirements

### Development Environment
- **Node.js**: 12.0.0 or higher (for local development)
- **Docker**: 20.10+
- **Docker Compose**: 1.29+

### Production Environment
- **Linux Server**: Ubuntu 20.04+ recommended
- **Docker**: 20.10+
- **Docker Compose**: 1.29+
- **Domain Name**: For SSL certificates
- **Firewall**: Ports 80, 443 open
- **Storage**: Minimum 10GB for containers and logs

### CI/CD Requirements
- **GitHub Repository**: For automated deployments
- **Server SSH Access**: For deployment automation
- **Container Registry**: GitHub Container Registry (ghcr.io)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the provided infrastructure
5. Submit a pull request

## Support

- **Issues**: Use GitHub Issues for bug reports
- **Documentation**: Check individual tool README files
- **Community**: Contribute improvements and suggestions

## License

MIT