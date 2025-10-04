/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/api/health', async () => {
  return {
    status: 'ok',
    service: 'RoyalMatch API',
    timestamp: new Date().toISOString(),
  }
})

/*
|--------------------------------------------------------------------------
| WebSocket routes (Transmit)
|--------------------------------------------------------------------------
*/

// Register Transmit endpoint for WebSocket connections
transmit.registerRoutes()

/*
|--------------------------------------------------------------------------
| WebSocket Test routes (Development only - remove in production)
|--------------------------------------------------------------------------
*/

const WebSocketTestController = () => import('#controllers/websocket_test_controller')

router
  .group(() => {
    router.post('/player-joined', [WebSocketTestController, 'testPlayerJoined'])
    router.post('/game-started', [WebSocketTestController, 'testGameStarted'])
    router.post('/turn-started', [WebSocketTestController, 'testTurnStarted'])
    router.post('/card-played', [WebSocketTestController, 'testCardPlayed'])
  })
  .prefix('/api/ws-test')
