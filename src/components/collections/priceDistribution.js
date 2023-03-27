import DistributeChart from '../Charts/distributionChart'
import EtherDistributeChart from '../Charts/ethereum/distributionChart';

const PriceDistributionChart = ({ chain, symbol }) => {
  return (
    <div className='w-100 my-4 jkalsdfj-askdj'>
      <div className='flexBox jkdsafk-wenms'>
        <h6 style={{ color: `white` }} >Listing Price Distribution</h6>

      </div>
      <div className='hjkads-jasew flexBox pos-rel'>
        {/* <h6 className='jkj-jsaijdw22'># of Listings</h6> */}
        <div className='w-100 ml-4'>
          {
            chain === 'solana' &&
            <DistributeChart
              symbol={symbol}
            />
          }
          {
            chain === 'ether' &&
            <EtherDistributeChart
              contractAddress={symbol}
            />
          }
        </div>

      </div>

    </div>
  );
}

export default PriceDistributionChart;