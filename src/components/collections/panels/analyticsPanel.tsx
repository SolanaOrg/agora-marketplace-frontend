
import MarketOverview from '../marketOverview'
import PriceDistributionChart from '../priceDistribution';
import PriceDistributionLong from '../priceDistributionlong'

import AnalyticsTrade from './analyticsPanel/solana/trade';
import TopCollectionHolder from './analyticsPanel/solana/topCollectionHolder';

import EtherAnalyticsTrade from './analyticsPanel/ethereum/EtherAnalyticsTrade';
import EtherTopCollectionHolder from './analyticsPanel/ethereum/topCollectionHolder';


const AnalyticsPanel = ({ chain, symbol }: any) => {
	return (
		<div className='flexBox flexWrap' >
			<MarketOverview chain={chain} symbol={symbol} />
			<PriceDistributionChart chain={chain} symbol={symbol} />
			{/* <PriceDistributionLong /> */}

			{
				chain === 'solana' && <>
					<AnalyticsTrade symbol={symbol} />
					<TopCollectionHolder symbol={symbol}
					/>
				</>
			}

			{
				chain === 'ether' && <>
					<EtherAnalyticsTrade symbol={symbol} />
					<EtherTopCollectionHolder symbol={symbol} />
				</>
			}


		</div>
	)
}

export default AnalyticsPanel