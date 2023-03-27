import MetamaskImg from '../../images/wallet-icons/metamask-icon.webp'

const Ethereum = (props) => {
  const { handleEthWalletConnect } = props
  return (
    <>
      <div className="wallet-cell d-flex" style={{
        cursor: `pointer`
      }} onClick={handleEthWalletConnect} >
        <img src={MetamaskImg} className="wallet-icon"></img>
        <p>
          <span>Metamask</span>
        </p>
      </div>

      {/* <div className="wallet-cell d-flex">
        <img src={PhantomImg} className="wallet-icon"></img>
        <p>
          <span>Phantom</span>
        </p>
      </div> */}
    </>
  );
}

export default Ethereum;
