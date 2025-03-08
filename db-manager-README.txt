# Strapi Database Backup & Restore Tool

This tool provides simple scripts to back up and restore your Strapi PostgreSQL database in a dockerized environment.

## Setup

1. Place these files in the root directory of your Strapi project:
   - `strapi-db-manager.sh` (main script)
   - `scripts/backup-strapi-db.sh` (backup script)
   - `scripts/restore-strapi-db.sh` (restore script)

2. Make the scripts executable:
   ```bash
   chmod +x strapi-db-manager.sh
   chmod +x scripts/backup-strapi-db.sh
   chmod +x scripts/restore-strapi-db.sh
   ```

3. Create a `backups` directory (the scripts will do this automatically if it doesn't exist):
   ```bash
   mkdir -p backups
   ```

## Usage

### Using the Database Manager Script (Recommended)

The database manager provides a simple menu-driven interface:

```bash
./strapi-db-manager.sh
```

This will display a menu with options to:
1. Backup database
2. Restore database 
3. List available backups
4. Delete backup
5. Exit

### Direct Script Usage

You can also run the individual scripts directly:

#### Backup

```bash
./scripts/backup-strapi-db.sh
```

This will:
- Create a timestamped backup of your Strapi database
- Compress it and save it to the `backups` directory
- Keep only the 10 most recent backups by default

#### Restore

```bash
./scripts/restore-strapi-db.sh
```

This will:
- Show a list of available backups
- Let you select which backup to restore
- Confirm before overwriting your current database
- Restore the selected backup to your Strapi database

## Configuration

If needed, you can modify these variables in the scripts:

- `BACKUP_DIR`: Where backups are stored (default: `./backups`)
- `CONTAINER_NAME`: Your PostgreSQL container name (default: `strapiDB`)
- `DB_NAME`: Your database name (default: `strapi_db`)
- `DB_USER`: Your database user (default: `strapi`)

## Important Notes

1. **Make sure your Docker containers are running** before attempting to backup or restore.

2. **Restoring will overwrite your current database**, so use with caution.

3. After restoring, you may need to restart your Strapi container:
   ```bash
   docker-compose restart strapi
   ```

4. These scripts only backup the database content, not uploaded files. For a complete backup, you should also backup the `public/uploads` directory.

## Automated Backups

To set up automated daily backups, add a crontab entry:

```bash
# Open crontab editor
crontab -e

# Add this line to run a backup daily at 2:00 AM
0 2 * * * cd /path/to/your/strapi/project && ./scripts/backup-strapi-db.sh >> ./backups/backup_log.txt 2>&1
```

## Git Repository Integration

While these scripts create database backups, remember that:

1. The actual content types (schema) are stored in your Strapi code files under `src/api/` and `src/components/`, which should be committed to Git.

2. The database backups (`backups` directory) should typically be added to your `.gitignore` file since they contain data rather than code.

For deployments, consider using Strapi's transfer tokens feature for moving content between environments.