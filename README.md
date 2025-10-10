# CutCraft Landing Page

Modern landing page для CutCraft - AI контент-генератор в Telegram.

🌐 **Live**: [cutcraft.cc](https://cutcraft.cc)
📱 **Telegram Bot**: [@CutCraftBot](https://t.me/CutCraftBot)

---

## ⚡ Tech Stack (2025)

- **Vite 7.1.9** - Build tool с HMR и Lightning CSS
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Modern CSS** - light-dark(), @starting-style, container queries
- **PWA** - Service Worker, offline support, installable
- **GitHub Pages** - Deployment платформа

---

## 🎯 Performance

- **Lighthouse**: 100/100/100/100 🎯
- **Bundle size**: <50KB (JS+CSS gzipped)
- **First Contentful Paint**: <1.0s
- **Largest Contentful Paint**: <2.0s
- **Cumulative Layout Shift**: <0.05

---

## 🚀 Development

```bash
# Install dependencies
bun install

# Dev server с HMR (http://localhost:5173)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

---

## 📁 Structure

```
pages-landing/
├── public/              # Static assets
│   ├── sw.js           # Service Worker (PWA)
│   ├── manifest.json   # Web App Manifest
│   ├── favicon.svg     # Favicon (SVG)
│   ├── og-image.png    # Open Graph image (1200x630)
│   ├── qr-code.webp    # QR code (optimized)
│   └── *.png           # PWA icons (192, 512, apple-touch)
├── src/
│   ├── app.js          # Main JavaScript
│   ├── main.css        # Tailwind + custom CSS
│   └── 404.css         # 404 page styles
├── scripts/
│   ├── generate-sitemap.js  # Sitemap generator
│   └── generate-icons.sh    # PWA icons generator
├── index.html          # Main page
├── 404.html            # 404 error page
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

---

## 🎨 Modern CSS Features (2025)

- **`light-dark()`** - Automatic light/dark theme support
- **`@starting-style`** - Entry animations без JavaScript
- **`text-wrap: pretty`** - Улучшенный text wrapping
- **Container Queries** - Responsive компоненты
- **`@property`** - Typed custom properties

---

## 🔧 Build Features

- **Dynamic versioning** - Читает версию из `package.json`
- **Git hash в assets** - Автоматический cache busting
- **Lightning CSS** - Минификация CSS (быстрее esbuild)
- **Multiple entry points** - index.html + 404.html
- **No modulePreload polyfill** - Только современные браузеры

---

## 🌐 SEO Optimizations

- **JSON-LD** - SoftwareApplication, Organization, BreadcrumbList, FAQPage
- **Sitemap.xml** - С image extensions для лучшей индексации
- **Open Graph** - Full meta tags для social sharing
- **Structured Data** - aggregateRating, offers
- **Meta tags** - Полный набор для SEO

---

## 📱 PWA Features

- **Service Worker** - Cache-First для assets, Network-First для HTML
- **Installable** - Add to Home Screen
- **Offline support** - Работает без интернета
- **Web Share API** - share_target в manifest
- **Shortcuts** - Прямой линк на бота

---

## 🧪 Testing

```bash
# Run Lighthouse CI
npx lhci autorun

# Check bundle size
bun run build
du -sh dist/

# Validate HTML (in CI)
# GitHub Actions автоматически проверяет при deploy
```

---

## 📝 Deployment

**Automatic**: Push в `master` → GitHub Actions → GitHub Pages

```bash
git add .
git commit -m "feat: your changes"
git push origin master
```

GitHub Actions workflow:
1. ✅ Build (`bun run build`)
2. ✅ Validate HTML (no inline styles)
3. ✅ Check bundle size (<150KB limit)
4. ✅ Deploy to GitHub Pages
5. ✅ Run Lighthouse CI (score >= 95)

---

## 🔐 Security

- **Content Security Policy** - No unsafe-inline (кроме 404.html fallback)
- **Subresource Integrity** - Для всех external scripts
- **HTTPS only** - GitHub Pages автоматически
- **No vulnerabilities** - Regular `bun update`

---

## 🛠️ Maintenance

```bash
# Update dependencies
bun update

# Regenerate PWA icons (требует ImageMagick)
./scripts/generate-icons.sh

# Regenerate sitemap (автоматически при build)
node scripts/generate-sitemap.js

# Check bundle size
bun run build && du -sh dist/
```

---

## 📊 Browser Support

**Target**: `baseline-widely-available` (Vite 7)

- ✅ Chrome 107+
- ✅ Edge 107+
- ✅ Firefox 104+
- ✅ Safari 16+

---

## 📄 License

© 2025 CutCraft. All rights reserved.

---

## 🤝 Contributing

Это подпроект pages-landing внутри основного репозитория cutcraft2.
Вся документация (.md файлы) живет здесь.

**Перед коммитом**:
1. `bun run build` - проверить что билдится
2. `bun run preview` - проверить локально
3. Убедиться что Lighthouse >= 95

---

## 📚 Links

- [Vite Documentation](https://vite.dev)
- [Tailwind CSS 4.1](https://tailwindcss.com/docs)
- [GitHub Pages](https://pages.github.com)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
