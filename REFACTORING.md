# Refactoring Log - pages-landing (2025-10-09)

## Цель

Модернизация landing page с Tailwind 4.1 и Vite 7, устранение копипасты,
улучшение производительности и доступности.

---

## ✅ Что РЕАЛЬНО улучшено

### 1. CSS (src/main.css)

**Изменения:**

- Добавлен `@media (prefers-reduced-motion: reduce)` для доступности
- Создали utility классы: `.feature-card`, `.payment-card`, `.model-card`,
  `.cta-button`
- Убрали дублирование glassmorphism стилей (было 15+ повторений в HTML)

**Проверка:**

- ✅ Build проходит
- ✅ Классы используются в HTML (grep показал 14 использований)
- ✅ Размер CSS: 18KB (gzip 4.22KB) - нормально

**Почему БЕЗ @apply:**

- Tailwind 4.1 не позволяет `@apply card-glass` внутри того же
  `@layer components`
- Решение: явное дублирование glassmorphism свойств в каждом utility классе

---

### 2. JavaScript (src/app.js)

**Изменения:**

- Добавлен
  `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Intersection Observer: `rootMargin: '50px'` (триггер раньше), `threshold: 0.1`
- `observer.unobserve()` после первого показа (оптимизация)
- `scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })`

**Проверка:**

- ✅ Build проходит
- ✅ Логика корректная (если prefers-reduced-motion → сразу все видимо, без
  анимаций)
- ✅ Размер JS: 1.45KB (gzip 0.75KB)

---

### 3. HTML (index.html, 404.html)

**Изменения:**

- Заменили 15+ повторений длинных классов на utility (`.feature-card`,
  `.payment-card`, `.model-card`, `.cta-button`)
- Добавили `<main>` для семантики
- Добавили `rel="preconnect" href="https://t.me"`
- QR код: `loading="lazy" width="256" height="256"`

**Проверка:**

- ✅ Build проходит
- ✅ HTML валидный
- ✅ Размеры: index 14.7KB (gzip 3.14KB), 404 1.42KB (gzip 0.75KB)

---

### 4. Vite Config (vite.config.js)

**Финальная версия (МИНИМАЛЬНАЯ):**

```javascript
export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        404: '/404.html',
      },
    },
  },
});
```

**Почему только это:**

- `rollupOptions.input` - НУЖЕН для 2 HTML файлов (не дефолт)
- `define.__APP_VERSION__` - НУЖЕН для версии в консоли
- Всё остальное - ДЕФОЛТЫ Vite 7:
  - `target: 'baseline-widely-available'` (дефолт)
  - `minify: 'esbuild'` (дефолт)
  - `reportCompressedSize: true` (дефолт)
  - `sourcemap: false` для production (дефолт)
  - `chunkSizeWarningLimit: 500` (дефолт)
  - Asset naming с хешами (дефолт)

**Проверка:**

- ✅ Build проходит
- ✅ Хеши в именах файлов есть: `app-CC7v6PV8.css`, `app-eAP0NFcQ.js`
- ✅ Время билда: 232ms

---

### 5. GitHub Actions (.github/workflows/deploy.yml)

**Изменения:**

- Добавлен кэш Bun dependencies: `~/.bun/install/cache`
- **ВАЖНО**: `pages-landing` УЖЕ корень репозитория!
  - НЕ НУЖНО `working-directory: pages-landing`
  - НЕ НУЖНО `paths: ['pages-landing/**']`
  - hashFiles('bun.lock') БЕЗ префикса
  - path: ./dist БЕЗ префикса

**Проверка:**

- ✅ `git rev-parse --show-toplevel` →
  `/home/michael/projects/cutcraft2/pages-landing`
- ✅ `bun.lock` существует в корне
- ✅ Путь кэша `~/.bun/install/cache` корректный (из Bun docs)

---

## ❌ Что было ОШИБКОЙ (исправлено)

### 1. @custom-media в CSS

**Было:**

```css
@custom-media --sm (min-width: 640px);
@custom-media --md (min-width: 768px);
@custom-media --lg (min-width: 1024px);
```

**Проблема:**

- Дублируют встроенные брейкпоинты Tailwind 4.1
- Не использовались нигде (классы `sm:`, `md:`, `lg:` работают без них)

**Исправлено:** Удалены

---

### 2. Избыточный конфиг Vite

**Было:**

```javascript
target: 'esnext',
minify: 'esbuild',
cssMinify: 'lightningcss',
reportCompressedSize: true,
sourcemap: false,
chunkSizeWarningLimit: 500,
manualChunks: undefined,
assetFileNames: 'assets/[name]-[hash][extname]',
chunkFileNames: 'assets/[name]-[hash].js',
entryFileNames: 'assets/[name]-[hash].js'
```

**Проблема:**

- 90% дублируют дефолты Vite 7
- `cssMinify: 'lightningcss'` избыточен (@tailwindcss/vite уже использует
  LightningCSS)
- `target: 'esnext'` слишком новый (дефолт 'baseline-widely-available' лучше)

**Исправлено:** Удалено всё кроме `rollupOptions.input` (действительно нужен)

---

### 3. Неправильные пути в GitHub Actions

**Было:**

```yaml
paths:
  - 'pages-landing/**'
defaults:
  run:
    working-directory: pages-landing
key: ${{ runner.os }}-bun-${{ hashFiles('pages-landing/bun.lock') }}
path: pages-landing/dist
```

**Проблема:**

- `pages-landing` УЖЕ корень репозитория, не поддиректория!
- Все пути должны быть относительно корня

**Исправлено:** Убраны префиксы `pages-landing/`

---

## 📊 Итоговые метрики

**Размеры файлов:**

- 404.html: 1.42 KB (gzip: 0.75 KB)
- index.html: 14.70 KB (gzip: 3.14 KB)
- CSS: 18.04 KB (gzip: 4.22 KB)
- JS: 1.45 KB (gzip: 0.75 KB)

**Время билда:** 232ms

**Код:**

- Убрано ~30 строк дублирования в vite.config.js
- Убрано 3 строки @custom-media
- Убрано 15+ повторений длинных классов в HTML
- Добавлена поддержка prefers-reduced-motion

---

## 🎯 Чеклист перед изменениями

**Перед добавлением конфига:**

1. [ ] Проверил что это НЕ дефолт Vite/Tailwind
2. [ ] Проверил что это действительно используется
3. [ ] Проверил что это не дублирует существующий функционал

**Перед добавлением CSS:**

1. [ ] Проверил нет ли дублирования
2. [ ] Проверил что класс используется в HTML
3. [ ] Попробовал билд

**Перед изменением GitHub Actions:**

1. [ ] Проверил структуру репозитория (`git rev-parse --show-toplevel`)
2. [ ] Проверил что файлы существуют (bun.lock, dist/)
3. [ ] Проверил документацию setup-bun про кэширование

---

## 🚀 Что работает

- ✅ Production build успешен
- ✅ prefers-reduced-motion корректно обрабатывается
- ✅ Intersection Observer оптимизирован
- ✅ Utility классы устранили копипасту
- ✅ GitHub Actions кэширование настроено
- ✅ Semantic HTML для SEO
- ✅ Accessibility улучшена

---

**Дата:** 2025-10-09 **Время:** ~2 часа (включая исправление ошибок) **Выводы:**
ВСЕГДА проверять дефолты ПЕРЕД добавлением конфига!
