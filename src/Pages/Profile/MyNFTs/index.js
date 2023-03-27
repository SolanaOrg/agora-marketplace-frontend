import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useAnchorWallet } from '@solana/wallet-adapter-react'

import Icons from '../../../components/Global/Icons';
import SettingContent from '../SettingContent'
import './index.scss'
import { MARKETPLACES_API, RPC_HOST } from '../../../config';
import { MARKETPLACES_ETH_API } from '../../../config/ether';
import commonService from '../../../config/services/common.service';
import { SolanaClient } from '../../../config/helpers/sol';
import getCollectionSymbol from '../../../config/utils/getCollectionSymbol';
import { connectWallet } from '../../../utiles/eth-interact';
import MyNftCell from './Solana/MyNftCell';
import MyEthNftCell from './Ethereum/MyEthNftCell';



function MyNFTs() {
  const wallet = useAnchorWallet();
  const ethWallet = connectWallet();
  const storeData = useSelector((state) => state);

  const solanaClient = new SolanaClient({ rpcEndpoint: RPC_HOST });

  const [isLoading, setLoading] = useState(false);
  const [nftShowStatus, setNftShowStatus] = useState(false);

  const [totalFloorValue, setTotalFloorValue] = useState('--');
  const [nftsInWallet, setNftsInWallet] = useState([]);
  const [collectionsInWallet, setCollectionsInWallet] = useState([]);
  const [ethCollections, setEthCollections] = useState([]);
  const [ethNfts, setEthNfts] = useState([]);

  const getNftsInWalletByFilteredCollections = async (filteredCollections, nftsInWallet, isVerified) => {
    let result = []
    let resultCount = 0
    let _totalFloorValue = 0
    if (isVerified) {

      await Promise.all(await filteredCollections.map(async (collection) => {
        let filteredNtfs = []

        await nftsInWallet.forEach((nft) => {
          const symbol = getCollectionSymbol(nft?.name);
          if (symbol === collection?.nftName.toLowerCase())
            filteredNtfs.push({ name: nft?.name, image: nft?.image, mintAddress: nft?.mint, symbol: nft?.symbol })

        });
        if (filteredNtfs.length === 0)
          return

        let res = await commonService({
          method: 'get',
          route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${collection?.symbol} `
        })

        result.push({
          collectionName: collection.name,
          collectionImg: collection.baseImage,
          symbol: collection.symbol,
          floorPrice: res.floorPrice,
          totalFloorValue: parseFloat(res.floorPrice) * filteredNtfs.length,
          items: filteredNtfs
        })
        _totalFloorValue += parseFloat(res.floorPrice) * filteredNtfs.length
        resultCount += filteredNtfs.length
      }))
      setTotalFloorValue(_totalFloorValue)
    } else {
      let unverifiedSymbols = getUnverifiedCollectionSymbols(filteredCollections, nftsInWallet)
      nftsInWallet.forEach((nft) => {
        const symbol = getCollectionSymbol(nft.name);
        if (unverifiedSymbols.includes(symbol)) {
          result.push({ ...nft })
          resultCount++
        }
      });
    }
    return {
      data: result,
      count: resultCount
    }
  }

  const getListedCollectionSymbols = (listedCollections) => {
    let result = [];
    try {
      for (let i = 0; i < listedCollections.length; i++) {
        if (listedCollections[i].symbol) {
          result.push(listedCollections[i].symbol);
        }
      }
    }
    catch (err) {
      result = [];
    }
    finally {
      return result;
    }
  }

  const getUnverifiedCollectionSymbols = (filteredCollections, nftsInWallet) => {
    let symbolList = getListedCollectionSymbols(filteredCollections)
    let result = []
    nftsInWallet.forEach((nft) => {
      const symbol = getCollectionSymbol(nft.name)
      if (!symbolList.includes(symbol)) {
        result.push(symbol)
      }
    })
    return result
  }

  useEffect(() => {
    (
      async () => {
        try {
          if (!wallet) {
            return;
          }
          setLoading(true)
          const wallets = [wallet.publicKey.toString()];

          const collectionsData = await commonService({
            method: "get",
            route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
          });

          const filter_collections = collectionsData.rows.filter((item) => item.creators !== null)

          let creators = []
          filter_collections.map((item) => creators.push(item?.creators[0]))

          let nftsInWallet = await solanaClient.getAllCollectiblesWithCreator(wallets, creators);
          const _temp = await getNftsInWalletByFilteredCollections(filter_collections, nftsInWallet[wallet.publicKey.toString()], true)
          const result = _temp.data
          setCollectionsInWallet([...result])

          let newNfts = [];
          for (let i = 0; i < result.length; i++) {
            newNfts = [...newNfts, ...result[i]?.items]
          }
          setNftsInWallet([...newNfts]);

          setLoading(false)

        } catch (error) {
          console.log('error', error)
          setLoading(false)
        }
      }
    )()

  }, [wallet])


  useEffect(() => {
    (
      async () => {
        try {
          if (storeData.metamask === `disconnect` || storeData.metamask === `` || !storeData.metamask) return;
          setLoading(true)

          const etherWallet = await connectWallet()
          let token_address = [];
          const collecion_info = await commonService({
            method: `get`,
            route: `${MARKETPLACES_API.GET_COLLECTIONS}/${etherWallet.address}`
          })
          for (let i = 0; i < collecion_info.result.length; i++) {
            token_address.push(collecion_info.result[i].token_address)
          }

          let _collections = await commonService({
            method: "get",
            route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
          });
          // verify collections
          const verified_collections = _collections.rows.filter(item => {
            return token_address.includes(item?.contract?.toLowerCase())
          })

          let token_nft_address = [];
          for (let i = 0; i < _collections.rows.length; i++) {
            if (_collections.rows[i].chain === 1) {
              token_nft_address.push(_collections.rows[i].contract.toLowerCase())
            }
          }
          const get_nft = await commonService({
            method: `get`,
            route: `${MARKETPLACES_API.GET_NFT_LISTS}/${etherWallet.address}`
          })
          const verified_nfts = get_nft.result.filter(item => {
            return token_nft_address.includes(item?.token_address)
          })
          let result = []
          await Promise.all(await verified_collections.map(async (collection) => {
            let filteredNtfs = []

            await verified_nfts.forEach((nft) => {
              const ipfs = JSON.parse(nft?.metadata)?.image
              let get_image = ''
              if (ipfs.includes('ipfs://')) {
                get_image = 'https://ipfs.io/ipfs/' + ipfs.replace('ipfs://', '')
              } else {
                get_image = ipfs
              }

              if (collection.contract.toLowerCase() === nft?.token_address.toLowerCase()) {

                const ipfs = JSON.parse(nft?.metadata).image
                let get_image = ''
                if (ipfs.includes('ipfs://')) {
                  get_image = 'https://ipfs.io/ipfs/' + ipfs.replace('ipfs://', '')
                } else {
                  get_image = ipfs
                }

                filteredNtfs.push({
                  metadata: JSON.parse(nft?.metadata),
                  name: nft?.name,
                  token_address: nft?.token_address,
                  token_id: nft?.token_id,
                  owner: nft?.owner_of,
                  symbol: nft?.symbol,
                  image: get_image
                })
              }
            })
            let res = await commonService({
              method: 'get',
              route: `${MARKETPLACES_ETH_API.GET_COLLECTION}/${collection.contract} `
            })

            result.push({
              image: collection?.baseImage,
              name: collection?.name,
              items: filteredNtfs,
              floorPrice: res?.floorPrice
            })
          }))

          setEthCollections(result)

          setLoading(false)
        } catch (error) {
          console.log('error', error)
          setLoading(false)
        }
      }
    )()
  }, [storeData])

  return (
    <div className="my-nfts">
      <SettingContent />
      {
        isLoading ? <div id="preloader"></div> :
          <div id="preloader" style={{ display: "none" }}></div>
      }
      {
        nftShowStatus && <div className='collection-group' >
          <div className='collection-info' >
            <div className='collection-info-item' >
              <p>Nft Count :
                {storeData.metamask === 'connected' && ethNfts.items.length}
                {wallet && nftsInWallet.items.length}
              </p>
            </div>
            <div className='collection-info-item' >
              <p>Floor Price :
                {storeData.metamask === 'connected' && (ethNfts?.floorPrice ? ethNfts?.floorPrice : 0)}
                {wallet && (nftsInWallet?.floorPrice ? nftsInWallet?.floorPrice : 0)}
              </p>
            </div>
            <div className='collection-info-item' >
              <p>Total :
                {storeData.metamask === 'connected' && (ethNfts?.floorPrice ? ethNfts?.floorPrice * ethNfts.items.length : 0)}

                {wallet && (nftsInWallet?.floorPrice ? nftsInWallet?.floorPrice * nftsInWallet?.items.length : 0)}
              </p>
            </div>

          </div>
          <div className="back-arrow" style={{ cursor: `pointer` }} onClick={() => setNftShowStatus(false)}  >
            <Icons name={20} />
          </div>
        </div>

      }

      {
        wallet ?
          <div className='nfts-list' >
            {
              !nftShowStatus && (collectionsInWallet.length > 0 ?
                collectionsInWallet.map((item, index) => {
                  return (
                    <MyNftCell
                      nft={item}
                      index={index}
                      nftShowStatus={nftShowStatus}
                      collectionsInWallet={collectionsInWallet}
                      setNftShowStatus={setNftShowStatus}
                      setNftsInWallet={setNftsInWallet}
                      key={index}
                    />
                  )
                })
                :
                <div className='no-nftGroup' >
                  <p className='title' >Nothing Found</p>
                  <p className='subTitle' >We couldn't find anything with this criteria</p>
                </div>)
            }

            {
              nftShowStatus && (nftsInWallet.items.length > 0 ?
                nftsInWallet.items.map((item, index) => {
                  return (
                    <MyNftCell
                      nft={item}
                      index={index}
                      nftShowStatus={nftShowStatus}
                      setNftShowStatus={setNftShowStatus}
                      setNftsInWallet={setNftsInWallet}
                      key={index}
                    />
                  )
                })
                :
                <div className='no-nftGroup' >
                  <p className='title' >Nothing Found</p>
                  <p className='subTitle' >We couldn't find anything with this criteria</p>
                </div>)
            }
          </div>
          :

          <div className='nfts-list' >
            {
              !nftShowStatus && (ethCollections.length > 0 ?
                ethCollections.map((item, index) => {
                  return (
                    <MyEthNftCell
                      nft={item}
                      index={index}
                      nftShowStatus={nftShowStatus}
                      ethCollections={ethCollections}
                      setNftShowStatus={setNftShowStatus}
                      setEthNfts={setEthNfts}
                      key={index}
                    />
                  )
                })
                :
                <div className='no-nftGroup' >
                  <p className='title' >Nothing Found</p>
                  <p className='subTitle' >We couldn't find anything with this criteria</p>
                </div>)
            }

            {
              nftShowStatus && (ethNfts?.items.length > 0 ?
                ethNfts?.items.map((item, index) => {
                  return (
                    <MyEthNftCell
                      nft={item}
                      index={index}
                      nftShowStatus={nftShowStatus}
                      setNftShowStatus={setNftShowStatus}
                      ethNfts={ethNfts}
                      setEthNfts={setEthNfts}
                      key={index}
                    />
                  )
                })
                :
                <div className='no-nftGroup' >
                  <p className='title' >Nothing Found</p>
                  <p className='subTitle' >We couldn't find anything with this criteria</p>
                </div>)
            }
          </div>

      }
    </div>
  );
}

export default MyNFTs;
