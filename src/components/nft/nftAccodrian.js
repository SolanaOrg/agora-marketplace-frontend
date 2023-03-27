import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Icons from '../Global/Icons';

function BasicExample({ nftInfo, nftDescirption }) {
  const [selected, setSelected] = useState(false)

  return (
    <Accordion >
      <Accordion.Item >
        <Accordion.Header onClick={() => setSelected(!selected)} >
          <div className='flexBox w-100' >
            <div className='flexBox'>
              <Icons name={94} />
              <h5 className='mx-3'>About {nftInfo.collectionName}</h5>
            </div>
            <Icons name={selected ? 98 : 44} />

          </div>
        </Accordion.Header>
        <Accordion.Body>
          <p>{nftDescirption}</p>
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
  );
}

export default BasicExample;