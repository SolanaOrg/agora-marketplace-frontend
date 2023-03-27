import Icons from "../../../../Global/Icons"

const EtherSales = ({ activities }) => {
  return (
    <>
      {
        activities.map((activity, i) => {
          const activityHour = (Number(Date.now() - new Date(activity.created_at).getTime()) / 3600000).toFixed(0); // hour about milisection
          const activityMinute = Number((Number(Date.now() - new Date(activity.created_at).getTime()) / 3600000) * 60).toFixed(0) // Minute about milisection

          const activityDays = Number(activityHour / 24).toFixed(0)
          const activityMonths = Number(activityDays / 30).toFixed(0)
          return (
            <tr key={i} >
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={activity.image}
                    style={{ width: "80px", height: "80px" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTockQ1nzDdNSl0C1GJG3Wn8PZDz_zgxbe5oQ&usqp=CAU"
                    }}
                    alt='sales' />
                  <p className="mx-4">{activity.name} </p>
                </div>
              </td>

              <td>
                <div className="d-flex align-items-center" style={{ justifyContent: `center` }}>
                  <Icons name={97} />
                  <p className="mx-2 sand-a2kewade">{activity.price} ETH</p>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center" style={{ justifyContent: `center` }}>

                  <p>{activity.signature.slice(0, 4) + '...' + activity.signature.substring(activity.signature.length - 4)}</p>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center"
                  style={{ background: `rgba(80, 250, 240, 0.1`, maxWidth: `fit-content`, borderRadius: `10px`, padding: `3px 23px`, color: `#50FAF0`, margin: `0 auto` }}
                >
                  {activity.type === 4 ? `Buy` : `AcceptOffer`}
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center" style={{ justifyContent: `center` }}>
                  {
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
                  }
                </div>
              </td>
              {/* <td>
                <div className="d-flex align-items-center">
                  <p>{activity.mintAddress.slice(0, 4) + '...' + activity.mintAddress.substring(activity.mintAddress.length - 4)}</p>
                </div>
              </td> */}
              <td>
                <div className="d-flex align-items-center" style={{ justifyContent: `center` }}>
                  <p>{activity.from.slice(0, 4) + '...' + activity.from.substring(activity.from.length - 4)}</p>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center" style={{ justifyContent: `center` }}>
                  <p>{activity.to.slice(0, 4) + '...' + activity.to.substring(activity.to.length - 4)}</p>
                </div>
              </td>
            </tr>
          )
        })
      }
    </>
  )
}

export default EtherSales