/**
 * Script to create the royalmatch database
 * Run with: node create_database.js
 */

import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function createDatabase() {
  // Connect to the default 'postgres' database
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // Connect to default database
  })

  try {
    await client.connect()
    console.log('✓ Connected to PostgreSQL')

    // Check if database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'royalmatch'
    `
    const result = await client.query(checkDbQuery)

    if (result.rows.length > 0) {
      console.log('✓ Database "royalmatch" already exists')
    } else {
      // Create the database
      await client.query('CREATE DATABASE royalmatch')
      console.log('✓ Database "royalmatch" created successfully')
    }

    await client.end()
    console.log('\n✅ Setup complete! You can now run: node ace migration:run')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createDatabase()
