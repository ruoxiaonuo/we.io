class UIManager{static showModal(t){let e=document.createElement("div"),s=(e.className="modal",e.innerHTML=`
            <div class="modal-content ${t.className||""}">
                <span class="close-btn">&times;</span>
                <h3>${t.title}</h3>
                <div class="modal-body">
                    ${t.content}
                </div>
                ${t.footer?`
                    <div class="modal-footer">
                        ${t.footer}
                    </div>
                `:""}
            </div>
        `,()=>{e.classList.add("modal-closing"),setTimeout(()=>e.remove(),300),t.onClose?.()});return e.querySelector(".close-btn").onclick=s,e.onclick=t=>{t.target===e&&s()},requestAnimationFrame(()=>{document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("modal-show")})}),e}static showToast(t,e="info"){let s=document.createElement("div");s.className="toast toast-"+e,s.innerHTML=`
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(e)}</span>
                <span class="toast-message">${t}</span>
            </div>
        `,document.body.appendChild(s),requestAnimationFrame(()=>{s.classList.add("toast-show"),setTimeout(()=>{s.classList.add("toast-hide"),setTimeout(()=>s.remove(),300)},3e3)})}static getToastIcon(t){var e={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};return e[t]||e.info}static showConfirm(s){return new Promise(t=>{let e=this.showModal({title:s.title,content:s.message,className:"confirm-modal",footer:`
                    <button class="btn btn-primary confirm-btn">${s.confirmText||"确定"}</button>
                    <button class="btn btn-secondary cancel-btn">${s.cancelText||"取消"}</button>
                `});e.querySelector(".confirm-btn").onclick=()=>{t(!0),e.remove()},e.querySelector(".cancel-btn").onclick=()=>{t(!1),e.remove()}})}static showLoading(t="加载中..."){var e=document.createElement("div");return e.className="loading-overlay",e.innerHTML=`
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${t}</div>
            </div>
        `,document.body.appendChild(e),e}static hideLoading(t){t&&(t.classList.add("loading-hide"),setTimeout(()=>t.remove(),300))}}