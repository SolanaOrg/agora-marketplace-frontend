import useState from 'react'
import { useMediaQuery } from "react-responsive";

const NewsCard = ({ title, head, date, img }) => {
  const [isShown, setIsShown] = useState(false);

  return <div className='jdskf-kawemwae' onMouseLeave={() => setIsShown(false)}
    onMouseEnter={() => setIsShown(true)}
  >

    <img src={img} />
    <div className={isShown ? "akdsjfdsa-awenwa" : "dsp-none-cst"}>
      <p
        style={{
          position: `absolute`,
          top: `3%`,
          left: `3%`,
          color: `white`,
          fontSize: `18px`
        }}
      >Degen News</p>
      <h5>{title}</h5>
      <div className='flexBox'>
        <h6>{head}</h6>
        <p>{date}</p>
      </div>
    </div>
  </div>
}
export default () => {
  const isMedium = useMediaQuery({
    query: "(max-width: 1367px)",
  });
  return <div className='flexBox flexWrap' >
    <NewsCard img={require('../../../images/51.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/52.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/53.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/54.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/52.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/51.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/53.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/54.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/52.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
    <NewsCard img={require('../../../images/51.png')} title={"GameStop’s New FTX Partnership Could Boost Web3 Onboarding"} head={"By Degen News"} date={"Sep 08 2022"} />
  </div>
}