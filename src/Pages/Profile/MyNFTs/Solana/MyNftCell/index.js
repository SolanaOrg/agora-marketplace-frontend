import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Icons from "../../../../../components/Global/Icons";
import { serverUrl } from '../../../../../config';
import { NFT } from '../../../../../actions';

import './index.scss'


export default (props) => {
	const {
		nft,
		index,
		collectionsInWallet,
		setNftsInWallet,
		nftShowStatus,
		setNftShowStatus
	} = props
	const dispatch = useDispatch()

	const handleNftShowStatus = () => {
		if (!nftShowStatus) {
			if (index === 0 || index) {
				setNftsInWallet({
					items: collectionsInWallet[index].items,
					floorPrice: collectionsInWallet[index].floorPrice
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
			to={nftShowStatus ? `/collection/solana/${nft?.symbol}/${nft?.mintAddress}`
				: `/profile?profile=mynfts`
			}
		>
			{
				!nftShowStatus && !!nft.collectionImg && <>
					<img src={`${serverUrl}${nft.collectionImg}`} alt='nft'
						onError={(e) => {
							e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP-3QSHNAEBzr6s2fvf7hhOpnt0HGHthvDoGqFF3XQHg&s"
						}}
					/>
					<p className='collectionName' >{nft?.collectionName}</p>
				</>
			}
			{
				nftShowStatus && !!nft.image &&
				<>
					<img src={nft.image} alt='nft'
						onError={(e) => {
							e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP-3QSHNAEBzr6s2fvf7hhOpnt0HGHthvDoGqFF3XQHg&s"
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
								<p>#{nft?.name.split('#')[1]}</p>
							</div>
						</div>
					</div>
				</>
			}

		</Link>
	)

}