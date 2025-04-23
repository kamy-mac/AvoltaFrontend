#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysql -h mysql -u avolta -pavolta -e "SELECT 1"; do
  sleep 1
done

echo "MySQL is ready. Initializing database..."

# Create database if not exists
mysql -h mysql -u avolta -pavolta -e "CREATE DATABASE IF NOT EXISTS avolta;"

# Import initial schema
mysql -h mysql -u avolta -pavolta avolta < /docker-entrypoint-initdb.d/schema.sql

echo "Database initialization completed."