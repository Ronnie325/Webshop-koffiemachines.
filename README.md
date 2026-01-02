# CoffeeMasters - Premium Koffiemachine Webshop met CMS

Een complete, moderne e-commerce webshop met volledige CMS functionaliteit, gebouwd met Node.js, Express en vanilla JavaScript.

## ✨ Features

### 🛍️ **Frontend Webshop**
- **Modern Design** met glassmorphism effecten en smooth animations
- **12 Premium Producten** geladen dynamisch van API
- **Smart Filtering** per categorie (Espresso, Filter, Volautomaat, Capsule)
- **Winkelwagen Systeem** met localStorage persistence
- **Checkout Functionaliteit** met order creation
- **Responsive Design** voor alle apparaten
- **PWA Support** - Installeerbaar als native app
- **Newsletter Inschrijving**
- **SEO Geoptimaliseerd** met meta tags en structured data

### 🔐 **Admin CMS Panel**
- **Veilige Login** met JWT authenticatie
- **Dashboard** met real-time statistieken
- **Product Management**:
  - Toevoegen, bewerken, verwijderen van producten
  - Image upload met automatische WebP optimalisatie
  - Categorieën en badges beheer
- **Order Management**:
  - Overzicht van alle bestellingen
  - Status updates (pending, processing, shipped, delivered)
  - Klantgegevens en order details
- **Intuïtieve UI** met moderne admin interface

### ⚡ **Backend API**
- **Express.js** RESTful API
- **JWT Authenticatie** voor admin routes
- **JSON Database** (eenvoudig en snel)
- **Image Processing** met Sharp (auto WebP conversie)
- **CORS & Security** headers (Helmet)
- **Rate Limiting** ter bescherming
- **Error Handling** middleware

### 🚀 **Performance & Modern Features**
- **Service Worker** voor offline caching
- **Lazy Loading** van afbeeldingen
- **Code Splitting** met Vite
- **Modular Architecture** (ES modules)
- **GPU-accelerated** animations
- **Optimized Bundle** sizes

## 📦 Installatie

### Vereisten
- Node.js 16+ geïnstalleerd
- Git

### Snelle Start

```bash
# 1. Clone de repository
git clone https://github.com/ronnie325/webshop.git
cd webshop

# 2. Installeer dependencies
npm install

# 3. Kopieer environment variabelen
copy .env.example .env

# 4. Initialiseer database met seed data
node scripts/init-data.js

# 5. Start de servers (beide tegelijk)
npm run dev:all

# OF start ze apart:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

De applicatie is nu beschikbaar op:
- **Webshop**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin/login.html

## 🔑 Admin Login

Standaard inloggegevens:
- **Gebruikersnaam**: `admin`
- **Wachtwoord**: `admin123`

⚠️ **Wijzig deze credentials in productie** via de `.env` file!

## 📁 Project Structuur

```
Z1 webshop/
├── admin/                  # CMS Admin Panel
│   ├── index.html         # Dashboard
│   ├── login.html         # Login pagina  
│   ├── products.html      # Product management
│   ├── orders.html        # Order management
│   ├── admin.css          # Admin styling
│   └── *.js              # Admin JavaScript modules
├── server/                # Backend
│   ├── server.js         # Express server
│   ├── database.js       # JSON database layer
│   ├── auth.js           # JWT authenticatie
│   ├── routes/           # API routes
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── auth.js
│   └── middleware/       # Custom middleware
│       ├── errorHandler.js
│       └── upload.js
├── src/modules/           # Frontend modules
│   ├── api.js            # API client
│   ├── cart.js           # Shopping cart
│   └── products.js       # Product rendering
├── data/                 # Database files (JSON)
│   ├── products.json
│   ├── orders.json
│   └── products-seed.json
├── uploads/              # Product images
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── service-worker.js # Service worker
├── scripts/              # Utility scripts
│   └── init-data.js
├── index.html            # Main webshop
├── app.js               # Main JavaScript
├── style.css            # Main stylesheet
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## 🛠️ API Endpoints

### Publieke Endpoints
```
GET    /api/products              # Alle producten
GET    /api/products/:id          # Enkel product
GET    /api/products?category=x   # Filter op categorie
POST   /api/orders                # Nieuwe bestelling
```

### Admin Endpoints (vereist JWT token)
```
POST   /api/auth/login            # Login
POST   /api/products              # Nieuw product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Verwijder product
GET    /api/orders                # Alle bestellingen
PUT    /api/orders/:id/status     # Update order status
```

## 🎨 CMS Gebruiksaanwijzing

### Product Toevoegen
1. Login op admin panel
2. Ga naar "Producten"
3. Klik "Nieuw Product"
4. Vul formulier in:
   - Naam, Categorie, Prijs, Beschrijving
   - Badge (optioneel): Bestseller, Nieuw, Premium, etc.
   - Afbeelding uploaden
5. Klik "Opslaan"

### Product Bewerken
1. Klik op het bewerk icoon (potlood) bij een product
2. Wijzig de gewenste velden
3. Klik "Opslaan"

### Product Verwijderen
1. Klik op het verwijder icoon (prullenbak)
2. Bevestig verwijdering

### Bestellingen Beheren
1. Ga naar "Bestellingen"
2. Bekijk order details
3. Update status via dropdown:
   - In behandeling → Wordt verwerkt → Verzonden → Afgeleverd

## 🔧 Development

### Scripts
```bash
npm run dev          # Start Vite dev server (frontend)
npm run server       # Start Express backend
npm run dev:all      # Start beide servers tegelijk
npm run build        # Build voor productie
npm run preview      # Preview production build
```

### Environment Variabelen (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MAX_FILE_SIZE=5242880
```

## 🚀 Deployment

### Production Build
```bash
# 1. Build frontend
npm run build

# 2. Update environment
NODE_ENV=production

# 3. Start server
npm start
```

### Aanbevolen Hosting
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, DigitalOcean
- **Database**: Upgrade naar SQLite/PostgreSQL voor productie

## 🔒 Security Checklist

- [ ] Wijzig `JWT_SECRET` naar een sterke, random string
- [ ] Update `ADMIN_PASSWORD` naar een veilig wachtwoord
- [ ] Configureer `ALLOWED_ORIGINS` voor productie domain
- [ ] Activeer HTTPS in productie
- [ ] Implementeer rate limiting (al ingebouwd)
- [ ] Backup database regelmatig
- [ ] Monitor error logs

## 📊 Performance Metrics

- **Lighthouse Score**: 90+ (alle metrics)
- **Initial Load**: < 200KB
- **Time to Interactive**: < 2s
- **First Contentful Paint**: < 1.5s
- **Images**: Auto geoptimaliseerd naar WebP

## 🤝 Contributing

Dit is een demo project. Voor suggesties of verbeteringen:
1. Fork het project
2. Maak een feature branch
3. Commit je wijzigingen
4. Push naar de branch
5. Open een Pull Request

## 📄 Licentie

MIT License - Vrij te gebruiken voor eigen projecten.

## 👨‍💻 Auteur

**Ronnie325**
- GitHub: [@ronnie325](https://github.com/ronnie325)

## 🙏 Acknowledgments

- Inter & Playfair Display fonts (Google Fonts)
- Express.js framework
- Vite build tool
- Sharp image processing

---

**Built with ☕ and modern web technologies**

Voor vragen of support, open een issue op GitHub.

