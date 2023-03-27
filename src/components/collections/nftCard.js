import Icons from '../Global/Icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NFT } from '../../actions';

export default ({ nft, chain, symbol, onClick, index }) => {
    const dispatch = useDispatch();

    const handleClickItem = () => {
        dispatch(NFT({
            nftItemClick: true
        }))
    }
    return (
        <div
            key={index}
            onClick={onClick}
            style={{
                position: `relative`,
                width: `168px`,
                height: `168px`,
                border: nft?.selected ? `2px solid #53FFFC` : `none`
            }}
            className='nft-item'
        >
            {
                nft?.selected && <div
                    style={{
                        position: `absolute`,
                        top: `8px`,
                        left: `8px`,
                        background: `#53FFFC`,
                        display: `flex`,
                        padding: `8px`,
                        borderRadius: `5px`
                    }}
                >
                    <Icons name={92} />
                </div>
            }

            <img src={nft?.image} style={{ width: `100%`, height: `100%` }}
                onError={(e) => {
                    e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP-3QSHNAEBzr6s2fvf7hhOpnt0HGHthvDoGqFF3XQHg&s"
                }}
            />
            <div className='jdskfasd-k3mew nft-item-independent '>
                <div className='flexBox m-1' style={{ justifyContent: `right` }} >
                    <button className="btn adsjfs-akew kjdsfkje3e">
                        <div><Icons name={77} /></div>
                        <div><p>{nft?.favouriteCount}</p></div>
                    </button>
                </div>
                <div className='flexBox m-1'>
                    <button className="btn adsjfs-akew kjdsfkje3e nft-item-id " style={{ maxWidth: `fit-content`, padding: `0px 8px` }} >
                        <div><p>#{nft?.name.split('#')[1]}</p></div>
                    </button>
                    <div>
                        <button className='btn asdfhjdssa-asdw mx-1'>
                            {chain === 'solana' &&
                                <Icons name={1} />}
                            {chain === 'ether' &&
                                <Icons name={97} />}
                        </button>
                        <button className='btn jksdfj-ejwe'>
                            <div><p>{nft?.price}</p></div>
                        </button>
                    </div>

                </div>
                {
                    chain === 'solana' && <Link
                        onClick={handleClickItem}
                        to={`/collection/solana/${symbol}/${nft.mintAddress}`}
                        style={{ cursor: `pointer`, position: `absolute`, top: `50%` }}
                    >
                        view detail
                    </Link>
                }
                {
                    chain === 'ether' && <Link
                        onClick={handleClickItem}
                        to={`/collection/ether/${symbol}/${nft?.nftId}`}
                        style={{ cursor: `pointer`, position: `absolute`, top: `50%` }}
                    >
                        view detail
                    </Link>
                }
            </div>

        </div>
    )

}