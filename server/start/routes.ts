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
import { middleware } from '#start/kernel'

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
| Authentication routes
|--------------------------------------------------------------------------
*/

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/api/auth')

/*
|--------------------------------------------------------------------------
| WebSocket Connection routes
|--------------------------------------------------------------------------
*/

const ConnectionController = () => import('#controllers/connection_controller')

router
  .group(() => {
    router.post('/heartbeat', [ConnectionController, 'heartbeat'])
    router.get('/session', [ConnectionController, 'getSession'])
    router.post('/disconnect', [ConnectionController, 'disconnect'])
    router.get('/online', [ConnectionController, 'getOnlinePlayers'])
  })
  .prefix('/api/connection')
  .use(middleware.auth())

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

/*
|--------------------------------------------------------------------------
| Objectives routes
|--------------------------------------------------------------------------
*/

const ObjectivesController = () => import('#controllers/objectives_controller')

// Public route (no auth required)
router.get('/api/objectives/available', [ObjectivesController, 'available'])

// Protected routes (auth required)
router
  .group(() => {
    router.post('/draw', [ObjectivesController, 'draw'])
    router.post('/redraw', [ObjectivesController, 'redraw'])
    router.post('/reject', [ObjectivesController, 'reject'])
    router.post('/validate', [ObjectivesController, 'validate'])
    router.post('/verify', [ObjectivesController, 'verify'])
  })
  .prefix('/api/objectives')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Scoring routes
|--------------------------------------------------------------------------
*/

const ScoringController = () => import('#controllers/scoring_controller')

router
  .group(() => {
    router.post('/calculate', [ScoringController, 'calculate'])
    router.post('/reset', [ScoringController, 'reset'])
    router.get('/all', [ScoringController, 'all'])
  })
  .prefix('/api/scoring')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Statistics routes
|--------------------------------------------------------------------------
*/

const StatisticsController = () => import('#controllers/statistics_controller')

// Protected routes (authenticated user) - MUST be defined BEFORE :userId routes
router
  .group(() => {
    router.get('/me', [StatisticsController, 'getMyStatistics'])
    router.get('/me/history', [StatisticsController, 'getMyGameHistory'])
    router.delete('/me/reset', [StatisticsController, 'resetMyStatistics'])
  })
  .prefix('/api/statistics')
  .use(middleware.auth())

// Public routes - MUST be defined AFTER /me routes to avoid conflicts
router.get('/api/statistics/leaderboard', [StatisticsController, 'getLeaderboard'])
router.get('/api/statistics/:userId', [StatisticsController, 'getUserStatistics'])
router.get('/api/statistics/:userId/history', [StatisticsController, 'getGameHistory'])

/*
|--------------------------------------------------------------------------
| Test routes (Development only - remove in production)
|--------------------------------------------------------------------------
*/

const PlayerTestsController = () => import('#controllers/player_tests_controller')

router
  .group(() => {
    router.get('/player', [PlayerTestsController, 'test'])
  })
  .prefix('/api/test')
