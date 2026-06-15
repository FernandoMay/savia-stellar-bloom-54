# Savia Stellar Bloom 54

Plataforma de crowdfunding médico y social sobre la red Stellar. Las donaciones gamifican con NFTs dinámicos que evolucionan (Semilla → Árbol Savia) y validación de identidad KYC para México.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vite + React 18 + TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Blockchain | Stellar Testnet (Soroban + Horizon) |
| Wallet | Freighter (extensión navegador) |
| NFTs | IPFS / Pinata (7 etapas de crecimiento) |
| Estado | TanStack React Query + Context |
| Formularios | React Hook Form + Zod |
| CI/CD | GitHub Actions |

## Funcionalidades

- Listado de campañas médicas/sociales con meta, progreso y verificación
- Conexión a wallet Freighter (Stellar) con auto-funding via Friendbot
- Flujo de donación: MXN → XLM (tasa fija 18 MXN/XLM) + comisión 2%
- Envío real de pagos Stellar vía Horizon API
- NFTs gamificados: 7 etapas (Pre-Seed → Seed → Sprout → Bloom → Blossom → Tree → Savia Tree)
- Dashboard NFT con historial, insignias desbloqueadas y progreso
- KYC multinivel: CURP + teléfono (básico) y cédula profesional (médico)
- Creación de campañas con formulario y documentos médicos
- Diseño responsivo con sistema de diseño Savia (teal/verde/amarillo)

## Estructura

```
src/
├── components/             # UI shadcn + componentes de negocio
│   ├── ui/                 # ~40 primitivas shadcn/ui
│   ├── DonationFlow.tsx    # Flujo de donación + NFT preview
│   ├── NFTDashboard.tsx    # Dashboard de NFTs del usuario
│   └── KYCVerification.tsx # Validación de identidad
├── context/
│   └── CampaignContext.tsx  # Estado de campañas (localStorage)
├── hooks/
│   ├── use-stellar-wallet.ts  # Hook conexión Freighter
│   └── use-toast.ts / use-mobile.tsx
├── lib/stellar/
│   ├── config.ts           # Config Stellar testnet
│   ├── wallet.ts           # Conexión Freighter + Friendbot
│   ├── soroban.ts          # SDK Stellar (pagos + mint NFT)
│   └── nft-stages.ts       # 7 etapas NFT con IPFS
└── pages/
    ├── Index.tsx           # Landing page
    ├── Dashboard.tsx       # NFT dashboard
    ├── Donation.tsx        # Flujo de donación
    └── KYCPage.tsx         # KYC verification
```

## Inicio rápido

```bash
npm install
npm run dev
```

Requiere extensión Freighter Wallet en el navegador.

## Pruebas

```bash
npm run build
```

## Notas

- Usa Stellar Testnet (no mainnet) — sin fondos reales
- CURP: documento de identidad mexicano de 18 caracteres
- Campañas demo precargadas (cáncer, diabetes, etc.)
- Contrato Soroban simulado cuando no está desplegado
