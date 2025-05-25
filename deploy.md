# Railway Deploy Instructions

## Быстрый деплой:

1. Коммит изменений:
```bash
git add .
git commit -m "Fix Railway deployment with 0.0.0.0 binding"
git push
```

2. Railway автоматически подхватит изменения

## Проверка после деплоя:
```bash
curl https://tourgid-production-8074.up.railway.app/health
```

## Основные исправления:
- ✅ Добавлена привязка к `0.0.0.0` в server.js
- ✅ Упрощен Procfile: `web: node server.js`
- ✅ Увеличен healthcheck timeout до 60 сек
- ✅ Добавлены дополнительные health endpoints

## Если не работает:
1. Проверить Railway логи
2. Убедиться что PORT переменная передается
3. Проверить что все зависимости установлены 