class ErrorHandler{static showError(r,e=3e3){let s=document.createElement("div");s.className="error-message",s.innerHTML=`
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-text">${r}</span>
            </div>
        `,document.body.appendChild(s),requestAnimationFrame(()=>{s.style.opacity="1",s.style.transform="translateY(0)"}),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(20px)",setTimeout(()=>s.remove(),CONFIG.ANIMATION.DURATION)},e)}static handleApiError(r){console.error("API Error:",r),this.showError(r.message||CONFIG.MESSAGES.ERROR.LOAD_FAILED)}static handleStorageError(r){console.error("Storage Error:",r),this.showError(CONFIG.MESSAGES.ERROR.SAVE_FAILED)}}