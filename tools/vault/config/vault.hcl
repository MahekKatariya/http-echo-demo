storage "file" {
  path = "/vault/file"
}

# Enable listener with TLS (using your own cert and key)
listener "tcp" {
  address = "[::]:8200"
  tls_disable = "true"
}

# Enable the Vault UI
ui = true

# Enable audit logging to file
audit "file" {
  file_path = "/vault/file/audit.log"
}

# Disable mlock() for local development purposes (use in production)
disable_mlock = true