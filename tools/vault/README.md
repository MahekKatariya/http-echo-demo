# HashiCorp Vault - Secrets Management

HashiCorp Vault is a tool for securely accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, and more.

## Overview

This setup configures Vault with:
- **Web UI**: Browser-based interface for secret management
- **File Storage**: Persistent storage backend
- **Traefik Integration**: Reverse proxy with SSL termination
- **Audit Logging**: Security audit trail
- **Development Mode**: Simplified setup for development/testing

## Features

- ✅ Secure secret storage and retrieval
- ✅ Dynamic secrets generation
- ✅ Identity-based access control
- ✅ Audit logging and compliance
- ✅ Web UI for easy management
- ✅ API access for automation
- ✅ Multiple authentication methods

## Quick Start

### 1. Start Vault

```bash
docker-compose up -d
```

### 2. Initialize Vault

Access the Vault UI and initialize:
- **URL**: `https://your-domain.com` (via Traefik)
- **Direct Access**: `http://localhost:8200` (if accessing directly)

During initialization, you'll receive:
- **Root Token**: Master token for initial access
- **Unseal Keys**: Keys required to unseal Vault

**Important**: Store these securely! You'll need them to access Vault.

### 3. Unseal Vault

Vault starts in a sealed state. Use the unseal keys from initialization to unseal it.

### 4. Login

Use the root token to log in and start managing secrets.

## Configuration

### Docker Compose Setup

The service is configured with:
- **Image**: `hashicorp/vault:latest`
- **Port**: 8200 (HTTP)
- **Storage**: File-based persistent storage
- **UI**: Enabled for web interface

### Vault Configuration ([`config/vault.hcl`](config/vault.hcl))

Key configuration settings:
```hcl
storage "file" {
  path = "/vault/file"
}

listener "tcp" {
  address = "[::]:8200"
  tls_disable = "true"
}

ui = true
disable_mlock = true
```

### Traefik Labels

The service includes Traefik labels for:
- **Host-based routing**: `Host(__DOMAIN__)`
- **SSL termination**: `websecure` entrypoint with Let's Encrypt
- **Load balancer**: Port 8200

## Usage

### Web UI Operations

#### Managing Secrets

1. **Navigate to Secrets Engine** (usually `secret/`)
2. **Create Secret**:
   - Path: `myapp/database`
   - Key-Value pairs: `username=admin`, `password=secret123`
3. **Read Secret**: Click on the secret path
4. **Update Secret**: Edit existing key-value pairs
5. **Delete Secret**: Use the delete option

#### Authentication Methods

Enable additional auth methods:
1. Go to **Access** → **Auth Methods**
2. **Enable new method** (userpass, ldap, etc.)
3. **Configure** the authentication method
4. **Create users/policies** as needed

### CLI Operations

#### Install Vault CLI
```bash
# Download and install Vault CLI
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install vault
```

#### Basic CLI Commands
```bash
# Set Vault address
export VAULT_ADDR='https://your-domain.com'

# Login with root token
vault auth -method=token token=your-root-token

# Write a secret
vault kv put secret/myapp/db username=admin password=secret123

# Read a secret
vault kv get secret/myapp/db

# List secrets
vault kv list secret/myapp/
```

### API Operations

#### Authentication
```bash
# Login via API
curl -X POST \
  https://your-domain.com/v1/auth/token/lookup-self \
  -H "X-Vault-Token: your-token"
```

#### Secret Operations
```bash
# Write secret
curl -X POST \
  https://your-domain.com/v1/secret/data/myapp/db \
  -H "X-Vault-Token: your-token" \
  -d '{"data": {"username": "admin", "password": "secret123"}}'

# Read secret
curl -X GET \
  https://your-domain.com/v1/secret/data/myapp/db \
  -H "X-Vault-Token: your-token"
```

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VAULT_ADDR` | `http://localhost:8200` | Vault server address |
| `VAULT_STORAGE_FILE_PATH` | `/vault/file` | Storage path |
| `VAULT_UI` | `true` | Enable web UI |

## Volumes

| Host Path | Container Path | Description |
|-----------|----------------|-------------|
| `vault_data` | `/vault/file` | Persistent storage |
| `./config/vault.hcl` | `/vault/config/vault.hcl` | Configuration file |

## Network

- **Network**: `traefik` (external)
- **Dependencies**: Requires Traefik reverse proxy

## Security Considerations

1. **Secure Root Token**: Store root token securely, rotate regularly
2. **Unseal Keys**: Distribute unseal keys among trusted operators
3. **TLS in Production**: Enable TLS for production deployments
4. **Audit Logs**: Monitor audit logs regularly
5. **Least Privilege**: Use policies to limit access
6. **Backup**: Regular backups of Vault data

## Production Hardening

### Enable TLS

Update [`config/vault.hcl`](config/vault.hcl):
```hcl
listener "tcp" {
  address = "[::]:8200"
  tls_disable = "false"
  tls_cert_file = "/vault/certs/vault.crt"
  tls_key_file = "/vault/certs/vault.key"
}
```

### High Availability

For production, consider:
- **Consul Backend**: For HA storage
- **Multiple Vault Instances**: Load balanced setup
- **Auto-unseal**: Cloud KMS integration
- **Monitoring**: Prometheus/Grafana integration

## Troubleshooting

### Common Issues

**Vault is Sealed:**
```bash
# Check seal status
vault status

# Unseal Vault (repeat with different keys)
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>
```

**Permission Denied:**
```bash
# Check token capabilities
vault token capabilities <path>

# Check current token info
vault token lookup
```

**Storage Issues:**
```bash
# Check storage permissions
docker exec vault ls -la /vault/file/

# Check Vault logs
docker logs vault
```

### Logs and Debugging

```bash
# View Vault logs
docker logs vault

# Check container status
docker ps | grep vault

# Restart service
docker-compose restart vault
```

## Backup and Recovery

### Backup Vault Data

```bash
# Stop Vault
docker-compose stop vault

# Backup data directory
tar -czf vault-backup-$(date +%Y%m%d).tar.gz vault_data/

# Start Vault
docker-compose start vault
```

### Restore from Backup

```bash
# Stop Vault
docker-compose stop vault

# Restore data
tar -xzf vault-backup-YYYYMMDD.tar.gz

# Start Vault
docker-compose start vault
```

## Policies and Authentication

### Example Policy

Create a policy for application access:
```hcl
# Application policy
path "secret/data/myapp/*" {
  capabilities = ["read", "list"]
}

path "secret/metadata/myapp/*" {
  capabilities = ["list"]
}
```

###

## Links

- **Setup github oidc**: https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-hashicorp-vault