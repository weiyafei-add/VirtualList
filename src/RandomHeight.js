import React,{useEffect, useMemo, useState,useRef} from 'react'
import faker from "faker";
import './RandomHeight.css';

const mockData = new Array(2000).fill('').map((item,index)=>({id:index,value:faker.lorem.sentences()}))

const itemHeight = 50

export default function RandomHeight() {
    const [visibleData,setVisibleData] = useState([])
    const [startOffset,setStartOffset] = useState(0)
    const [positions,setPositions] = useState(()=>{  //记录每一项的位置信息
        return mockData.map((item, index) => ({
            index,
            height: itemHeight,
            top: index * itemHeight,
            bottom: (index + 1) * itemHeight
        })) 
    })
    const containerRef = useRef(null)
    const listWrapRef = useRef(null)
    //列表总高度
    const listHeight = useMemo(()=>{
        return positions[positions.length - 1].bottom;
    },[positions])
    //可显示的列表项数
    const visibleCount = ()=>{
        return Math.ceil(containerRef.current.offsetHeight / itemHeight);
    }

    const updateItemsSize = ()=>{
        let nodes = Array.from(listWrapRef.current.children);
        nodes.forEach(node => {
          let rect = node.getBoundingClientRect();
          let height = rect.height;
          let index = Number(node.id);
          let oldHeight = positions[index].height;
          let dValue = oldHeight - height;
          //存在差值
          if (dValue) {
            positions[index].bottom = positions[index].bottom - dValue;
            positions[index].height = height;
            for (let k = index + 1; k < positions.length; k++) {
              positions[k].top = positions[k - 1].bottom;
              positions[k].bottom = positions[k].bottom - dValue;
            }
          }
        });
        setPositions([...positions])
    }
    const scrollEvent = ()=>{
        //当前滚动位置
        let scrollTop = containerRef.current.scrollTop;
        let start = getStartIndex(scrollTop)
        let end = start + visibleCount()
        const sliceData = mockData.slice(start,end)
        setVisibleData(sliceData)
        let startOffset = start >= 1 ? positions[start].top : 0;
        setStartOffset(startOffset)
        updateItemsSize()
    }

    const binarySearch = (value)=>{ //二分查找
        let start = 0;
        let end = positions.length - 1;
        console.log(start,end,'start')
        let tempIndex = null;
        while (start <= end) {   
          let midIndex = parseInt((start + end) / 2);
          let midValue = positions[midIndex].bottom;
          if (midValue === value) {
            return midIndex + 1;
          } else if (midValue < value) {
            start = midIndex + 1;
          } else if (midValue > value) {
            if (tempIndex === null || tempIndex > midIndex) {
              tempIndex = midIndex;
            }
            end = end - 1;
          }
        }
        return tempIndex;
    } 
    const getStartIndex = (scrollTop)=>{
        return binarySearch(scrollTop);
    }
    
    useEffect(()=>{
        const sliceData = mockData.slice(0,visibleCount())
        setVisibleData(sliceData)
        updateItemsSize()
    },[])

    return (
        <div ref={containerRef} className="infinite-list-container" onScroll={scrollEvent}>
            <div className="infinite-list-phantom" style={{height:listHeight}}></div> 
            <ul className="infinite-list" style={{transform:`translate3d(0,${startOffset}px,0)`}} ref={listWrapRef}>
                {
                    visibleData.map(item=>{
                        return <li key={item.id} id={item.id} className="infinite-list-item">{item.id}-{item.value}</li>
                    })
                }
            </ul>
        </div>
    )
}
