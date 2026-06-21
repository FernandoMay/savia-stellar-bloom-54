# Savia 🌿

Plataforma de crowdfunding médico sobre la blockchain de **Stellar** con **NFTs evolutivos**.

---

## 📋 Índice

- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Integración Stellar](#-integración-stellar)
- [Sistema de NFTs](#-sistema-de-nfts)
- [Rutas de la aplicación](#-rutas-de-la-aplicación)
- [Servicios backend](#-servicios-backend)
- [Variables de entorno](#-variables-de-entorno)
- [Desarrollo local](#-desarrollo-local)
- [Despliegue a producción](#-despliegue-a-producción)
- [Despliegue del contrato Soroban](#-despliegue-del-contrato-soroban)
- [App Flutter](#-app-flutter)
- [Estructura del proyecto](#-estructura-del-proyecto)

---

## 🛠 Stack tecnológico

| Capa         | Tecnología                                                   |
|------------- |--------------------------------------------------------------|
| Frontend     | React 18 + TypeScript + Vite 5                               |
| Estilos      | Tailwind CSS 3 + shadcn/ui + Radix UI primitives             |
| Estado       | React Context + TanStack Query                               |
| Blockchain   | Stellar (Soroban smart contracts) + Freighter wallet         |
| NFTs         | IPFS (Pinata) + 7 etapas evolutivas                          |
| Formularios  | React Hook Form + Zod                                        |
| Ruteo        | React Router DOM v6                                          |
| Componentes  | Lucide React iconos + Recharts gráficas                      |

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────┐
│                    Cliente                        │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  React App  │  │  shadcn  │  │  TanStack   │  │
│  │  (SPA)      │  │  /Radix  │  │  Query      │  │
│  └──────┬──────┘  └──────────┘  └─────────────┘  │
│         │                                          │
│  ┌──────┴──────────────────────────────────┐      │
│  │          Capa de Servicios              │      │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────┐  │      │
│  │  │  KYC     │ │ Campaign │ │ Stellar │  │      │
│  │  │ Service  │ │ Service  │ │ Lib     │  │      │
│  │  └──────────┘ └──────────┘ └─────────┘  │      │
│  └──────┬──────────────┬───────────────────┘      │
│         │              │                           │
└─────────┼──────────────┼───────────────────────────┘
          │              │
     ┌────┴────┐   ┌────┴────────┐
     │   API   │   │   Stellar   │
     │  REST   │   │  Testnet/   │
     │ Backend │   │  Public     │
     └─────────┘   │ (Soroban +  │
                   │  Horizon)   │
                   └─────────────┘
```

**Flujo principal:**
1. Usuario conecta wallet Freighter → se obtiene clave pública
2. Crea campaña → datos van a API REST o localStorage (fallback local-first)
3. Donación → pago XLM via Stellar + registro on-chain opcional
4. KYC → verificación CURP/teléfono → se almacena localmente o en API
5. NFT → al alcanzar thresholds, se mintea via contrato Soroban

---

## ⚡ Integración Stellar

### Wallet (Freighter)
- `src/lib/stellar/wallet.ts` — Conexión, firma, friendbot
- `src/hooks/use-stellar-wallet.ts` — Hook React con auto-reconexión y balance
- Solo testnet usa friendbot para financiar cuentas nuevas automáticamente

### Red Stellar
- `src/lib/stellar/config.ts` — Configuración leída de variables de entorno
- Valores por defecto apuntan a **Testnet**
- Para mainnet, cambiar `VITE_STELLAR_NETWORK=public` en `.env`

### Soroban Smart Contract
- `src/lib/stellar/soroban.js` — Interacción con el contrato Soroban
- Funciones: `mintNFTOnSoroban()` (minteo de NFT) y `sendDonationPayment()` (pago XLM)
- El contrato debe desplegarse por separado (ver [sección de despliegue](#-despliegue-del-contrato-soroban))
- **No hay stubs ni mocks** — si el contrato no está desplegado, la transacción falla con error real

---

## 🎴 Sistema de NFTs

7 etapas evolutivas que el donante obtiene según el monto total donado:

| Etapa      | Threshold (XLM) | Rareza   |
|-----------|-----------------|----------|
| Pre-Seed  | 0               | Common   |
| Seed      | 10              | Common   |
| Sprout    | 25              | Uncommon |
| Bloom     | 50              | Rare     |
| Blossom   | 100             | Rare     |
| Tree      | 200             | Epic     |
| Savia Tree| 500             | Legendary|

- Metadata e imágenes almacenadas en **IPFS via Pinata**
- Hashes reales en `src/lib/stellar/nft-stages.ts`
- La UI muestra el progreso hacia la siguiente etapa

---

## 🗺 Rutas de la aplicación

| Ruta                  | Componente       | Descripción                        |
|----------------------|-----------------|------------------------------------|
| `/`                  | `Index`         | Landing con hero, campañas, FAQ    |
| `/nft-dashboard`     | `Dashboard`     | Panel con NFTs y balance XLM       |
| `/create-campaign`   | `CreateCampaign`| Formulario multi-paso de campaña   |
| `/donation-flow/:id` | `Donation`      | Flujo de donación con wallet       |
| `/kyc-verification`  | `KYCPage`       | Verificación de identidad (KYC)    |
| `*`                  | `NotFound`      | Página 404                         |

---

## 🔧 Servicios backend

Cuando `VITE_API_URL` está definida, todos los servicios apuntan a REST endpoints.
Si no está definida, usan **localStorage** como almacén local-first (producción sin servidor).

| Servicio            | Endpoints                                   | Fallback local      |
|--------------------|---------------------------------------------|---------------------|
| Campaign Service   | `GET /campaigns`, `POST /campaigns`, etc.   | `localStorage`      |
| KYC Service        | `POST /kyc/basic`, `POST /kyc/medical`      | `localStorage`      |
| Donations          | `POST /donations`, `GET /campaigns/:id/donations` | `localStorage` |

Para entorno serverless, el **localStorage** actúa como almacenamiento persistente en el navegador.
Para producción con servidor, define `VITE_API_URL` y todos los datos viajan por HTTP.

---

## 🌐 Variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_CONTRACT_ID=CBXRIIYHKP6VU63KSLGBQ4GJ5FVTSAKTS4ZB3JEJJSQTCO6D3C2JVJIV
VITE_FRIENDBOT_URL=https://friendbot.stellar.org
VITE_API_URL=https://api.tudominio.com
VITE_APP_NAME=Savia
```

Ver `.env.example` para referencia completa.

---

## 👨‍💻 Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Linter
npm run lint
```

---

## 🚀 Despliegue a producción

1. **Compilar:**
   ```bash
   npm run build
   ```
   El output queda en `dist/`.

2. **Desplegar `dist/`** en cualquier hosting estático:
   - Vercel, Netlify, Cloudflare Pages, S3 + CloudFront
   - Configurar SPA fallback (redirigir todas las rutas a `index.html`)

3. **Variables de entorno en producción:**
   - Configurar `VITE_STELLAR_NETWORK=public` para mainnet
   - Apuntar `VITE_HORIZON_URL` y `VITE_SOROBAN_RPC_URL` a mainnet
   - Si hay backend, configurar `VITE_API_URL`

4. **Optimizaciones incluidas:**
   - Code splitting con `React.lazy()`
   - Chunks separados por ruta
   - Compresión gzip (410 kB gzippeados total)

---

## 📜 Despliegue del contrato Soroban

El contrato Soroban debe desplegarse por separado. Este repositorio solo contiene el frontend.

```bash
# Requisitos: Rust + Soroban CLI
# 1. Construir el contrato
cd contrato-savia
cargo build --release --target wasm32-unknown-unknown

# 2. Desplegar en testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contrato_savia.wasm \
  --source SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# 3. Copiar el CONTRACT_ID al .env del frontend
```

**Funciones del contrato esperadas:**
- `mint(owner: Address, metadata: String, stage: u32)` → mintea un NFT
- `transfer(from: Address, to: Address, token_id: u32)` → transfiere NFT
- `balance_of(owner: Address)` → consulta NFTs de un usuario

---

## 📱 App Flutter

La versión Flutter de Savia está en el directorio `savia-flutter/`.

```bash
cd savia-flutter
flutter pub get
flutter run
```

Comparte el mismo diseño, paleta de colores y lógica de Stellar usando `stellar_flutter_sdk`.

---

## 📁 Estructura del proyecto

```
savia-stellar-bloom-54/
├── public/                  # Archivos estáticos
├── src/
│   ├── App.tsx              # Router + providers + lazy routes
│   ├── main.tsx             # Entry point
│   ├── index.css            # Variables CSS (design system)
│   ├── pages/               # Páginas (cada una lazy-loaded)
│   │   ├── Index.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CreateCampaign.tsx
│   │   ├── Donation.tsx
│   │   ├── KYCPage.tsx
│   │   └── NotFound.tsx
│   ├── components/          # Componentes de UI
│   │   ├── ui/              # 40 primitivas shadcn/ui
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CampaignsSection.tsx
│   │   ├── CampaignCard.tsx
│   │   ├── DonationFlow.tsx
│   │   ├── CreateCampaignForm.tsx
│   │   ├── KYCVerification.tsx
│   │   ├── NFTDashboard.tsx
│   │   ├── HowItWorksSection.tsx
│   │   └── Footer.tsx
│   ├── services/            # Capa de servicios (API + fallback local)
│   │   ├── api-client.ts
│   │   ├── campaign-service.ts
│   │   └── kyc-service.ts
│   ├── hooks/               # Hooks personalizados
│   │   └── use-stellar-wallet.ts
│   ├── context/             # Contextos de React
│   │   └── CampaignContext.tsx
│   └── lib/
│       └── stellar/         # Integración Stellar
│           ├── config.ts
│           ├── types.ts
│           ├── wallet.ts
│           ├── soroban.ts
│           └── nft-stages.ts
├── .env.example
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📄 Licencia

MIT — Open source.
