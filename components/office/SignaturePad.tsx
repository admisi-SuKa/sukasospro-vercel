"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import type {ChangeEvent,PointerEvent as ReactPointerEvent} from "react";
import styles from "./SignaturePad.module.css";

type Point={x:number;y:number};
type Props={onChange:(pngDataUrl:string)=>void};
const MAX_SIGNATURE_DATA_URL=650_000;
const MAX_PNG_UPLOAD=350_000;

/** TTD pemohon sederhana; tidak dimaksudkan sebagai TTE tersertifikasi. */
export default function SignaturePad({onChange}:Props){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const linesRef=useRef<Point[][]>([]);
  const activePointerRef=useRef<number|null>(null);
  const latestChangeRef=useRef(onChange);
  const [ready,setReady]=useState(false);
  const [uploaded,setUploaded]=useState("");
  const [feedback,setFeedback]=useState("Silakan bubuhkan tanda tangan di kotak putih.");
  latestChangeRef.current=onChange;

  const render=useCallback(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const {width,height}=canvas.getBoundingClientRect();
    if(width<1||height<1)return;
    // Retina: samakan pixel buffer dengan ukuran CSS dan tampilkan gambar dari titik relatif.
    const ratio=Math.max(1,Math.min(window.devicePixelRatio||1,2));
    const pw=Math.round(width*ratio),ph=Math.round(height*ratio);
    if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
    const ctx=canvas.getContext("2d");
    if(!ctx){setFeedback("Kanvas tidak tersedia. Gunakan unggah PNG di bawah.");return;}
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle="#0b6b5b";
    ctx.fillStyle="#0b6b5b";
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.lineWidth=2.8;
    for(const line of linesRef.current){
      if(!line.length)continue;
      if(line.length===1){ctx.beginPath();ctx.arc(line[0].x*width,line[0].y*height,1.6,0,Math.PI*2);ctx.fill();continue;}
      ctx.beginPath();ctx.moveTo(line[0].x*width,line[0].y*height);
      for(let i=1;i<line.length;i++)ctx.lineTo(line[i].x*width,line[i].y*height);
      ctx.stroke();
    }
  },[]);

  useEffect(()=>{
    render();
    const canvas=canvasRef.current;
    if(!canvas)return;
    // Pastikan seluruh area dapat digambar dengan jari, bukan menggeser halaman.
    const avoidTouchScroll=(event:TouchEvent)=>{if(event.cancelable)event.preventDefault();};
    canvas.addEventListener("touchmove",avoidTouchScroll,{passive:false});
    const obs=typeof ResizeObserver!=="undefined"?new ResizeObserver(render):null;
    obs?.observe(canvas);
    window.addEventListener("resize",render);
    return ()=>{canvas.removeEventListener("touchmove",avoidTouchScroll);obs?.disconnect();window.removeEventListener("resize",render);};
  },[render,uploaded]);

  function point(e:ReactPointerEvent<HTMLCanvasElement>):Point{
    const b=e.currentTarget.getBoundingClientRect();
    return {x:Math.min(1,Math.max(0,(e.clientX-b.left)/Math.max(1,b.width))),
      y:Math.min(1,Math.max(0,(e.clientY-b.top)/Math.max(1,b.height)))};
  }
  function begin(e:ReactPointerEvent<HTMLCanvasElement>){
    if(activePointerRef.current!==null||(e.pointerType==="mouse"&&e.button!==0))return;
    e.preventDefault();
    if(!e.currentTarget.getContext("2d")){
      setFeedback("Browser tidak mendukung kanvas. Silakan unggah TTD PNG.");return;
    }
    // Jangan simpan TTD yang masih dalam proses digambar.
    latestChangeRef.current("");
    activePointerRef.current=e.pointerId;
    linesRef.current.push([point(e)]);
    try{e.currentTarget.setPointerCapture(e.pointerId);}catch{ /* browser tertentu tidak mendukung capture */ }
    setUploaded("");setReady(false);
    setFeedback("Sedang menggambar… lepaskan jari/mouse untuk menyimpan.");
    render(); // satu ketukan juga terlihat
  }
  function move(e:ReactPointerEvent<HTMLCanvasElement>){
    if(activePointerRef.current!==e.pointerId)return;
    e.preventDefault();
    const line=linesRef.current[linesRef.current.length-1];
    if(!line)return;
    const next=point(e),last=line[line.length-1];
    if(Math.abs(next.x-last.x)+Math.abs(next.y-last.y)<0.0003)return;
    line.push(next);
    render();
  }
  function end(e:ReactPointerEvent<HTMLCanvasElement>){
    if(activePointerRef.current!==e.pointerId)return;
    e.preventDefault();
    const line=linesRef.current[linesRef.current.length-1];
    if(line)line.push(point(e));
    activePointerRef.current=null;
    try{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}catch{}
    render();
    try{
      const png=e.currentTarget.toDataURL("image/png");
      if(!png.startsWith("data:image/png;base64,")||png.length>MAX_SIGNATURE_DATA_URL){
        setReady(false);latestChangeRef.current("");
        setFeedback("TTD terlalu besar. Klik Hapus TTD lalu coba lagi atau unggah PNG.");
        return;
      }
      latestChangeRef.current(png);
      setReady(true);
      setFeedback("✓ Tanda tangan berhasil direkam dan siap dikirim.");
    }catch{
      setReady(false);latestChangeRef.current("");
      setFeedback("TTD gagal diproses. Gunakan opsi unggah PNG.");
    }
  }
  function clear(){
    activePointerRef.current=null;
    linesRef.current=[];
    setUploaded("");setReady(false);
    latestChangeRef.current("");
    setFeedback("TTD dihapus. Silakan tanda tangan kembali.");
    // DOM canvas masih tersedia saat event klik ini.
    render();
  }
  async function upload(e:ChangeEvent<HTMLInputElement>){
    const file=e.currentTarget.files?.[0];
    e.currentTarget.value="";
    if(!file)return;
    // File tidak valid tidak menggantikan TTD lama.
    if(file.type!=="image/png"||file.size===0||file.size>MAX_PNG_UPLOAD){
      setFeedback("Unggah gambar PNG maksimal 350 KB.");return;
    }
    try{
      const bytes=new Uint8Array(await file.arrayBuffer());
      if(bytes.slice(0,8).join(",")!=="137,80,78,71,13,10,26,10")throw new Error("Berkas bukan PNG yang valid.");
      const png=await new Promise<string>((resolve,reject)=>{
        const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));
        reader.onerror=()=>reject(new Error("Gagal membaca PNG."));reader.readAsDataURL(file);
      });
      if(!png.startsWith("data:image/png;base64,")||png.length>MAX_SIGNATURE_DATA_URL)throw new Error("Ukuran PNG terlalu besar.");
      activePointerRef.current=null;linesRef.current=[];
      setUploaded(png);setReady(true);latestChangeRef.current(png);
      setFeedback("✓ Gambar tanda tangan berhasil dipilih dan siap dikirim.");
    }catch(err){setFeedback(err instanceof Error?err.message:"Tidak dapat memproses PNG.");}
  }

  return <div className={`office-sign ${styles.root}`} data-signature-ready={ready?"yes":"no"}>
    <div className={styles.surface}>
      {uploaded ? <img src={uploaded} className={styles.preview} alt="Pratinjau tanda tangan yang diunggah" /> :
        <canvas ref={canvasRef} role="img" aria-label="Area tanda tangan pemohon. Gambar dengan mouse, jari atau stylus."
          style={{touchAction:"none",userSelect:"none"}}
          onPointerDown={begin} onPointerMove={move} onPointerUp={end}
          onPointerCancel={end} onLostPointerCapture={end}/>}
    </div>
    <div className={styles.controls}>
      <small>Gunakan mouse, jari, atau stylus pada area putih di atas.</small>
      <button type="button" className="office-link" onClick={clear}>Hapus TTD</button>
    </div>
    <div className={styles.upload}>
      <label htmlFor="office-ttd-png">Alternatif: unggah TTD PNG (maks. 350 KB)</label>
      <input id="office-ttd-png" type="file" accept="image/png,.png" onChange={upload}/>
    </div>
    <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    <small className={styles.disclaimer}>TTD pemohon ini merupakan tanda tangan sederhana, bukan tanda tangan elektronik tersertifikasi.</small>
  </div>;
}
