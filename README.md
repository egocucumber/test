# Админ-панель для центрального офиса
## Стек технологий

- **NestJS** - фреймворк для Node.js
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных
- **JWT** - авторизация
- **Docker** - контейнеризация

## Запуск проекта

### Требования

- Docker
- Docker Compose

### Быстрый запуск

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd testBEt

# Запустите проект одной командой
docker-compose up --build
```

Приложение будет доступно по адресу: `http://localhost:4443`

### Первоначальная настройка

После запуска создается root пользователь:
- **Email**: `root@example.com`
- **Пароль**: `Password123`

## API Документация

### Авторизация и безопасность

#### POST /auth/login
Вход по email и паролю, выдача JWT.

**Запрос:**
```json
{
  "email": "root@example.com",
  "password": "Password123"
}
```

**Ответ:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Завершение текущей сессии.

**Заголовки:** `Authorization: Bearer <token>`

#### POST /auth/refresh
Обновление JWT токена.

**Заголовки:** `Authorization: Bearer <token>`

### Администраторы

Все эндпоинты требуют роль ROOT.

#### GET /admins
Список администраторов.

#### POST /admins
Создать менеджера (только для ROOT).

**Запрос:**
```json
{
  "name": "Manager Name",
  "email": "manager@example.com",
  "password": "Password123"
}
```

#### PATCH /admins/:id/password
Смена пароля администратора (только для ROOT).

**Запрос:**
```json
{
  "password": "NewPassword123"
}
```

#### DELETE /admins/:id
Удалить администратора (только для ROOT).

### Владельцы магазинов

#### GET /shops-owners
Список владельцев.

#### GET /shops-owners/:id
Карточка владельца.

#### POST /shops-owners
Создать владельца.

**Запрос:**
```json
{
  "name": "Owner Name",
  "contacts": "phone: +1234567890, email: owner@example.com"
}
```

#### PATCH /shops-owners/:id
Изменить владельца.

#### DELETE /shops-owners/:id
Удалить владельца.

### Магазины

#### GET /shops
Список магазинов.

#### GET /shops/:id
Карточка магазина.

#### POST /shops
Создать магазин.

**Запрос:**
```json
{
  "name": "Shop Name",
  "address": "Shop Address",
  "login": "shop_login",
  "password": "shop_password",
  "ownerId": 1
}
```

#### PATCH /shops/:id/credentials
Изменить логин/пароль магазина.

**Запрос:**
```json
{
  "login": "new_login",
  "password": "new_password"
}
```

### Терминалы

#### GET /terminals
Список терминалов.

#### GET /terminals/:id
Карточка терминала.

#### PATCH /terminals/:id/status
Обновить статус терминала вручную.

**Запрос:**
```json
{
  "status": "ACTIVE"
}
```

#### POST /terminals/alive
Heartbeat от терминала (обновление статуса «активный»).

**Запрос:**
```json
{
  "macAddress": "AA:BB:CC:DD:EE:FF"
}
```

### Заявки

#### GET /requests
Список заявок.

#### PATCH /requests/:id/approve
Одобрить заявку → создать терминал.

#### PATCH /requests/:id/reject
Отклонить заявку.

#### POST /requests/:id/comment
Добавить комментарий к заявке.

**Запрос:**
```json
{
  "comment": "Комментарий к заявке"
}
```

### Профиль

#### PATCH /profile/password
Смена пароля текущего пользователя.

**Запрос:**
```json
{
  "currentPassword": "CurrentPassword123",
  "newPassword": "NewPassword123"
}
```

## Роли и права

### ROOT
- Может создавать, изменять и удалять менеджеров
- Полный доступ ко всем функциям системы
- Создается при первоначальной настройке
- В системе может быть только один ROOT

### MANAGER
- Может управлять владельцами магазинов, магазинами, терминалами и заявками
- Не может управлять другими администраторами

## Безопасность

- Пароли хранятся в зашифрованном виде (bcrypt)
- JWT токены с контролем версии для инвалидации при повторном входе
- Ограничение: один аккаунт = одна активная сессия
- При повторном входе старый токен инвалидируется

## Структура базы данных

### Администраторы (Admin)
- id, name, email, password, role, tokenVersion, createdAt, updatedAt

### Владельцы торговых точек (ShopOwner)
- id, name, contacts, createdAt, updatedAt

### Торговая точка (Shop)
- id, name, address, login, password, ownerId, createdAt, updatedAt

### Терминалы ККМ (Terminal)
- id, macAddress, status, shopId, createdAt, updatedAt

### Заявки на подключение терминалов (Request)
- id, macAddress, shopId, status, comment, createdAt, updatedAt

## Разработка

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Запуск миграций
npx prisma migrate dev

# Генерация Prisma клиента
npx prisma generate

# Запуск seed
npx prisma db seed
```

### Docker команды

```bash
# Запуск в фоновом режиме
docker-compose up -d

# Остановка
docker-compose down

# Пересборка
docker-compose up --build

# Просмотр логов
docker-compose logs -f
```

## Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие тестами
npm run test:cov
```