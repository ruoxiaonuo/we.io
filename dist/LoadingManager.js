class LoadingManager{static show(e="加载中..."){let a=document.createElement("div");a.className="loading-overlay",a.innerHTML=`
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${e}</div>
            </div>
        `,document.body.appendChild(a),requestAnimationFrame(()=>{a.style.opacity="1"})}static hide(){let e=document.querySelector(".loading-overlay");e&&(e.style.opacity="0",setTimeout(()=>e.remove(),CONFIG.ANIMATION.DURATION))}}