import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Table from 'react-bootstrap/Table';

import MPDropDown from '../../components/Global/MPDropDown'
import Layout from '../../components/Layout'
import Icons from "../../components/Global/Icons";
import { serverUrl } from "../../config";
import { useMediaQuery } from "react-responsive";

import "./index.scss";

import { MARKETPLACES_API } from "../../config";
import commonService from "../../config/services/common.service";

function AllCollections() {
  const [selectedPeriod, setSelectedPeriod] = useState("low")
  const [isLoading, setIsLoading] = useState(false);

  const [collections, setCollections] = useState([])
  const [searchCollection, setSearchCollection] = useState()
  const [filterCollections, setFilterCollections] = useState([...collections])

  const isMobile = useMediaQuery({
    query: "(max-width:768px)"
  })

  const itemData = [
    "low",
    "middle",
    "high"
  ]

  const allCollectionHeaderFields = [
    { name: `#` },
    { name: `Collection` },
    { name: `Volume Total` },
    { name: `24 h Volume` },
    { name: `24 h % Volume` },
    { name: `Sales` },
    { name: `Floor Price` },
    { name: `Owners` },
    { name: `Total Supply` },
  ]

  const handleSearch = (event) => {
    console.log(event)
    setSearchCollection(event)
    const searched = !event ? collections
      : collections.filter((item) => item?.name.toLowerCase().includes(event.toLowerCase()))
    console.log('searched', searched)
    setFilterCollections(searched)
  }

  useEffect(() => {
    (
      async () => {
        try {
          setIsLoading(true);

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
          setFilterCollections([...collectionData])
          setCollections([...collectionData])

          setIsLoading(false);
        } catch (error) {
          console.log('error', error)
          setIsLoading(false);
        }
      }
    )();
  }, [])

  return (
    <Layout>
      <div className="allCollection-page">
        <div className="allCollection-container" >
          <h5 className="allCollection-title">All Collections</h5>
          <div className="allCollection-control" >
            <div className="filter-search-group" >
              <MPDropDown itemData={itemData} selectedValue={selectedPeriod} title={"period"} changeValue={setSelectedPeriod} />
              <div className='collection-search'>
                <Icons name={70} />
                <input
                  type={"text"}
                  placeholder='search collections/…'
                  value={searchCollection}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className={`t-box ${collections.length > 0 ? `table-control` : `table-control-height`} `}>
              <Table className="table-cst" responsive border={0}>
                <thead>
                  <tr>
                    {
                      allCollectionHeaderFields.map((item, idx) =>
                        <th key={idx}
                          className={(isMobile && idx !== 0) ? `allCol-th` : ``}
                        >{item.name}</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    filterCollections.length > 0
                      ? filterCollections.map((item, index) => (
                        <tr key={index} className='tbody-tr' >
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <p>{index + 1}</p>
                                </div>
                            }
                          </td>
                          <td>
                            {
                              isLoading ?
                                <div className="d-flex align-items-center gap-4 " >
                                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                    <p style={{ width: `100%` }}  >
                                      <Skeleton count={1} style={{ minHeight: `60px` }} />
                                    </p>
                                  </SkeletonTheme>
                                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                    <p style={{ width: `100%` }} >
                                      <Skeleton count={1} />
                                    </p  >
                                  </SkeletonTheme>
                                </div>

                                :
                                <div className="d-flex align-items-center">
                                  {
                                    !!item?.baseImage && <img src={`${serverUrl}${item.baseImage}`}
                                      alt="img"
                                      style={{ width: "60px", height: "60px", borderRadius: "16px" }}

                                    />
                                  }
                                  {
                                    item?.chain === 0 && <Link to={`/collection/${`solana`}/${item.symbol}?activeTab=items`} className='no-underline'
                                      style={{ textDecoration: `none` }}
                                    >
                                      <p className="mx-4">{item.name}</p>
                                    </Link>
                                  }
                                  {
                                    item?.chain === 1 && <Link to={`/collection/${`ether`}/${item.contract}?activeTab=items`} className='no-underline'
                                      style={{ textDecoration: `none` }}
                                    >
                                      <p className="mx-4">{item.name}</p>
                                    </Link>
                                  }
                                </div>
                            }

                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <Icons name={item.chain === 1 ? 97 : 1} />
                                  <p className="mx-2">{item?.totalVolume ? Number(item?.totalVolume).toFixed(2) : 0}</p>
                                </div>
                            }

                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <Icons name={item.chain === 1 ? 97 : 1} />
                                  <p className="mx-2 ">{item?.volume24h ? Number(item?.volume24h).toFixed(2) : 0}</p>
                                </div>
                            }

                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <div className="m-2">
                                    <Icons name={item?.percent24h > 0 ? 30 : 31} />
                                  </div>
                                  <p><span
                                    style={{ color: item?.percent24h > 0 ? `#53FFFC` : `#F13D3D` }}
                                  >{item?.percent24h ? (item?.percent24h).toFixed(2) : 0}</span></p>
                                </div>
                            }

                          </td>
                          <td>

                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <p>{item?.purchased ? item?.purchased : 0}</p>
                                </div>
                            }
                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <Icons name={item.chain === 1 ? 97 : 1} />
                                  <p className="mx-2">{item?.floorPrice ? item?.floorPrice : 0}</p>
                                </div>
                            }

                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <p>{item?.uniqueHolders}</p>
                                </div>
                            }

                          </td>
                          <td>
                            {
                              isLoading ?
                                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme>
                                :
                                <div className="d-flex align-items-center">
                                  <p>{item?.totalSupply}</p>
                                </div>
                            }

                          </td>
                        </tr>))
                      :
                      isLoading ?
                        (
                          new Array(5).fill(undefined).map((data, index) => {
                            return (
                              <tr key={index} >
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <div className="d-flex align-items-center gap-4 " >
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                      <p style={{ width: `100%` }}  >
                                        <Skeleton count={1} style={{ minHeight: `60px` }} />
                                      </p>
                                    </SkeletonTheme>
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                      <p style={{ width: `100%` }} >
                                        <Skeleton count={1} />
                                      </p  >
                                    </SkeletonTheme>
                                  </div>

                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                                <td><SkeletonTheme baseColor="#202020" highlightColor="#444">
                                  <p>
                                    <Skeleton count={1} />
                                  </p>
                                </SkeletonTheme></td>
                              </tr>
                            )
                          })
                        )
                        :
                        (
                          <div className='no-nftGroup' >
                            <p className='title' >Nothing Found</p>
                            <p className='subTitle' >We couldn't find anything with this criteria</p>
                          </div>
                        )

                  }
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  );
}

export default AllCollections;
