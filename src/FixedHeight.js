import React,{useCallback, useEffect, useMemo, useState,useRef} from 'react'
import './FixedHeight.css';

const mockData = new Array(200).fill('').map((item,index)=>index+1)

const itemHeight = 51
export default function FixedHeight() {
    const [visibleData,setVisibleData] = useState([])
    const [startOffset,setStartOffset] = useState(0)
    const ref = useRef(null)

    //列表总高度
    const listHeight = useMemo(()=>{
        return mockData.length * itemHeight;
    },[])

    //可显示的列表项数
    const visibleCount = useCallback(()=>{
        return Math.ceil(ref.current.offsetHeight / itemHeight);
    },[])
    
    const scrollEvent = ()=>{
        //当前滚动位置
        let scrollTop = ref.current.scrollTop;
        const start = Math.floor(scrollTop / itemHeight)
        const end = start + visibleCount()
        const sliceData = mockData.slice(start,end)
        setVisibleData(sliceData)
        // console.log(scrollTop,scrollTop % itemHeight,'scrollTop')
        setStartOffset(scrollTop - (scrollTop % itemHeight))
    }
    
    useEffect(()=>{
        const sliceData = mockData.slice(0,visibleCount())
        setVisibleData(sliceData)
    },[])

    return (
        <div ref={ref} className="infinite-list-container" onScroll={scrollEvent}>
            <div className="infinite-list-phantom" style={{height:listHeight}}></div>
            <ul className="infinite-list" style={{transform:`translate3d(0,${startOffset}px,0)`}}>
                {
                    visibleData.map(item=>{
                        return <li key={item} className="infinite-list-item">{item}</li>
                    })
                }
            </ul>
        </div>
    )
}