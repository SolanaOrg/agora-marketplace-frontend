import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import SettingContent from '../SettingContent'
import ListedNftCell from "./Solana/ListedNftCell"
import ListedEtherNftCell from "./Ethereum/ListedEtherNftCell";
import getCollectionSymbol from "../../../config/utils/getCollectionSymbol";

import './index.scss'
import Icons from "../../../components/Global/Icons";
import { API_URL, MARKETPLACES_API } from "../../../config";
import { MARKETPLACES_ETH_API } from "../../../config/ether";
import commonService from "../../../config/services/common.service";
import { connectWallet } from "../../../utiles/eth-interact";

function ListedNFTS() {
  const wallet = useAnchorWallet();
  const Data = useSelector((state) => state);

  const [nftShowStatus, setNftShowStatus] = useState(false);
  const [nftsInWallet, setNftsInWallet] = useState([]);
  const [collectionsInWallet, setCollectionsInWallet] = useState([]);

  const [isLoading, setLoading] = useState(false)

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
            filteredNtfs.push({ name: nft?.name, image: nft?.image, mintAddress: nft?.mintAddress, price: nft?.price, symbol: collection?.symbol })

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

  useEffect(() => {
    (
      async () => {
        try {
          if (!wallet) return
          setLoading(true)

          let status = 1
          const get_listedNfts = await commonService({
            method: `get`,
            route: `${API_URL}/nft/wallet/${wallet.publicKey.toBase58()}/${status}`
          })
          const collectionsData = await commonService({
            method: "get",
            route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
          });

          const filter_collections = collectionsData.rows.filter((item) => item.creators !== null)

          let creators = []
          filter_collections.map((item) => creators.push(item?.creators[0]))

          const _temp = await getNftsInWalletByFilteredCollections(filter_collections, get_listedNfts, true)
          const result = _temp.data;
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
          if (Data.metamask === '' || !Data.metamask || Data.metamask === 'disconnect') return

          setLoading(true)
          const ethWallet = await connectWallet()

          let token_address = [];
          const collecion_info = await commonService({
            method: `get`,
            route: `${MARKETPLACES_API.GET_COLLECTIONS}/${ethWallet.address}`
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

          let status = 1
          const get_listedNfts = await commonService({
            method: `get`,
            route: `${API_URL}/nft/wallet/${ethWallet.address}/${status}`
          })

          const verified_nfts = get_listedNfts.filter(item => {
            return token_nft_address.includes(item?.token_address)
          })

          let result = []
          await Promise.all(await verified_collections.map(async (collection) => {
            let filteredNtfs = []

            await verified_nfts.forEach((nft) => {
              if (collection.contract.toLowerCase() === nft?.token_address.toLowerCase()) {
                filteredNtfs.push({
                  metadata: JSON.parse(nft?.metadata),
                  name: nft?.name,
                  token_address: nft?.token_address,
                  token_id: nft?.token_id,
                  owner: nft?.owner_of,
                  symbol: nft?.symbol
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
  }, [Data])

  return (
    <div className="listed-nfts">
      <SettingContent />
      {
        isLoading ? <div id="preloader"></div> :
          <div id="preloader" style={{ display: "none" }}></div>
      }

      {
        nftShowStatus && <div className='collection-group' >
          <div className='collection-info' >
            <div className='collection-info-i.itemstem' >
              <p>Nft Count :
                {Data.metamask === 'connected' && ethNfts?.items.length}
                {wallet && nftsInWallet?.items.length}
              </p>
            </div>
            <div className='collection-info-item' >
              <p>Floor Price :
                {Data.metamask === 'connected' && (ethNfts?.floorPrice ? ethNfts?.floorPrice : 0)}
                {wallet && (nftsInWallet?.floorPrice ? nftsInWallet?.floorPrice : 0)}
              </p>
            </div>
            <div className='collection-info-item' >
              <p>Total :
                {Data.metamask === 'connected' && (ethNfts?.floorPrice ? ethNfts?.floorPrice * ethNfts.items.length : 0)}

                {wallet && (nftsInWallet?.floorPrice ? (nftsInWallet?.floorPrice * nftsInWallet?.items.length).toFixed(2) : 0)}
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
                    <ListedNftCell
                      nft={item}
                      index={index}
                      setLoading={setLoading}
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
              nftShowStatus && (nftsInWallet?.items.length > 0 ?
                nftsInWallet?.items.map((item, index) => {
                  return (
                    <ListedNftCell
                      nft={item}
                      index={index}
                      setLoading={setLoading}
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
                    <ListedEtherNftCell
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
                    <ListedEtherNftCell
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

export default ListedNFTS;
