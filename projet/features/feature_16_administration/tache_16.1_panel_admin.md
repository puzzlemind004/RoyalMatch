# Tâche 16.1 : Panel admin (gestion utilisateurs)

## Fonctionnalités
- Liste de tous les utilisateurs
- Bannir/débannir un utilisateur
- Réinitialiser mot de passe
- Voir les statistiques utilisateur
- Logs d'actions suspectes

## Backend
```typescript
// app/Controllers/Http/AdminController.ts
export default class AdminController {
  @middleware('admin')
  async listUsers({ request }: HttpContext) {
    const page = request.input('page', 1)
    const users = await User.query().paginate(page, 20)
    return users
  }

  @middleware('admin')
  async banUser({ params }: HttpContext) {
    const user = await User.find(params.id)
    user.isBanned = true
    user.bannedAt = new Date()
    await user.save()
  }
}
```

## Frontend
```typescript
@Component({
  template: `
    <div class="admin-panel">
      <h1>Administration</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Créé le</th>
            <th>Banni</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (user of users(); track user.id) {
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.createdAt | date }}</td>
              <td>{{ user.isBanned ? 'Oui' : 'Non' }}</td>
              <td>
                @if (user.isBanned) {
                  <button (click)="unban(user)">Débannir</button>
                } @else {
                  <button (click)="ban(user)">Bannir</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
```
