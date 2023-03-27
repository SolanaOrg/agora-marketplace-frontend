import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import copy from 'copy-to-clipboard'

import { METAMASK_CONNECT } from "../../../actions";
import { connectWallet, getBalance } from "../../../utiles/eth-interact";
import { MARKETPLACES_API } from "../../../config";
import commonService from "../../../config/services/common.service";
import Icons from "../../Global/Icons";
import MPDropDown from "../../Global/MPDropDown";
import InfoBox from "../../Global/InfoBox";

import './index.scss'

const itemData = [
  "Solana",
  "Ethereum"
]
export default ({ title, items, value }) => {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection();
  const storeData = useSelector(status => status)
  const dispatch = useDispatch()

  const [selectedCopy, setSelectedCopy] = useState(false)
  const [dispalyMenu, setDisplayMenu] = useState(false)
  const navigate = useNavigate();

  const [solAddress, setSolAddress] = useState('')
  const [ethAddress, setEthAddress] = useState('')
  const [balance, setBalance] = useState({
    sol: 0,
    usdSol: 0,
    eth: 0,
    usdEth: 0
  })

  const ChangeRoute = (url) => {
    navigate(url, { replace: true })
  }

  const handleTurnOff = () => {
    if (wallet.publicKey) {
      wallet.disconnect()
    }
    if (storeData.metamask === 'connected') {
      dispatch(METAMASK_CONNECT({
        metamask: `disconnect`
      }))
    }
    setDisplayMenu(false)
  }

  const handleCopy = () => {
    setSelectedCopy(true)
    if (wallet.publicKey) {
      copy(solAddress)
    }
    if (storeData.metamask === 'connected') {
      copy(ethAddress)
    }
  }

  useEffect(() => {
    (
      async () => {
        try {
          if (!anchorWallet) return
          const temp_wallet = anchorWallet?.publicKey.toBase58()

          setSolAddress(temp_wallet)

          const get_global_status = await commonService({
            method: `get`,
            route: MARKETPLACES_API.GET_GLOBAL_STATUS
          })

          const get_sol_balance = await connection.getBalance(anchorWallet.publicKey)
          const sol_balance = (get_sol_balance / LAMPORTS_PER_SOL);
          setBalance({
            ...balance,
            sol: sol_balance.toFixed(2),
            usdSol: (Number(get_global_status?.solPrice).toFixed(2) * sol_balance).toFixed(2),

          })
        } catch (error) {
          console.log('error', error)
        }
      }
    )()


  }, [anchorWallet])

  useEffect(() => {
    (
      async () => {
        if (storeData.metamask === 'connected') {
          const walletResponse = await connectWallet();
          setEthAddress(walletResponse.address)

          const get_global_status = await commonService({
            method: `get`,
            route: MARKETPLACES_API.GET_GLOBAL_STATUS
          })

          const eth_balance = await getBalance()

          setBalance({
            ...balance,
            eth: eth_balance.toFixed(2),
            usdEth: (eth_balance * Number(get_global_status?.ethPrice).toFixed(2)).toFixed(2)
          })
        }
      }
    )()
  }, [storeData])

  return (
    <InfoBox style={{ cursor: `pointer` }} className='relative' outSideClickFunc={setDisplayMenu}>
      <div style={{ display: `flex`, alignItems: `center`, gap: `36px` }} >
        {title ? (
          <div onClick={() => setDisplayMenu(true)}>
            <span className="mx-2 color-dim">
              {title}
              <span className="col-wht">
                {
                  !value
                    ? "Low - High"
                    : items.filter(item => item.value === value)[0].name
                }
              </span>
            </span>
            <Icons name={2} />{" "}
          </div>
        ) : (
          <>
            {
              storeData.metamask === 'connected' ?
                <div onClick={() => setDisplayMenu(true)}
                  style={{ display: `flex`, alignItems: `center` }}
                >
                  <span className="mx-2 content-title">Blockchain:</span>
                  <Icons name={97} />

                  <span className="mx-2 color-spn">
                    ETH
                  </span> <Icons name={2} />{" "}
                </div>
                :

                wallet.publicKey ?
                  <div onClick={() => setDisplayMenu(true)}
                    style={{ display: `flex`, alignItems: `center` }}
                  >
                    <span className="mx-2 content-title">Blockchain:</span>
                    <Icons name={1} />
                    <span className="mx-2 color-spn">
                      SOL
                    </span> <Icons name={2} />{" "}
                  </div>
                  :
                  <></>

            }
          </>

        )}

        <Icons name={88} />

        {
          dispalyMenu ?
            <div className="menu-content">
              <div className="flexBox  brd-btm w-100">
                <div className="flexBox">
                  <Icons name={21} />
                  <div className="mx-2">
                    <h6 className="col-wht">
                      {
                        wallet.publicKey && solAddress?.substr(0, 6) + '...' + solAddress?.substr(solAddress.length - 4, 4)
                      }
                      {
                        storeData.metamask === 'connected' && ethAddress?.substr(0, 6) + '...' + ethAddress?.substr(ethAddress.length - 4, 4)
                      }
                    </h6>
                    <div className="profile-linker" onClick={() => ChangeRoute('/profile?profile=mynfts')}>View Profile</div>
                  </div>
                </div>
                <div className="flexBox">
                  <div className="mx-3" onClick={handleCopy} style={{ cursor: `pointer` }} title={selectedCopy && `Copied`} >
                    {" "}
                    <Icons name={22} />
                  </div>
                  <div className="mx-2" style={{ cursor: `pointer` }} onClick={handleTurnOff} >
                    <Icons name={29} />
                  </div>
                </div>
              </div>
              <div className="brd-btm wallet-balance">
                <p className="content-title">Wallet Balance</p>
                <div className="flexBox">
                  <div className="flexBox">
                    {wallet.publicKey && <Icons name={1} />}
                    {storeData.metamask === 'connected' && <Icons name={97} />}
                    <span className=" ss2">
                      {wallet.publicKey && `${balance.sol}SOL`}
                      {storeData.metamask === 'connected' && `${balance.eth} ETH`}
                    </span>
                  </div>
                  <span className="ss1">
                    ($
                    {wallet.publicKey && balance.usdSol}
                    {storeData.metamask === 'connected' && balance.usdEth}
                    )
                  </span>
                </div>
              </div>
              <div className="my-2 p-2 brd-btm finance-actions">
                <Link href="#" className="my-1 ccH">
                  <Icons name={24} />
                  <span className="ss3 mx-2">Sell</span>
                </Link>

                <Link href="#" className="my-1 ccH">
                  <Icons name={25} />
                  <span className="ss3 mx-2">My Items</span>
                </Link>
                <Link href="#" className="my-1 ccH">
                  <Icons name={26} />
                  <span className="ss3 mx-2 ">Connect a different Wallet</span>
                </Link>
                <Link href="#" className="my-1 ccH">
                  <Icons name={27} />
                  <span className="ss3 mx-2">Favorites</span>
                </Link>
                <Link href="#" className="my-1 ccH">
                  <Icons name={28} />
                  <span className="ss3 mx-2">Settings</span>
                </Link>
              </div>
              {/* <MPDropDown itemData={itemData} selectedValue={depositCoin} title={"Chain"} changeValue={setDepositCoin} /> */}
              <div style={{ display: `flex`, gap: `8px` }}>
                <span className="content-title">Chain: </span>
                <p className="content-description" style={{ color: `white` }} >
                  {wallet.publicKey && `Solana`}
                  {storeData.metamask === 'connected' && `Ethereum`}
                </p>
              </div>
            </div>
            : <></>
        }
      </div>


    </InfoBox>

  );
};
