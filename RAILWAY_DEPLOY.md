# 🚀 Деплойм бэкенда TourGid на Railway

## Шаг 1: Подготовка к деплойменту

1. **Зарегистрируйтесь на Railway:**
   - Перейдите на https://railway.app
   - Войдите через GitHub аккаунт

2. **Создайте новый проект:**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите этот репозиторий или форкните его

## Шаг 2: Настройка проекта

1. **Выберите папку backend:**
   - В настройках проекта укажите Root Directory: `backend`
   - Или переместите файлы из папки backend в корень репозитория

2. **Настройте переменные окружения:**
   ```
   NODE_ENV=production
   PORT=3000
   ```

## Шаг 3: Файлы для деплоя уже готовы ✅

- ✅ `package.json` - с правильными скриптами
- ✅ `Procfile` - для Railway
- ✅ `railway.json` - конфигурация
- ✅ `server.js` - обновленный код с новыми данными

## Шаг 4: Деплой

1. **Автоматический деплой:**
   - Railway автоматически задеплоит при пуше в main ветку
   - Или нажмите "Deploy" в панели Railway

2. **Получите URL:**
   - После деплоя Railway даст вам URL типа: `https://tourgid-backend-production.up.railway.app`

## Шаг 5: Обновите фронтенд

В файле `src/services/AIService.js` URL уже настроен:
```javascript
const BACKEND_URL = 'https://tourgid-backend-production.up.railway.app';
```

**Если ваш URL отличается, замените его на актуальный.**

## Шаг 6: Тестирование

1. **Проверьте бэкенд:**
   ```bash
   curl https://your-railway-url.railway.app/
   ```

2. **Проверьте AI endpoint:**
   ```bash
   curl -X POST https://your-railway-url.railway.app/ai/process-voice \
     -H "Content-Type: application/json" \
     -d '{"query": "Найди Байтерек", "user_location": {"latitude": 51.1283, "longitude": 71.4306}}'
   ```

## Возможные проблемы и решения

### ❌ "Module not found"
- Убедитесь что все зависимости указаны в `package.json`
- Проверьте что нет опечаток в именах модулей

### ❌ "Port already in use"
- Railway автоматически назначает порт
- Используйте `process.env.PORT || 3000`

### ❌ "Build failed"
- Проверьте логи в Railway dashboard
- Убедитесь что Node.js версия поддерживается

## Мониторинг

1. **Логи Railway:**
   - Откройте проект в Railway
   - Перейдите в раздел "Deployments"
   - Посмотрите логи последнего деплоя

2. **Метрики:**
   - Railway показывает CPU и память usage
   - Следите за ответами API

## Готово! 🎉

Теперь ваш AI бэкенд работает на Railway и приложение может с ним взаимодействовать.

**Следующий шаг:** Тестируйте голосовой ввод в мобильном приложении! 