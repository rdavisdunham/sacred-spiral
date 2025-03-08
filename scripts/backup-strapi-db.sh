#!/bin/bash
# backup-strapi-db.sh - Script to backup Strapi PostgreSQL database

# Configuration variables
BACKUP_DIR="./backups"
CONTAINER_NAME="strapiDB"  # From your docker-compose.yml
DB_NAME="strapi_db"        # From your .env file
DB_USER="strapi"           # From your .env file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="strapi_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Display backup start message
echo "Starting Strapi database backup..."
echo "Timestamp: $TIMESTAMP"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "Error: Docker container '$CONTAINER_NAME' is not running."
  echo "Please start your Docker containers with 'docker-compose up -d' first."
  exit 1
fi

# Create the database backup
echo "Creating database backup from PostgreSQL container..."
docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
  # Compress the backup file to save space
  echo "Compressing backup file..."
  gzip "$BACKUP_DIR/$BACKUP_FILE"
  
  # Show backup details
  BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)
  echo "Backup completed successfully!"
  echo "Backup file: $BACKUP_DIR/$BACKUP_FILE.gz"
  echo "Backup size: $BACKUP_SIZE"
else
  echo "Error: Database backup failed."
  exit 1
fi

# Cleanup old backups (optional - keeps the 10 most recent backups)
echo "Cleaning up old backups..."
ls -t "$BACKUP_DIR"/strapi_backup_*.gz | tail -n +11 | xargs -r rm

echo "Backup process completed."
