import React, { useState, useEffect } from 'react';
import { Wallet, Leaf, Gift, TrendingUp, Star, Trophy, Crown, Diamond, Download, RefreshCw } from 'lucide-react';

const StellarNFTDashboard = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [userWallet, setUserWallet] = useState(null);
  const [nftCollection, setNftCollection] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [walletType, setWalletType] = useState('');
  const [stellarSdk, setStellarSdk] = useState(null);
  const [dbConnection, setDbConnection] = useState(null);
  const [processedImages, setProcessedImages] = useState({});

  // App constants
  const APP_NAME = 'Savia';
  const STELLAR_NETWORK = 'testnet';
  const CONTRACT_ID = 'CCJZ5DGASBWKOKQMHGHM3XFIVVR7QFGXM44CXCQZGQWQZXVQZXVQZXVQ';
  const HORIZON_URL = 'https://horizon-testnet.stellar.org';
  const ETHERFUSE_API_URL = 'https://api.etherfuse.com';

  // NFT stages with thresholds and IPFS metadata
  const nftStages = [
    {
      id: 0,
      name: 'Pre-Seed',
      threshold: 0,
      ipfsHash: 'bafybeieeu4ktgwohgciadttcbtt4wlxhkkfhsdyhmdwhnj5us56m4kq4zq',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeieeu4ktgwohgciadttcbtt4wlxhkkfhsdyhmdwhnj5us56m4kq4zq',
      description: 'The beginning of your journey - a tiny seed with infinite potential',
      icon: <Leaf className="w-6 h-6" />,
      color: 'bg-green-500',
      attributes: { growth: 'beginning', rarity: 'common' }
    },
    {
      id: 1,
      name: 'Seed',
      threshold: 10,
      ipfsHash: 'bafybeifzg23kcwwksiwinnqv6btjhdulxcaueoqovmgyukotf7sqa3h5c4',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeifzg23kcwwksiwinnqv6btjhdulxcaueoqovmgyukotf7sqa3h5c4',
      description: 'Your contribution has planted the seed of change',
      icon: <Gift className="w-6 h-6" />,
      color: 'bg-emerald-500',
      attributes: { growth: 'planted', rarity: 'common' }
    },
    {
      id: 2,
      name: 'Sprout',
      threshold: 25,
      ipfsHash: 'bafybeie6xmmlw7pmzlhmasbbvha2jqpf4lattqyqj2narten2vmx2dvbmi',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeie6xmmlw7pmzlhmasbbvha2jqpf4lattqyqj2narten2vmx2dvbmi',
      description: 'Growing strong with community support',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-lime-500',
      attributes: { growth: 'sprouting', rarity: 'uncommon' }
    },
    {
      id: 3,
      name: 'Bloom',
      threshold: 50,
      ipfsHash: 'bafybeids4vqoebp7dixaobwmkxlh4p775r2gbsyf6e4xs7pgrrlirwnvxe',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeids4vqoebp7dixaobwmkxlh4p775r2gbsyf6e4xs7pgrrlirwnvxe',
      description: 'Flourishing with your generous contribution',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      attributes: { growth: 'blooming', rarity: 'rare' }
    },
    {
      id: 4,
      name: 'Blossom',
      threshold: 100,
      ipfsHash: 'bafybeictob6srht3l6bt5xwusq36ec4hjcafc36rf6wikwpsizheznifdu',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeictob6srht3l6bt5xwusq36ec4hjcafc36rf6wikwpsizheznifdu',
      description: 'Full bloom achieved through community unity',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-orange-500',
      attributes: { growth: 'blossoming', rarity: 'rare' }
    },
    {
      id: 5,
      name: 'Tree',
      threshold: 200,
      ipfsHash: 'bafybeicpgsq3ukcs4md4ymn76f6pcikux3lowwi2lehirk35xarlrlciee',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeicpgsq3ukcs4md4ymn76f6pcikux3lowwi2lehirk35xarlrlciee',
      description: 'Standing tall as a testament to generosity',
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-purple-500',
      attributes: { growth: 'mature', rarity: 'epic' }
    },
    {
      id: 6,
      name: 'Savia Tree',
      threshold: 500,
      ipfsHash: 'bafybeidvrhyqx3hczob2ctqjigkkcya7iwbbgzntad2agnezp5zijc75w4',
      imageUrl: 'https://coffee-wooden-newt-168.mypinata.cloud/ipfs/bafybeidvrhyqx3hczob2ctqjigkkcya7iwbbgzntad2agnezp5zijc75w4',
      description: 'A whole ecosystem born from your contributions',
      icon: <Diamond className="w-6 h-6" />,
      color: 'bg-indigo-500',
      attributes: { growth: 'ecosystem', rarity: 'legendary' }
    }
  ];

  // Initialize Stellar SDK and Database
  useEffect(() => {
    initializeStellarSDK();
    initializeDatabase();
    processImages();
  }, []);

  // Initialize Stellar SDK
  const initializeStellarSDK = async () => {
    try {
      // Simulate Stellar SDK initialization
      const sdk = {
        Server: class {
          constructor(url) {
            this.url = url;
          }
          async loadAccount(publicKey) {
            return {
              accountId: publicKey,
              sequence: '123456789',
              balances: [{ asset_type: 'native', balance: '1000.0000000' }]
            };
          }
          async submitTransaction(transaction) {
            return { successful: true, hash: 'mock_hash_' + Date.now() };
          }
        },
        Networks: {
          TESTNET: 'Test SDF Network ; September 2015'
        },
        Keypair: {
          fromSecret: (secret) => ({ publicKey: () => 'MOCK_PUBLIC_KEY' })
        },
        TransactionBuilder: class {
          constructor(account, options) {
            this.account = account;
            this.operations = [];
          }
          addOperation(operation) {
            this.operations.push(operation);
            return this;
          }
          setTimeout(timeout) {
            return this;
          }
          build() {
            return { sign: () => {}, toXDR: () => 'mock_xdr' };
          }
        }
      };
      setStellarSdk(sdk);
    } catch (error) {
      console.error('Failed to initialize Stellar SDK:', error);
    }
  };

  // Initialize Database Connection
  const initializeDatabase = async () => {
    try {
      // Simulate database connection
      const db = {
        users: new Map(),
        nfts: new Map(),
        donations: new Map(),
        
        async saveUser(userData) {
          this.users.set(userData.walletAddress, userData);
          return userData;
        },
        
        async getUser(walletAddress) {
          return this.users.get(walletAddress) || null;
        },
        
        async saveNFT(nftData) {
          this.nfts.set(nftData.tokenId, nftData);
          return nftData;
        },
        
        async getUserNFTs(walletAddress) {
          return Array.from(this.nfts.values()).filter(nft => nft.owner === walletAddress);
        },
        
        async saveDonation(donationData) {
          this.donations.set(donationData.id, donationData);
          return donationData;
        },
        
        async getUserDonations(walletAddress) {
          return Array.from(this.donations.values()).filter(d => d.donor === walletAddress);
        }
      };
      setDbConnection(db);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  // Process IPFS Images
  const processImages = async () => {
    const processed = {};
    
    // IPFS gateways for redundancy
    const ipfsGateways = [
      'https://ipfs.io/ipfs/',
      'https://gateway.pinata.cloud/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://dweb.link/ipfs/'
    ];
    
    for (const stage of nftStages) {
      try {
        const primaryUrl = stage.imageUrl;
        const gatewayUrls = ipfsGateways.map(gateway => `${gateway}${stage.ipfsHash}`);
        
        processed[stage.id] = {
          original: primaryUrl,
          thumbnail: primaryUrl,
          optimized: primaryUrl,
          ipfsHash: stage.ipfsHash,
          gatewayUrls: gatewayUrls,
          metadata: {
            processed: true,
            timestamp: Date.now(),
            stage: stage.name,
            ipfsHash: stage.ipfsHash
          }
        };
      } catch (error) {
        console.error(`Failed to process IPFS image for stage ${stage.id}:`, error);
        processed[stage.id] = {
          original: '/api/placeholder/400/400',
          thumbnail: '/api/placeholder/300/300',
          optimized: '/api/placeholder/800/800',
          ipfsHash: stage.ipfsHash,
          gatewayUrls: [],
          metadata: { processed: false }
        };
      }
    }
    
    setProcessedImages(processed);
  };

  // Get IPFS image URL with fallback
  const getIpfsImageUrl = (stageId) => {
    const imageData = processedImages[stageId];
    if (!imageData) return '/api/placeholder/400/400';
    
    // Return the primary IPFS URL
    return imageData.original || '/api/placeholder/400/400';
  };

  // Convert Google Drive URL to direct access (legacy support)
  const convertGoogleDriveUrl = (driveUrl) => {
    if (!driveUrl) return '/api/placeholder/400/400';
    const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return fileId ? `https://drive.google.com/uc?id=${fileId[1]}` : '/api/placeholder/400/400';
  };

  // Wallet Connection Functions
  const connectFreighter = async () => {
    try {
      // Simulate Freighter wallet connection
      if (typeof window !== 'undefined' && window.freighter) {
        const publicKey = await window.freighter.getPublicKey();
        return { publicKey, type: 'freighter' };
      }
      throw new Error('Freighter wallet not found');
    } catch (error) {
      // Fallback to mock connection
      return { publicKey: 'GABC123FREIGHTER456XYZ789', type: 'freighter' };
    }
  };

  const connectLobstr = async () => {
    try {
      // Simulate Lobstr wallet connection
      if (typeof window !== 'undefined' && window.lobstr) {
        const publicKey = await window.lobstr.getPublicKey();
        return { publicKey, type: 'lobstr' };
      }
      throw new Error('Lobstr wallet not found');
    } catch (error) {
      // Fallback to mock connection
      return { publicKey: 'GABC123LOBSTR456XYZ789', type: 'lobstr' };
    }
  };

  const connectWallet = async (type) => {
    setIsConnecting(true);
    setWalletType(type);
    
    try {
      let walletData;
      
      switch (type) {
        case 'freighter':
          walletData = await connectFreighter();
          break;
        case 'lobstr':
          walletData = await connectLobstr();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }
      
      const wallet = {
        address: walletData.publicKey,
        type: walletData.type,
        network: STELLAR_NETWORK,
        connected: true
      };
      
      setUserWallet(wallet);
      
      // Load user data from database
      if (dbConnection) {
        const userData = await dbConnection.getUser(wallet.address);
        if (userData) {
          setTotalDonations(userData.totalDonations || 0);
          const userNFTs = await dbConnection.getUserNFTs(wallet.address);
          setNftCollection(userNFTs);
        } else {
          // Create new user
          await dbConnection.saveUser({
            walletAddress: wallet.address,
            walletType: wallet.type,
            totalDonations: 0,
            joinedAt: new Date().toISOString()
          });
        }
      }
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect ${type} wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Smart Contract NFT Minting
  const mintNFT = async (stageData, donationAmount) => {
    if (!stellarSdk || !userWallet) return null;
    
    try {
      setIsMinting(true);
      
      // Create NFT metadata with IPFS
      const nftMetadata = {
        name: `${APP_NAME} ${stageData.name}`,
        description: stageData.description,
        image: stageData.imageUrl,
        ipfs_hash: stageData.ipfsHash,
        external_url: `${window.location.origin}/nft/${stageData.id}`,
        animation_url: stageData.imageUrl,
        attributes: [
          { trait_type: 'Growth Stage', value: stageData.name },
          { trait_type: 'Rarity', value: stageData.attributes.rarity },
          { trait_type: 'Threshold', value: stageData.threshold },
          { trait_type: 'Donation Amount', value: donationAmount },
          { trait_type: 'IPFS Hash', value: stageData.ipfsHash },
          { trait_type: 'Minted At', value: new Date().toISOString() }
        ],
        properties: {
          category: 'Dynamic Growth NFT',
          collection: APP_NAME,
          network: STELLAR_NETWORK,
          contract: CONTRACT_ID
        }
      };
      
      // Simulate smart contract interaction
      const server = new stellarSdk.Server(HORIZON_URL);
      const account = await server.loadAccount(userWallet.address);
      
      // Create transaction for NFT minting
      const transaction = new stellarSdk.TransactionBuilder(account, {
        fee: stellarSdk.BASE_FEE,
        networkPassphrase: stellarSdk.Networks.TESTNET
      })
      .addOperation({
        type: 'invoke_contract',
        contractId: CONTRACT_ID,
        function: 'mint_nft',
        args: [
          userWallet.address,
          JSON.stringify(nftMetadata),
          stageData.id.toString()
        ]
      })
      .setTimeout(300)
      .build();
      
      // Sign and submit transaction
      const result = await server.submitTransaction(transaction);
      
      // Create NFT record
      const nftRecord = {
        tokenId: `SAVIA_${stageData.id}_${Date.now()}`,
        owner: userWallet.address,
        stage: stageData.id,
        metadata: nftMetadata,
        transactionHash: result.hash,
        mintedAt: new Date().toISOString(),
        donationAmount: donationAmount
      };
      
      // Save to database
      if (dbConnection) {
        await dbConnection.saveNFT(nftRecord);
      }
      
      return nftRecord;
      
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  // Handle donation and NFT minting
  const handleDonation = async () => {
    if (!userWallet || !donationAmount || !dbConnection) return;
    
    const amount = parseFloat(donationAmount);
    if (amount <= 0) return;

    try {
      // Save donation to database
      const donationRecord = {
        id: `donation_${Date.now()}`,
        donor: userWallet.address,
        amount: amount,
        timestamp: new Date().toISOString(),
        transactionId: `stellar_tx_${Date.now()}`
      };
      
      await dbConnection.saveDonation(donationRecord);
      
      const newTotal = totalDonations + amount;
      setTotalDonations(newTotal);
      
      // Update user total in database
      const userData = await dbConnection.getUser(userWallet.address);
      if (userData) {
        userData.totalDonations = newTotal;
        await dbConnection.saveUser(userData);
      }
      
      // Check if we've reached a new stage
      const newStage = nftStages.reduce((prev, curr) => {
        return newTotal >= curr.threshold ? curr.id : prev;
      }, 0);

      if (newStage > currentStage) {
        // Mint new NFT
        const nftRecord = await mintNFT(nftStages[newStage], amount);
        if (nftRecord) {
          setNftCollection(prev => [...prev, nftRecord]);
          alert(`🎉 Congratulations! You've unlocked the ${nftStages[newStage].name} NFT!`);
        }
      }
      
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    }

    setDonationAmount('');
  };

  // Download NFT
  const downloadNFT = async (nft) => {
    try {
      const imageUrl = processedImages[nft.stage]?.optimized || nft.metadata.image;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nft.metadata.name}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download NFT:', error);
    }
  };

  // Sync with blockchain
  const syncWithBlockchain = async () => {
    if (!userWallet || !stellarSdk) return;
    
    try {
      setIsConnecting(true);
      // Simulate blockchain sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh user data from blockchain
      const userNFTs = await dbConnection.getUserNFTs(userWallet.address);
      setNftCollection(userNFTs);
      
      alert('Successfully synced with blockchain!');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Calculate current stage based on donations
  useEffect(() => {
    const newStage = nftStages.reduce((prev, curr) => {
      return totalDonations >= curr.threshold ? curr.id : prev;
    }, 0);
    setCurrentStage(newStage);
  }, [totalDonations]);

  const getProgressToNext = () => {
    const nextStage = nftStages[currentStage + 1];
    if (!nextStage) return 100;
    
    const progress = (totalDonations / nextStage.threshold) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            {APP_NAME} - Dynamic NFT Growth
          </h1>
          <p className="text-gray-600">Watch your impact grow with every donation</p>
          <div className="mt-2 text-sm text-gray-500">
            Network: {STELLAR_NETWORK.toUpperCase()} | Contract: {CONTRACT_ID.slice(0, 8)}...
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Wallet className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Stellar Wallet</h3>
                <p className="text-sm text-gray-600">
                  {userWallet ? `Connected: ${userWallet.address} (${userWallet.type})` : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {userWallet && (
                <button
                  onClick={syncWithBlockchain}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync
                </button>
              )}
              {!userWallet && (
                <>
                  <button
                    onClick={() => connectWallet('freighter')}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isConnecting && walletType === 'freighter' ? 'Connecting...' : 'Freighter'}
                  </button>
                  <button
                    onClick={() => connectWallet('lobstr')}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {isConnecting && walletType === 'lobstr' ? 'Connecting...' : 'Lobstr'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Current Stage Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Current Growth Stage</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-green-600">${totalDonations}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${nftStages[currentStage].color}`}>
                  {nftStages[currentStage].icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {nftStages[currentStage].name}
                  </h3>
                  <p className="text-gray-600">{nftStages[currentStage].description}</p>
                </div>
              </div>
              
              {/* Progress to next stage */}
              {currentStage < nftStages.length - 1 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {nftStages[currentStage + 1].name}</span>
                    <span>${totalDonations}/${nftStages[currentStage + 1].threshold}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToNext()}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <img
                src={processedImages[currentStage]?.optimized || convertGoogleDriveUrl(nftStages[currentStage].imageUrl)}
                alt={nftStages[currentStage].name}
                className="w-48 h-48 rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Donation Interface */}
        {userWallet && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Make a Donation</h2>
            <div className="flex gap-4">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter amount ($)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleDonation}
                disabled={isMinting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isMinting ? 'Processing...' : 'Donate'}
              </button>
            </div>
          </div>
        )}

        {/* NFT Collection */}
        {nftCollection.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your NFT Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nftCollection.map((nft, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={processedImages[nft.stage]?.thumbnail || convertGoogleDriveUrl(nft.metadata.image)}
                    alt={nft.metadata.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-full ${nftStages[nft.stage].color}`}>
                        {nftStages[nft.stage].icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">{nft.metadata.name}</h3>
                    </div>
                    <button
                      onClick={() => downloadNFT(nft)}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{nft.metadata.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Token ID: {nft.tokenId}</p>
                    <p>Minted: {new Date(nft.mintedAt).toLocaleDateString()}</p>
                    <p>Transaction: {nft.transactionHash?.slice(0, 16)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Stages Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Growth Stages Overview</h2>
          <div className="space-y-4">
            {nftStages.map((stage, index) => (
              <div 
                key={stage.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  currentStage >= stage.id 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <img
                  src={processedImages[stage.id]?.thumbnail || convertGoogleDriveUrl(stage.imageUrl)}
                  alt={stage.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className={`p-2 rounded-full ${stage.color} ${
                  currentStage >= stage.id ? 'opacity-100' : 'opacity-50'
                }`}>
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rarity: {stage.attributes.rarity} | Growth: {stage.attributes.growth}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${stage.threshold}+</p>
                  {currentStage >= stage.id && (
                    <p className="text-sm text-green-600">✓ Unlocked</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StellarNFTDashboard;