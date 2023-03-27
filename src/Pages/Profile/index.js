import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Layout from '../../components/Layout'
import Search from '../../components/Global/search';
import Overview from './Overview';
import MyNFTs from './MyNFTs';
import ListedNFTS from './ListedNFTS';
import OfferedNfts from "./OfferedNfts";
import MyCustodialNFTS from './MyCustodialNFTS';
import Activities from './Activities';
import OffersReceived from './OffersReceived';

import './index.scss'
import Favourite from './Favourite';

const Profile = () => {
	const myParam = useLocation().search;
	const profileTab = new URLSearchParams(myParam).get("profile");

	const profileLists = [
		{ id: 0, link: `mynfts`, name: `My NFTs` },
		{ id: 1, link: `listednfts`, name: `Listed NFTs` },
		{ id: 2, link: `mycustodialnfts`, name: `My Custodial NFTs` },
		{ id: 3, link: `activites`, name: `Activites` },
		{ id: 4, link: `offersreceived`, name: `Offers Received` },
		{ id: 5, link: `favourite`, name: `Favourite` },
	]

	return (
		<Layout>
			<div className="user-profile">
				<div className="d-flex justify-content-center profile-top-search">
					<Search />
				</div>
				<Overview />
				<div className='activity-tabs'>
					<div className='activity-tab-list'>
						{
							profileLists.map((tabItem) =>
								<Link
									to={`/profile?profile=${tabItem.link}`} key={tabItem.id}
									className={profileTab === tabItem.link ? `activity-tab-active` : `activity-tab-passive`}
								>
									{tabItem.name}
									<div className={profileTab === tabItem.link ? `bg-active` : ``} />
								</Link>
							)
						}
					</div>

					{profileTab === 'mynfts' && <MyNFTs />}
					{profileTab === 'listednfts' && <ListedNFTS />}
					{profileTab === 'mycustodialnfts' && <MyCustodialNFTS />}
					{profileTab === 'activites' && <Activities />}
					{profileTab === 'offersreceived' && <OffersReceived />}
					{profileTab === 'favourite' && <Favourite />}

				</div>
			</div>
		</Layout>
	);
}

export default Profile;
