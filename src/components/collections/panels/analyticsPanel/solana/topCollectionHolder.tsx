import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import commonService from '../../../../../config/services/common.service';
import { MARKETPLACES_API } from '../../../../../config';
import Icons from '../../../../Global/Icons';
import './index.scss'

const TopCollectionHolder = (props: any) => {
  const { symbol } = props;

  const [isLoading, setLoading] = useState(false)
  const [topHolders, setTopHolders] = useState([])
  const [solToUsd, setSolToUsd] = useState<any>(0)

  useEffect(() => {
    (
      async () => {
        try {
          setLoading(true)

          const get_global_status: any = await commonService({
            method: `get`,
            route: MARKETPLACES_API.GET_GLOBAL_STATUS
          })
          setSolToUsd(Number(get_global_status?.solPrice).toFixed(2))

          const get_top_holder: any = await commonService({
            method: `GET`,
            route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${symbol}/topholders`
          })
          setTopHolders(get_top_holder)

          setLoading(false)

        } catch (error) {
          console.log('error', error)
          setLoading(false)
        }
      }
    )()
  }, [])

  return (
    <div className='w-100 analytics-panel'>
      <h5 className='title' >Top Collection Holders</h5>
      <div className="t-box">
        <Table className="table-cst" responsive border={0}>
          <thead>
            <tr>
              <th>#</th>
              <th>Holders</th>
              <th>NFTs Owned</th>
              <th>% of Supply</th>
              <th>Total Floor Value</th>
              <th>NFTs Listed</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ? <>
                {
                  Array.from({ length: 5 }).map((_, i) => (<tr key={i} >

                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>
                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>
                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>

                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>
                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>
                    <td>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <p>
                          <Skeleton count={1} />
                        </p>
                      </SkeletonTheme>
                    </td>
                  </tr>))
                }
              </>

                :
                topHolders.length > 0 ?
                  topHolders.map((item: any, idx: any) => {
                    const activityHour: any = (Number(Date.now() - new Date(item.created_at).getTime()) / 3600000).toFixed(0); // hour about milisection
                    const activityMinute: any = Number((Number(Date.now() - new Date(item.created_at).getTime()) / 3600000) * 60).toFixed(0) // Minute about milisection

                    const activityDays: any = Number(activityHour / 24).toFixed(0)
                    const activityMonths: any = Number(activityDays / 30).toFixed(0)
                    return (
                      <tr key={idx} >

                        <td>
                          <div className="d-flex align-items-center">

                            <p>{idx + 1}</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">

                            <p>{item.holder.slice(0, 4) + '...' + item.holder.substring(item.holder.length - 4)}</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <p>{item.count}</p>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center">

                            <p>{(item.percent).toFixed(2)}%</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Icons name={1} />
                            <p className="mx-2 sand-a2kewade">{(item.totalValue).toFixed(2)} SOL</p>
                          </div>
                          <div>
                            <h5 className='anbsdksa-oakew'>(${(item.totalValue * solToUsd).toFixed(2)})</h5>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">

                            <p>{item.listedCount}</p>
                          </div>
                        </td>
                      </tr>
                    )
                  })

                  :
                  <div className='no-nftGroup' >
                    <p className='title' >Nothing Found</p>
                    <p className='subTitle' >We couldn't find anything with this criteria</p>
                  </div>
            }

          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default TopCollectionHolder