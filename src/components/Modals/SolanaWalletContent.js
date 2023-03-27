import { useWallet } from '@solana/wallet-adapter-react'

const Solana = () => {
  const { select, wallets, publickey, disconnect } = useWallet();

  console.log('wallets', wallets)
  return (
    <>
      {
        wallets.map((wallet) =>
          <div
            key={wallet.adapter.name}
            onClick={() => select(wallet.adapter.name)}
            className="wallet-cell d-flex" style={{ cursor: `pointer` }} >
            <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="wallet-icon"></img>
            <p>
              <span>{wallet.adapter.name}</span>
            </p>
          </div>
        )
      }
      {/* <div className="wallet-cell d-flex" style={{ cursor: `pointer` }} >
        <img src={PhantomImg} className="wallet-icon"></img>
        <p>
          <span>Phantom</span>
        </p>
      </div>
      <div className="wallet-cell d-flex" style={{ cursor: `pointer` }}>
        <img src={SolflareImg} className="wallet-icon"></img>
        <p>
          <span>Solflare</span>
        </p>
      </div>
      <div className="wallet-cell d-flex" style={{ cursor: `pointer` }}>
        <img src={SlopeImg} className="wallet-icon"></img>
        <p>
          <span>Slope</span>
        </p>
      </div>
      <div className="wallet-cell d-flex" style={{ cursor: `pointer` }}>
        <img src={SafePalImg} className="wallet-icon"></img>
        <p>
          <span>Safepal</span>
        </p>
      </div> */}

      {/* <div className="wallet-cell d-flex">
        <img src={PhantomImg} className="wallet-icon"></img>
        <p>
          <span>Phantom</span>
        </p>
      </div> */}
    </>
  );
}

export default Solana;
