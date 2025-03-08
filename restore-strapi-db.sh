#!/bin/bash
# restore-strapi-db.sh - Script to restore Strapi PostgreSQL database

# Configuration variables
BACKUP_DIR="./backups"
CONTAINER_NAME="strapiDB"  # From your docker-compose.yml
DB_NAME="strapi_db"        # From your .env file
DB_USER="strapi"           # From your .env file

# Function to list available backups
list_backups() {
  echo "Available backups:"
  ls -t "$BACKUP_DIR"/strapi_backup_*.gz | cat -n
}

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup directory '$BACKUP_DIR' does not exist."
  exit 1
fi

# Check if there are any backups
if [ ! "$(ls -A "$BACKUP_DIR"/strapi_backup_*.gz 2>/dev/null)" ]; then
  echo "Error: No backup files found in '$BACKUP_DIR'."
  exit 1
fi

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "Error: Docker container '$CONTAINER_NAME' is not running."
  echo "Please start your Docker containers with 'docker-compose up -d' first."
  exit 1
fi

# List all backups
list_backups

# Ask user to select a backup
echo ""
read -p "Enter the number of the backup to restore (or 'q' to quit): " BACKUP_NUM

# Exit if user chooses to quit
if [ "$BACKUP_NUM" = "q" ]; then
  echo "Restore operation cancelled."
  exit 0
fi

# Validate input
if ! [[ "$BACKUP_NUM" =~ ^[0-9]+$ ]]; then
  echo "Error: Please enter a valid number."
  exit 1
fi

# Get selected backup file
BACKUP_FILE=$(ls -t "$BACKUP_DIR"/strapi_backup_*.gz | sed -n "${BACKUP_NUM}p")

if [ -z "$BACKUP_FILE" ]; then
  echo "Error: Invalid backup number selected."
  exit 1
fi

echo "You selected: $BACKUP_FILE"
read -p "WARNING: This will overwrite your current database. Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "Restore operation cancelled."
  exit 0
fi

echo "Starting restore process..."

# Decompress the backup file to a temporary file
TEMP_FILE="/tmp/strapi_restore_temp.sql"
echo "Decompressing backup file..."
gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"

if [ $? -ne 0 ]; then
  echo "Error: Failed to decompress backup file."
  exit 1
fi

# Restore the database
echo "Restoring database from backup..."
cat "$TEMP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"

if [ $? -eq 0 ]; then
  echo "Database restore completed successfully!"
else
  echo "Error: Database restore failed."
  exit 1
fi

# Clean up temporary file
rm "$TEMP_FILE"

echo "Restore process completed. You may need to restart your Strapi container."
echo "Run: docker-compose restart strapi"