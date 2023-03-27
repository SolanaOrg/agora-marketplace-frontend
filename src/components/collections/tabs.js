import { useLocation, Link } from 'react-router-dom';

import ActivityPanel from './panels/activityPanel';
import AnalyticsPanel from './panels/analyticsPanel';
import ItemPanel from './panels/ItemPanel';
import EtherItemPanel from './panels/ItemPanel/Ethereum';
import NewsPanel from './panels/newsPanel';

import './index.scss'
const TabComponent = ({
	nfts,
	chain,
	symbol,
	setLoading
}) => {
	const myParam = useLocation().search;
	const activityTab = new URLSearchParams(myParam).get("activeTab");

	const activityLists = [
		{ id: 0, link: `items`, name: `Items` },
		{ id: 1, link: `activity`, name: `Activity` },
		{ id: 2, link: `analytics`, name: `Analytics` },
		{ id: 3, link: `news`, name: `Degen News` },
	]

	return (
		<div className='activity-tabs'>
			<div className='activity-tab-list'>
				{
					activityLists.map((tabItem) =>
						<>
							{
								chain === 'solana' && <Link
									to={`/collection/${`solana`}/${symbol}?activeTab=${tabItem.link}`}
									key={tabItem.id}
									className={activityTab === tabItem.link ? `activity-tab-active` : `activity-tab-passive`}
								>
									{tabItem.name}
									<div className={activityTab === tabItem.link ? `bg-active` : ``} />
								</Link>
							}
							{
								chain === 'ether' && <Link
									to={
										`/collection/${`ether`}/${symbol}?activeTab=${tabItem.link}`
									}
									key={tabItem.id}
									className={activityTab === tabItem.link ? `activity-tab-active` : `activity-tab-passive`}
								>
									{tabItem.name}
									<div className={activityTab === tabItem.link ? `bg-active` : ``} />
								</Link>
							}
						</>

					)
				}
			</div>

			{
				activityTab === 'items' &&
				<div >
					{
						chain === 'solana' && <ItemPanel
							chain={chain}
							nfts={nfts}
							symbol={symbol}
							setLoading={setLoading}
						/>
					}
					{
						chain === 'ether' && <EtherItemPanel
							chain={chain}
							nfts={nfts}
							symbol={symbol}
							setLoading={setLoading}
						/>
					}

				</div>
			}

			{
				activityTab === 'activity' &&
				<div>
					<ActivityPanel
						chain={chain}
						symbol={symbol}
					/>
				</div>
			}

			{
				activityTab === 'analytics' &&
				<div>
					<AnalyticsPanel
						symbol={symbol}
						chain={chain}
					/>
				</div>
			}

			{
				activityTab === 'news' && <div eventKey="Degen News">
					<NewsPanel />
				</div>
			}



		</div>

	);
}

export default TabComponent;


