import { defineConfig } from '@adonisjs/transmit'

export default defineConfig({
  /**
   * Ping interval in milliseconds to detect disconnected clients
   * Set to 30 seconds for heartbeat mechanism
   */
  pingInterval: '30s',

  /**
   * Transport layer configuration
   * null = use default HTTP transport
   */
  transport: null,
})
