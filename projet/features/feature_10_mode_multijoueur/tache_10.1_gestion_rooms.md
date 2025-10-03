# Tâche 10.1 : Gestion des rooms (2-4 joueurs)

## Architecture WebSocket
```typescript
class RoomManager {
  private rooms = new Map<string, Room>()

  createRoom(gameId: string): Room {
    const room = new Room(gameId)
    this.rooms.set(gameId, room)
    return room
  }

  joinRoom(gameId: string, playerId: string, socket: Socket) {
    const room = this.rooms.get(gameId)
    room.addPlayer(playerId, socket)
    socket.join(`game:${gameId}`)
  }

  leaveRoom(gameId: string, playerId: string) {
    const room = this.rooms.get(gameId)
    room.removePlayer(playerId)
  }

  broadcast(gameId: string, event: string, data: any) {
    this.io.to(`game:${gameId}`).emit(event, data)
  }
}
```
