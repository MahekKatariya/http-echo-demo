# Dozzle - Docker Container Log Viewer

Dozzle is a simple, lightweight application that provides you with a web-based interface to monitor your Docker container logs in real-time.

## Overview

This setup configures Dozzle with:
- **Web Interface**: Real-time log viewing through a web browser
- **Authentication**: Simple authentication with username/password
- **Traefik Integration**: Reverse proxy setup with SSL termination
- **Path-based Routing**: Accessible via `/dozzle` path

## Features

- ✅ Real-time Docker container log streaming
- ✅ Multi-container log viewing
- ✅ Search and filter capabilities
- ✅ Dark/Light theme support
- ✅ Authentication protection
- ✅ Mobile-friendly interface
- ✅ No database required

## Quick Start

### 1. Generate Password Hash

Generate a secure password hash for authentication:

```bash
docker run -it --rm amir20/dozzle generate admin --password "<password>" --name "admin" > users.yml
```

Replace `<password>` with your desired password. This command will create a `users.yml` file with the hashed password.

### 2. Move Users File

Move the generated file to the data directory:
```bash
mv users.yml data/users.yaml
```

### 3. Start the Service

```bash
docker-compose up -d
```

### 4. Access Dozzle

- **URL**: `https://your-domain.com/dozzle`
- **Login**: Use the credentials you set during password generation

## Configuration

### Docker Compose Setup

The service is configured with:
- **Image**: `amir20/dozzle:latest`
- **Port**: Internal port 8080
- **Base Path**: `/dozzle` (for reverse proxy)
- **Authentication**: Simple provider with user credentials

### Authentication

User credentials are stored in [`data/users.yaml`](data/users.yaml):
```yaml
users:
    admin:
        email: ""
        name: admin
        password: "<hashed-password>"
        filter: ""
```

**Important**: Always use the password generation command to create secure hashed passwords!

### Traefik Labels

The service includes Traefik labels for:
- **Host-based routing**: `Host(__DOMAIN__)`
- **Path prefix**: `/dozzle`
- **SSL termination**: `websecure` entrypoint
- **Load balancer**: Port 8080

## Usage

### Viewing Logs

1. Navigate to the Dozzle interface
2. Select containers from the sidebar
3. View real-time logs with:
   - **Search**: Find specific log entries
   - **Filter**: Show/hide log levels
   - **Download**: Export logs to file
   - **Multi-view**: Monitor multiple containers

### Managing Users

#### Add New User
```bash
docker run -it --rm amir20/dozzle generate <username> --password "<password>" --name "<display-name>" >> data/users.yaml
```

#### Generate User with Container Filter
```bash
docker run -it --rm amir20/dozzle generate developer --password "dev-pass" --name "Developer" --filter "name=app*" >> data/users.yaml
```

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DOZZLE_AUTH_PROVIDER` | `simple` | Authentication method |
| `DOZZLE_BASE` | `/dozzle` | Base path for reverse proxy |

## Volumes

| Host Path | Container Path | Description |
|-----------|----------------|-------------|
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker socket access |
| `./data` | `/data` | User configuration |

## Network

- **Network**: `traefik` (external)
- **Dependencies**: Requires Traefik reverse proxy

## Security Considerations

1. **Use password generation command** for secure hashed passwords
2. **Use strong passwords** for authentication
3. **Limit Docker socket access** if needed
4. **Enable HTTPS** through Traefik
5. **Consider IP restrictions** for sensitive environments

## Troubleshooting

### Common Issues

**Cannot access logs:**
- Verify Docker socket permissions
- Check container is running: `docker ps`

**Authentication fails:**
- Verify credentials in `users.yaml`
- Ensure password was generated using the hash command
- Restart container after credential changes

**Traefik routing issues:**
- Ensure Traefik network exists
- Check domain configuration
- Verify SSL certificates

### Logs and Debugging

```bash
# View Dozzle container logs
docker logs dozzle

# Check container status
docker ps | grep dozzle

# Restart service
docker-compose restart dozzle
```

## Advanced Configuration

### Multiple Users Example

```bash
# Generate admin user
docker run -it --rm amir20/dozzle generate admin --password "admin-secure-pass" --name "Administrator" > data/users.yaml

# Add developer user with filter
docker run -it --rm amir20/dozzle generate developer --password "dev-pass" --name "Developer" --filter "name=app*,name=web*" >> data/users.yaml

# Add viewer user (read-only equivalent)
docker run -it --rm amir20/dozzle generate viewer --password "view-pass" --name "Log Viewer" >> data/users.yaml
```

### Container Filters

Use filters to limit which containers users can see:
- `name=web*` - Only containers starting with "web"
- `name=app*,name=api*` - Containers starting with "app" or "api"
- `label=environment=production` - Only production containers

## Links

- **Official Documentation**: https://dozzle.dev/
- **GitHub Repository**: https://github.com/amir20/dozzle
- **Docker Hub**: https://hub.docker.com/r/amir20/dozzle