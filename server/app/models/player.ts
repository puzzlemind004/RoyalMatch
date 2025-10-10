/**
 * Player model alias
 *
 * This file provides a semantic alias for GamePlayer to match domain terminology.
 * In RoyalMatch, a "Player" represents a GamePlayer entity with additional
 * business logic for managing hands, decks, and statistics.
 *
 * Usage:
 * import Player from '#models/player'
 *
 * const player = await Player.find(id)
 * player.drawCard()
 * player.incrementStat('tricksWon')
 */

import GamePlayer from '#models/game_player'

export default GamePlayer
export { GamePlayer as Player }
