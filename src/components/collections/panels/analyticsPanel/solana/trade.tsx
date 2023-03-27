import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import commonService from '../../../../../config/services/common.service';
import { MARKETPLACES_API } from '../../../../../config';
import Icons from '../../../../Global/Icons';
import './index.scss'

const AnalyticsTrade = (props: any) => {
  const { symbol } = props;

  const [isLoading, setLoading] = useState(false)
  const [trades, setTrades] = useState([])
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

          const get_recent_trade: any = await commonService({
            method: `GET`,
            route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${symbol}/recent_trades`
          })
          setTrades(get_recent_trade?.activities)


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
      <h5 className='title' >Recent Trades</h5>
      <div className="t-box">
        <Table className="table-cst" responsive border={0}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Transferred from</th>
              <th>Transferred to</th>
              <th>Time</th>
              <th>Price</th>

            </tr>
          </thead>
          <tbody>
            {
              isLoading ? <>
                {
                  Array.from({ length: 13 }).map((_, i) => (<tr key={i} >

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
                trades.length > 0 ?
                  trades.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item: any, idx: any) => {
                    const activityHour: any = (Number(Date.now() - new Date(item.created_at).getTime()) / 3600000).toFixed(0); // hour about milisection
                    const activityMinute: any = Number((Number(Date.now() - new Date(item.created_at).getTime()) / 3600000) * 60).toFixed(0) // Minute about milisection

                    const activityDays: any = Number(activityHour / 24).toFixed(0)
                    const activityMonths: any = Number(activityDays / 30).toFixed(0)
                    return (
                      <tr key={idx} >

                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.image} style={{ width: `60px` }} />
                            <p className="mx-4">{item.name}</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <p>{item.from.slice(0, 4) + '...' + item.from.substring(item.from.length - 4)}</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <p>{item.to.slice(0, 4) + '...' + item.to.substring(item.to.length - 4)}</p>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center">

                            <p>  {
                              activityDays > 30 ?
                                activityMonths.length > 1 ?
                                  <p>{activityMonths} months ago </p>
                                  :
                                  <p>{`a month ago`} </p>
                                :
                                activityHour > 24 ?
                                  <p> {activityDays} days ago </p>
                                  :
                                  activityMinute >= 60 ?
                                    <p> {activityHour}  hours ago </p>
                                    : activityMinute >= 1 ?

                                      <p>{activityMinute} Minutes ago </p>
                                      :
                                      <p> less than a minute </p>
                            }</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Icons name={1} />
                            <p className="mx-2 sand-a2kewade">{item.price} SOL</p>
                          </div>
                          <div>
                            <h5 className='anbsdksa-oakew'>(${(item.price * solToUsd).toFixed(2)})</h5>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  )

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

export default AnalyticsTrade