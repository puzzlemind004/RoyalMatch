# Tâche 15.4 : Tests de charge multijoueur

## Tools
- Artillery.io pour les tests de charge WebSocket
- K6 pour les tests HTTP

## Configuration Artillery
```yaml
# artillery-load-test.yml
config:
  target: "ws://localhost:3333"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"

scenarios:
  - name: "Join and play game"
    engine: "ws"
    flow:
      - emit:
          channel: "auth:login"
          data:
            email: "{{ $randomEmail() }}"
            password: "test123"
      - emit:
          channel: "game:join"
          data:
            gameId: "{{ gameId }}"
      - think: 2
      - emit:
          channel: "turn:play_card"
          data:
            card: "{{ $randomCard() }}"
      - think: 30
```

## Commande
```bash
artillery run artillery-load-test.yml
```

## Métriques à surveiller
- Latence médiane/p95/p99
- Taux d'erreur
- Messages perdus
- Utilisation CPU/RAM
- Nombre de connexions simultanées
