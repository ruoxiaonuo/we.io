class AudioManager{static SOUNDS={CLICK:"click.mp3",SUCCESS:"success.mp3",ERROR:"error.mp3",NOTIFICATION:"notification.mp3",HOVER:"hover.mp3"};constructor(){this.enabled=!0,this.volume=.5,this.sounds={},this.init()}init(){Object.entries(AudioManager.SOUNDS).forEach(([e,t])=>{t=new Audio("sounds/"+t);t.preload="auto",t.volume=this.volume,this.sounds[e]=t});var e,t=localStorage.getItem("audioSettings");t&&({enabled:t,volume:e}=JSON.parse(t),this.enabled=t,this.volume=e,this.updateVolume(e)),document.addEventListener("click",e=>{e.target.matches('button, .btn, [role="button"]')&&this.playSound("CLICK")}),document.addEventListener("mouseover",e=>{e.target.matches('button, .btn, [role="button"]')&&this.playSound("HOVER")})}playSound(t){if(this.enabled){t=this.sounds[t];if(t){let e=t.cloneNode();e.volume=this.volume,e.play().catch(e=>{console.warn("音频播放失败:",e)}),e.onended=()=>e.remove()}}}updateVolume(e){this.volume=Math.max(0,Math.min(1,e)),Object.values(this.sounds).forEach(e=>{e.volume=this.volume}),this.saveSettings()}toggle(e=!this.enabled){this.enabled=e,this.saveSettings()}saveSettings(){localStorage.setItem("audioSettings",JSON.stringify({enabled:this.enabled,volume:this.volume}))}createControls(){var e=document.createElement("div");e.className="audio-controls",e.innerHTML=`
            <div class="audio-panel">
                <label class="audio-toggle">
                    <input type="checkbox" ${this.enabled?"checked":""}>
                    <span class="toggle-label">音效</span>
                </label>
                <div class="volume-control">
                    <span class="volume-icon">🔊</span>
                    <input type="range" 
                           min="0" 
                           max="100" 
                           value="${100*this.volume}"
                           class="volume-slider">
                </div>
            </div>
        `;let t=e.querySelector('input[type="checkbox"]'),o=(t.addEventListener("change",()=>{this.toggle(t.checked)}),e.querySelector(".volume-slider"));return o.addEventListener("input",()=>{this.updateVolume(o.value/100)}),e}playSuccess(){this.playSound("SUCCESS")}playError(){this.playSound("ERROR")}playNotification(){this.playSound("NOTIFICATION")}}let style=document.createElement("style");style.textContent=`
    .audio-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }

    .audio-panel {
        background: white;
        padding: 10px 15px;
        border-radius: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .audio-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .volume-control {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .volume-slider {
        width: 80px;
        height: 4px;
        -webkit-appearance: none;
        background: #eee;
        border-radius: 2px;
        outline: none;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: #ff6b6b;
        border-radius: 50%;
        cursor: pointer;
    }

    .volume-icon {
        font-size: 1.2em;
        color: #666;
    }
`,document.head.appendChild(style),document.addEventListener("DOMContentLoaded",()=>{window.audioManager=new AudioManager,document.body.appendChild(window.audioManager.createControls())});