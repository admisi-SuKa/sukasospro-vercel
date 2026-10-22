"use client";
import {useEffect,useState,type CSSProperties} from 'react';
export default function Photo({src,alt,className='',style}:{src:string;alt:string;className?:string;style?:CSSProperties}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>{setFailed(false)},[src]);
 return <img src={failed?'/campus-illustration.svg':src} alt={alt} className={className} style={style} loading={className.includes("lp-cinema-image")?"eager":"lazy"} onError={()=>setFailed(true)}/>;
}
