# Traefik - Modern Reverse Proxy

Traefik is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. It automatically discovers services and configures itself dynamically.

## Overview

This setup configures Traefik with:
- **Automatic Service Discovery**: Docker provider integration
- **SSL/TLS Termination**: Let's Encrypt automatic certificates
- **Dashboard**: Web-based management interface
- **Load Balancing**: Automatic load balancing for services
- **Path-based Routing**: Route traffic based on domains and paths

## Features

- ✅ Automatic service discovery via Docker labels
- ✅ Let's Encrypt SSL certificates (ACME)
- ✅ HTTP to HTTPS redirection
- ✅ Web dashboard for monitoring
- ✅ Load balancing and health checks
- ✅ Middleware support (auth, rate limiting, etc.)
- ✅ Real-time configuration updates

## Quick Start

### 1. Create External Network

Create the Traefik network that other services will use:
```bash
docker network create traefik
```

### 2. Configure Email for Let's Encrypt

Edit the [`docker-compose.yaml`](docker-compose.yaml) file and replace `<email>` with your email address:
```yaml
- "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
```

### 3. Set Domain

Replace `__DOMAIN__` with your actual domain in the labels:
```yaml
- "traefik.http.routers.api.rule=Host(`your-domain.com`)"
```

### 4. Start Traefik

```bash
docker-compose up -d
```

### 5. Access Dashboard

- **URL**: `http://your-domain.com` (HTTP)
- **Dashboard**: Available at the root domain

## Configuration

### Docker Compose Setup

The service includes:
- **Traefik**: Main reverse proxy service
- **Whoami**: Test service for API testing

### Traefik Configuration

Key configuration options:
- **API Dashboard**: Enabled and accessible
- **Docker Provider**: Automatic service discovery
- **Let's Encrypt**: Automatic SSL certificate generation
- **HTTP Challenge**: Domain validation method

### Entry Points

| Entry Point | Port | Protocol | Purpose |
|-------------|------|----------|---------|
| `web` | 80 | HTTP | HTTP traffic (redirects to HTTPS) |
| `websecure` | 443 | HTTPS | Secure HTTPS traffic |

### Certificate Resolver

- **Name**: `myresolver`
- **Method**: HTTP Challenge
- **CA**: Let's Encrypt Production
- **Storage**: `/letsencrypt/acme.json`

## Usage

### Adding Services to Traefik

To expose a service through Traefik, add these labels to your Docker Compose service:

#### Basic HTTP Service
```yaml
services:
  your-service:
    image: your-image
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.your-service.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.your-service.entrypoints=websecure"
      - "traefik.http.routers.your-service.tls.certresolver=myresolver"
      - "traefik.http.services.your-service.loadbalancer.server.port=80"
    networks:
      - traefik
```

#### Service with Path Prefix
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.api.rule=Host(`your-domain.com`) && PathPrefix(`/api`)"
  - "traefik.http.routers.api.entrypoints=websecure"
  - "traefik.http.routers.api.tls.certresolver=myresolver"
  - "traefik.http.middlewares.api-strip.stripprefix.prefixes=/api"
  - "traefik.http.routers.api.middlewares=api-strip"
```

### Test Service (Whoami)

The included whoami service is available at:
- **URL**: `https://your-domain.com/api-test`
- **Purpose**: Test API endpoint for verification

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `TRAEFIK_API_DASHBOARD` | `true` | Enable dashboard |
| `TRAEFIK_ENTRYPOINTS_WEB` | `true` | Enable HTTP entrypoint |
| `TRAEFIK_ENTRYPOINTS_WEBSECURE` | `true` | Enable HTTPS entrypoint |
| `TRAEFIK_PROVIDERS_DOCKER` | `true` | Enable Docker provider |

## Volumes

| Host Path | Container Path | Description |
|-----------|----------------|-------------|
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker socket access |
| `./letsencrypt` | `/letsencrypt` | SSL certificate storage |

## Network

- **Network**: `traefik` (external)
- **Purpose**: Shared network for all Traefik-managed services

## Security Considerations

1. **Secure Dashboard Access**: Consider adding authentication
2. **SSL Certificates**: Automatic Let's Encrypt certificates
3. **Docker Socket**: Read-only access to Docker socket
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **IP Whitelisting**: Restrict access to sensitive services

## Troubleshooting

### Common Issues

**SSL Certificate Issues:**
```bash
# Check certificate storage
ls -la letsencrypt/

# View certificate logs
docker logs traefik | grep -i acme
```

**Service Discovery Problems:**
```bash
# Check if service is detected
docker logs traefik | grep -i "your-service"

# Verify network connectivity
docker network inspect traefik
```

**Dashboard Access Issues:**
- Verify domain DNS points to server
- Check firewall rules for ports 80/443
- Ensure no other services using ports 80/443

### Logs and Debugging

```bash
# View Traefik logs
docker logs traefik

# Enable debug logging (add to command section)
- "--log.level=DEBUG"

# Check service status
docker ps | grep traefik
```

## Advanced Configuration

### Custom Middleware

Add authentication middleware:
```yaml
labels:
  - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$10$$..."
  - "traefik.http.routers.secure-service.middlewares=auth"
```

### Multiple Domains

Handle multiple domains:
```yaml
labels:
  - "traefik.http.routers.multi.rule=Host(`domain1.com`) || Host(`domain2.com`)"
```

### Custom Headers

Add security headers:
```yaml
labels:
  - "traefik.http.middlewares.security.headers.customrequestheaders.X-Forwarded-Proto=https"
  - "traefik.http.middlewares.security.headers.customrequestheaders.X-Forwarded-Port=443"
```

## Monitoring

### Dashboard Features

The Traefik dashboard provides:
- **Service Overview**: All discovered services
- **Router Configuration**: Routing rules and middleware
- **Certificate Status**: SSL certificate information
- **Health Checks**: Service health monitoring

### API Endpoints

- **Dashboard**: `http://your-domain.com/dashboard/`
- **API**: `http://your-domain.com/api/`
- **Health**: `http://your-domain.com/ping`

## Links

- **Official Documentation**: https://doc.traefik.io/traefik/
- **GitHub Repository**: https://github.com/traefik/traefik
- **Docker Hub**: https://hub.docker.com/_/traefik
- **Let's Encrypt**: https://letsencrypt.org/