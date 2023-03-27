import Icons from '../Global/Icons'
import './index.scss'

export default ({ attribute, Icon }) => {
    return <div className='attributes-item'>
        <div className='title-group' >
            <p className="title" >{attribute.type}</p>
            <div className='price-group' >
                <Icons name={Icon} />
                <p className='price' >{attribute.minPrice ? attribute.minPrice : 0}</p>
            </div>
        </div>
        <p className="value" >{attribute.value}</p>
        <div className='price-percent' >
            <p className='percent' >{((attribute.percent).toFixed(2))}%</p>
        </div>
    </div>
}