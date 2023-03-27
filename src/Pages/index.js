import { useState, useEffect } from "react";
import Layout from '../components/Layout'
import MPDropDown from '../components/Global/MPDropDown'
import Search from '../components/Global/search'
import './index.scss'
import commonService from "../config/services/common.service";
import { MARKETPLACES_API } from "../config";
import { serverUrl } from "../config";
import Icons from "../components/Global/Icons";
import { Link } from "react-router-dom";

const blockchainList = ["All", "Ethereum", "Solana"]
const floorpriceList = ["Low", "Middle", "High"]
const volumeList = ["Low", "Middle", "High"]
const performanceList = ["Low", "Middle", "High"]
const typeList = ["New collections only"]

function App() {
  const [isLoading, setLoading] = useState(false)
  const [collections, setCollections] = useState([])

  const [isShown, setShown] = useState(-1)

  const [slecetedBlockchain, setSelectedBlockchain] = useState("All")
  const [slecetedFloorPrice, setSelectedFloorPrice] = useState("Low")
  const [selectedVolume, setSelectedVolume] = useState("Low")
  const [slecetedPerformance, setSelectedPerformance] = useState("Low")
  const [slecetedType, setSelectedType] = useState("New collections only")

  useEffect(() => {
    (
      async () => {
        try {
          setLoading(true);

          let _collections = await commonService({
            method: "get",
            route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
          });

          const collectionData = await Promise.all(
            _collections.rows.map(async (collection) => {
              return await commonService({
                method: 'get',
                route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${collection.symbol}`
              })
            })
          )
          console.log('collectionData', collectionData)
          setCollections([...collectionData])

          setLoading(false);
        } catch (error) {
          console.log = ('error', error)
          setLoading(false);
        }
      }
    )()
  }, [])


  return (

    <Layout>
      {
        isLoading ? <div id="preloader"></div> :
          <div id="preloader" style={{ display: "none" }}></div>
      }
      <div className="homepage" >
        <div className="homepage-container" >
          <div className="nft-filter">
            <div className="dropdown-filter">
              <MPDropDown itemData={blockchainList} selectedValue={slecetedBlockchain} title={"Blockchain"} changeValue={setSelectedBlockchain} />
              <MPDropDown itemData={floorpriceList} selectedValue={slecetedFloorPrice} title={"Floorprice"} changeValue={setSelectedFloorPrice} />
              <MPDropDown itemData={volumeList} selectedValue={selectedVolume} title={"Volume"} changeValue={setSelectedVolume} />
              <MPDropDown itemData={performanceList} selectedValue={slecetedPerformance} title={"Performance"} changeValue={setSelectedPerformance} />
              <MPDropDown itemData={typeList} selectedValue={slecetedType} title={"Type"} changeValue={setSelectedType} />
            </div>
            <Search />
          </div>

          <div className="collectionLists" >
            {
              collections.sort((a, b) => 100 * (b.listedCount / b.totalSupply) - 100 * (a.listedCount / a.totalSupply)).map((item, idx) =>
                <div className="collection-item"
                  onMouseEnter={() => setShown(idx)}
                // onMouseLeave={() => setShown(false)}
                >
                  <img className="collection-img" src={`${serverUrl}${item.baseImage}`} />
                  {
                    isShown === idx && <div className="show-item-info" >
                      <div className={`${item.volume24h > 0 ? `volume-inc-group` : `volume-dec-group`}  volume-group`} >
                        <p>24h Vol</p>
                        <p>{item.volume24h} %</p>
                      </div>
                      <div className="info-group" >
                        <div><Icons name={100} /></div>
                        {item.chain === 0 &&
                          <div className="view-btn" ><Link to={`/collection/solana/${item.symbol}?activeTab=items`} ><p>View</p></Link></div>
                        }
                        {item.chain === 1 &&
                          <div className="view-btn" ><Link to={`/collection/ether/${item.contract}?activeTab=items`} ><p>View</p></Link></div>
                        }
                        <div><Icons name={99} /></div>
                      </div>
                      <p className="title" >{item.name}</p>
                      <div className="footer-group" >
                        <div>V: {item.totalVolume.toFixed(2)} </div>
                        <div>F: {item.floorPrice.toFixed(2)}</div>
                        <div><Icons name={item.chain === 0 ? 74 : 97} /></div>
                      </div>
                    </div>
                  }
                </div>
              )
            }
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default App;
