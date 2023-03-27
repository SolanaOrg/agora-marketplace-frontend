import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { serverUrl } from '../../../../../config'
import Icons from '../../../../../components/Global/Icons'
import { NFT } from '../../../../../actions'

import './index.scss'

const MyEthNftCell = ({
  nft,
  index,
  nftShowStatus,
  ethCollections,
  setNftShowStatus,
  setEthNfts
}: any) => {
  console.log('nft', nft)
  const dispatch = useDispatch()

  const handleNftShowStatus = () => {
    if (!nftShowStatus) {
      if (index >= 0) {
        setEthNfts({
          items: ethCollections[index].items,
          floorPrice: ethCollections[index].floorPrice
        })
        setNftShowStatus(true);
      }
    } else {
      dispatch(NFT({
        nftItemClick: true
      }))
    }
  }
  return (
    <Link
      className='nft-item'
      key={index}
      onClick={handleNftShowStatus}
      to={nftShowStatus ? `/collection/ether/${nft?.token_address}/${nft?.token_id}`
        : `/profile?profile=mynfts`
      }
    >
      {
        !nftShowStatus && !!nft?.image && <>
          <img src={`${serverUrl}${nft.image}`} alt='nft'
            onError={(e) => {
              e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTockQ1nzDdNSl0C1GJG3Wn8PZDz_zgxbe5oQ&usqp=CAU"
            }}
          />
          <p className='collectionName' >{nft?.name}</p>
        </>
      }

      {
        nftShowStatus && !!nft?.image &&
        <>
          <img src={nft?.image} alt='nft'
            onError={(e) => {
              e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTockQ1nzDdNSl0C1GJG3Wn8PZDz_zgxbe5oQ&usqp=CAU"
            }}
          />
          <div className=' nft-item-independent '>
            <div className='nft-item-top'>
              <div className="favourate-group">
                <div><Icons name={77} /></div>
                <div><p>{`111`}</p></div>
              </div>
            </div>
            <div className='nft-item-bottom'>
              <div className="nft-item-name">
                <p>#{nft?.token_id}</p>
              </div>
            </div>
          </div>
        </>
      }

    </Link>
  )
}

export default MyEthNftCell