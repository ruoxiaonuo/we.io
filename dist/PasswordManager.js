class PasswordManager{static HASH_ITERATIONS=1e3;static LOCK_TIMEOUT=3e5;constructor(){this.isLocked=!1,this.lastActivity=Date.now(),this.init()}init(){"true"===localStorage.getItem("hasPassword")&&this.lock(),document.addEventListener("mousemove",()=>this.updateActivity()),document.addEventListener("keydown",()=>this.updateActivity()),setInterval(()=>this.checkLockStatus(),6e4),window.eventBus.on("settingsUpdated",t=>{t.privacy.autoLock?this.startAutoLock():this.stopAutoLock()})}async setPassword(t){try{var e=crypto.getRandomValues(new Uint8Array(16)),o=await this.hashPassword(t,e);return localStorage.setItem("passwordHash",o),localStorage.setItem("passwordSalt",this.arrayToHex(e)),localStorage.setItem("hasPassword","true"),!0}catch(t){return console.error("设置密码失败:",t),!1}}async verifyPassword(t){try{var e=localStorage.getItem("passwordHash"),o=this.hexToArray(localStorage.getItem("passwordSalt"));return await this.hashPassword(t,o)===e}catch(t){return console.error("验证密码失败:",t),!1}}async hashPassword(t,e){t=(new TextEncoder).encode(t),e=await crypto.subtle.digest("SHA-256",new Uint8Array([...e,...t]));return this.arrayToHex(new Uint8Array(e))}arrayToHex(t){return Array.from(t).map(t=>t.toString(16).padStart(2,"0")).join("")}hexToArray(e){var o=new Uint8Array(e.length/2);for(let t=0;t<e.length;t+=2)o[t/2]=parseInt(e.substr(t,2),16);return o}lock(){this.isLocked=!0,this.showLockScreen()}async unlock(t){return!!await this.verifyPassword(t)&&(this.isLocked=!1,this.hideLockScreen(),this.updateActivity(),!0)}updateActivity(){this.lastActivity=Date.now()}checkLockStatus(){!this.isLocked&&window.settingsManager.getSetting("privacy.autoLock")&&Date.now()-this.lastActivity>PasswordManager.LOCK_TIMEOUT&&this.lock()}showLockScreen(){let e=document.createElement("div"),o=(e.className="lock-screen",e.innerHTML=`
            <div class="lock-content">
                <h2>🔒 已锁定</h2>
                <div class="password-form">
                    <input type="password" id="unlockPassword" 
                           placeholder="请输入密码" class="password-input">
                    <button id="unlockButton" class="unlock-btn">解锁</button>
                </div>
            </div>
        `,document.body.appendChild(e),document.getElementById("unlockButton")),r=document.getElementById("unlockPassword");o.onclick=async()=>{var t=r.value;await this.unlock(t)?e.remove():(r.value="",r.classList.add("error"),setTimeout(()=>r.classList.remove("error"),1e3))},r.onkeypress=t=>{"Enter"===t.key&&o.click()}}hideLockScreen(){var t=document.querySelector(".lock-screen");t&&t.remove()}startAutoLock(){this.autoLockInterval=setInterval(()=>this.checkLockStatus(),6e4)}stopAutoLock(){this.autoLockInterval&&clearInterval(this.autoLockInterval)}}let style=document.createElement("style");style.textContent=`
    .lock-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 107, 107, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .lock-content {
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .password-form {
        margin-top: 30px;
    }

    .password-input {
        padding: 12px 20px;
        border: 2px solid #eee;
        border-radius: 25px;
        font-size: 16px;
        width: 250px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }

    .password-input:focus {
        outline: none;
        border-color: #ff6b6b;
    }

    .password-input.error {
        border-color: #ff4f4f;
        animation: shake 0.5s;
    }

    .unlock-btn {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .unlock-btn:hover {
        background: #ff5252;
        transform: translateY(-2px);
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`,document.head.appendChild(style),document.addEventListener("DOMContentLoaded",()=>{window.passwordManager=new PasswordManager});