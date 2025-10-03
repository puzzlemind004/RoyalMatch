# Tâche 10.6 : Chat en partie

## Fonctionnalités
- Messages texte
- Emojis / réactions rapides
- Filtre de langage inapproprié
- Historique limité (50 messages)
- Possibilité de mute un joueur

## Backend
```typescript
class ChatService {
  async sendMessage(playerId: string, gameId: string, message: string) {
    // Valider et filtrer
    const sanitized = this.sanitize(message)
    const filtered = await this.filterProfanity(sanitized)

    const chatMessage = {
      id: uuid(),
      playerId,
      playerName: await this.getPlayerName(playerId),
      message: filtered,
      timestamp: new Date()
    }

    // Sauvegarder
    await ChatMessage.create({ gameId, ...chatMessage })

    // Diffuser
    this.broadcast(gameId, 'chat:message', chatMessage)
  }
}
```

## Frontend
```typescript
@Component({
  selector: 'app-game-chat',
  template: `
    <div class="chat-container">
      <div class="messages" #messagesContainer>
        @for (msg of messages(); track msg.id) {
          <div class="message">
            <span class="author">{{ msg.playerName }}:</span>
            <span class="content">{{ msg.message }}</span>
          </div>
        }
      </div>

      <form (submit)="sendMessage()">
        <input
          [(ngModel)]="newMessage"
          placeholder="Message..."
          maxlength="200"
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  `
})
```
