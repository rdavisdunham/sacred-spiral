#!/bin/bash
# strapi-db-manager.sh - Manage Strapi database backups and restores

# Configuration
BACKUP_DIR="./backups"
SCRIPTS_DIR="./scripts"
BACKUP_SCRIPT="$SCRIPTS_DIR/backup-strapi-db.sh"
RESTORE_SCRIPT="$SCRIPTS_DIR/restore-strapi-db.sh"

# Create directories if they don't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$SCRIPTS_DIR"

# Function to show menu
show_menu() {
  clear
  echo "========================================"
  echo "       STRAPI DATABASE MANAGER         "
  echo "========================================"
  echo "1. Backup database"
  echo "2. Restore database"
  echo "3. List available backups"
  echo "4. Delete backup"
  echo "5. Exit"
  echo "========================================"
  echo -n "Enter your choice [1-5]: "
}

# Function to list backups
list_backups() {
  echo "Available backups:"
  if [ "$(ls -A "$BACKUP_DIR"/strapi_backup_*.gz 2>/dev/null)" ]; then
    ls -lh "$BACKUP_DIR"/strapi_backup_*.gz | awk '{print NR ". " $9 " (" $5 ")" " - " $6 " " $7 " " $8}'
  else
    echo "No backups found."
  fi
  echo ""
  read -p "Press Enter to continue..."
}

# Function to delete a backup
delete_backup() {
  if [ ! "$(ls -A "$BACKUP_DIR"/strapi_backup_*.gz 2>/dev/null)" ]; then
    echo "No backups found to delete."
    read -p "Press Enter to continue..."
    return
  fi

  echo "Available backups:"
  ls -t "$BACKUP_DIR"/strapi_backup_*.gz | cat -n
  
  echo ""
  read -p "Enter the number of the backup to delete (or 'q' to cancel): " BACKUP_NUM
  
  if [ "$BACKUP_NUM" = "q" ]; then
    echo "Delete operation cancelled."
    read -p "Press Enter to continue..."
    return
  fi
  
  if ! [[ "$BACKUP_NUM" =~ ^[0-9]+$ ]]; then
    echo "Error: Please enter a valid number."
    read -p "Press Enter to continue..."
    return
  fi
  
  BACKUP_FILE=$(ls -t "$BACKUP_DIR"/strapi_backup_*.gz | sed -n "${BACKUP_NUM}p")
  
  if [ -z "$BACKUP_FILE" ]; then
    echo "Error: Invalid backup number selected."
    read -p "Press Enter to continue..."
    return
  fi
  
  echo "You selected: $BACKUP_FILE"
  read -p "Are you sure you want to delete this backup? (y/n): " CONFIRM
  
  if [ "$CONFIRM" = "y" ]; then
    rm "$BACKUP_FILE"
    echo "Backup deleted successfully."
  else
    echo "Delete operation cancelled."
  fi
  
  read -p "Press Enter to continue..."
}

# Check if backup and restore scripts exist, create them if not
if [ ! -f "$BACKUP_SCRIPT" ]; then
  cat > "$BACKUP_SCRIPT" << 'EOF'
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
EOF
  chmod +x "$BACKUP_SCRIPT"
fi

if [ ! -f "$RESTORE_SCRIPT" ]; then
  cat > "$RESTORE_SCRIPT" << 'EOF'
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
EOF
  chmod +x "$RESTORE_SCRIPT"
fi

# Make sure the scripts are executable
chmod +x "$BACKUP_SCRIPT"
chmod +x "$RESTORE_SCRIPT"

# Main menu loop
while true; do
  show_menu
  read CHOICE
  
  case $CHOICE in
    1)
      # Run backup script
      "$BACKUP_SCRIPT"
      read -p "Press Enter to continue..."
      ;;
    2)
      # Run restore script
      "$RESTORE_SCRIPT"
      ;;
    3)
      # List backups
      list_backups
      ;;
    4)
      # Delete backup
      delete_backup
      ;;
    5)
      # Exit
      echo "Exiting Strapi Database Manager. Goodbye!"
      exit 0
      ;;
    *)
      echo "Invalid option. Please try again."
      read -p "Press Enter to continue..."
      ;;
  esac
done