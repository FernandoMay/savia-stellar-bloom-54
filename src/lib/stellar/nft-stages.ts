import type { NFTStage } from './types';

// Shared NFT stages with IPFS metadata — used by both NFTDashboard and DonationFlow
export const nftStages: NFTStage[] = [
  {
    id: 0,
    name: 'Pre-Seed',
    threshold: 0,
    ipfsHash: 'bafybeieeu4ktgwohgciadttcbtt4wlxhkkfhsdyhmdwhnj5us56m4kq4zq',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeieeu4ktgwohgciadttcbtt4wlxhkkfhsdyhmdwhnj5us56m4kq4zq',
    description: 'El inicio de tu viaje — una semilla con potencial infinito',
    color: 'bg-emerald-500',
    attributes: { growth: 'beginning', rarity: 'common' },
  },
  {
    id: 1,
    name: 'Seed',
    threshold: 10,
    ipfsHash: 'bafybeifzg23kcwwksiwinnqv6btjhdulxcaueoqovmgyukotf7sqa3h5c4',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeifzg23kcwwksiwinnqv6btjhdulxcaueoqovmgyukotf7sqa3h5c4',
    description: 'Tu contribución ha plantado la semilla del cambio',
    color: 'bg-green-600',
    attributes: { growth: 'planted', rarity: 'common' },
  },
  {
    id: 2,
    name: 'Sprout',
    threshold: 25,
    ipfsHash: 'bafybeie6xmmlw7pmzlhmasbbvha2jqpf4lattqyqj2narten2vmx2dvbmi',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeie6xmmlw7pmzlhmasbbvha2jqpf4lattqyqj2narten2vmx2dvbmi',
    description: 'Creciendo fuerte con el apoyo de la comunidad',
    color: 'bg-lime-500',
    attributes: { growth: 'sprouting', rarity: 'uncommon' },
  },
  {
    id: 3,
    name: 'Bloom',
    threshold: 50,
    ipfsHash: 'bafybeids4vqoebp7dixaobwmkxlh4p775r2gbsyf6e4xs7pgrrlirwnvxe',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeids4vqoebp7dixaobwmkxlh4p775r2gbsyf6e4xs7pgrrlirwnvxe',
    description: 'Floreciendo gracias a tu generosidad',
    color: 'bg-yellow-500',
    attributes: { growth: 'blooming', rarity: 'rare' },
  },
  {
    id: 4,
    name: 'Blossom',
    threshold: 100,
    ipfsHash: 'bafybeictob6srht3l6bt5xwusq36ec4hjcafc36rf6wikwpsizheznifdu',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeictob6srht3l6bt5xwusq36ec4hjcafc36rf6wikwpsizheznifdu',
    description: 'Plena floración lograda con la unidad comunitaria',
    color: 'bg-orange-500',
    attributes: { growth: 'blossoming', rarity: 'rare' },
  },
  {
    id: 5,
    name: 'Tree',
    threshold: 200,
    ipfsHash: 'bafybeicpgsq3ukcs4md4ymn76f6pcikux3lowwi2lehirk35xarlrlciee',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeicpgsq3ukcs4md4ymn76f6pcikux3lowwi2lehirk35xarlrlciee',
    description: 'De pie como testamento de generosidad',
    color: 'bg-purple-500',
    attributes: { growth: 'mature', rarity: 'epic' },
  },
  {
    id: 6,
    name: 'Savia Tree',
    threshold: 500,
    ipfsHash: 'bafybeidvrhyqx3hczob2ctqjigkkcya7iwbbgzntad2agnezp5zijc75w4',
    imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeidvrhyqx3hczob2ctqjigkkcya7iwbbgzntad2agnezp5zijc75w4',
    description: 'Un ecosistema entero nacido de tus contribuciones',
    color: 'bg-indigo-500',
    attributes: { growth: 'ecosystem', rarity: 'legendary' },
  },
];

// Map peso amounts to NFT stage thresholds (XLM-based)
// DonationFlow uses MXN, so we convert: threshold XLM * pesoRate = MXN threshold
export const getStageForXLM = (totalXLM: number) => {
  return nftStages.reduce((prev, curr) => {
    return totalXLM >= curr.threshold ? curr : prev;
  }, nftStages[0]);
};

export const getNextStageForXLM = (totalXLM: number) => {
  const current = getStageForXLM(totalXLM);
  const nextIdx = current.id + 1;
  return nextIdx < nftStages.length ? nftStages[nextIdx] : null;
};
