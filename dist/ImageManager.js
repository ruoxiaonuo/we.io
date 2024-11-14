class ImageManager{static async handleUpload(t,e={}){var a,r={maxSize:1048576,maxWidth:1920,maxHeight:1080,quality:.8,allowedTypes:["image/jpeg","image/png","image/webp"],...e},o=[];for(a of t)try{if(!r.allowedTypes.includes(a.type))throw new Error("不支持的文件类型");var n=await this.processImage(a,r);o.push(n)}catch(t){console.error("图片处理失败:",t),UIManager.showToast(`图片 ${a.name} 处理失败: `+t.message,"error")}return o}static processImage(i,s){return new Promise((o,n)=>{var t=new FileReader;t.onload=t=>{let r=new Image;r.onload=()=>{try{var{width:t,height:e,dataUrl:a}=this.resizeImage(r,s);o({original:i,width:t,height:e,dataUrl:a,size:this.getDataUrlSize(a)})}catch(t){n(t)}},r.onerror=()=>n(new Error("图片加载失败")),r.src=t.target.result},t.onerror=()=>n(new Error("文件读取失败")),t.readAsDataURL(i)})}static resizeImage(t,e){var a,r=document.createElement("canvas");let{width:o,height:n}=t;return(o>e.maxWidth||n>e.maxHeight)&&(a=Math.min(e.maxWidth/o,e.maxHeight/n),o*=a,n*=a),r.width=o,r.height=n,r.getContext("2d").drawImage(t,0,0,o,n),{width:o,height:n,dataUrl:r.toDataURL("image/jpeg",e.quality)}}static getDataUrlSize(t){t=t.split(",")[1];return Math.round(3*t.length/4)}static showPreview(a,t){a.innerHTML="",t.forEach(t=>{let e=document.createElement("div");e.className="preview-image",e.style.backgroundImage=`url(${t.dataUrl})`;t=document.createElement("button");t.className="preview-delete-btn",t.innerHTML="×",t.onclick=t=>{t.stopPropagation(),e.remove()},e.appendChild(t),a.appendChild(e)})}static showLightbox(t){let e=document.createElement("div"),a=(e.className="lightbox",e.innerHTML=`
            <div class="lightbox-content">
                <span class="close-btn">&times;</span>
                <img src="${t}" alt="大图">
                <div class="lightbox-controls">
                    <button class="rotate-btn" data-rotate="-90">↺</button>
                    <button class="rotate-btn" data-rotate="90">↻</button>
                    <button class="zoom-btn" data-zoom="out">−</button>
                    <button class="zoom-btn" data-zoom="in">+</button>
                </div>
            </div>
        `,document.body.appendChild(e),0),r=1,o=e.querySelector("img");e.querySelectorAll(".rotate-btn").forEach(t=>{t.onclick=()=>{a+=parseInt(t.dataset.rotate),o.style.transform=`rotate(${a}deg) scale(${r})`}}),e.querySelectorAll(".zoom-btn").forEach(t=>{t.onclick=()=>{r*="in"===t.dataset.zoom?1.2:.8,o.style.transform=`rotate(${a}deg) scale(${r})`}}),e.querySelector(".close-btn").onclick=()=>e.remove(),e.onclick=t=>{t.target===e&&e.remove()}}}