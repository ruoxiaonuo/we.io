class FightManager{constructor(){this.fights=JSON.parse(localStorage.getItem("fights"))||[],this.init()}init(){this.renderFights(),this.bindEvents()}bindEvents(){document.getElementById("addFight").addEventListener("click",()=>{this.showAddFightForm()})}showAddFightForm(){let n=document.createElement("div");n.className="fight-modal",n.innerHTML=`
            <div class="fight-modal-content">
                <span class="close-btn">&times;</span>
                <h3>记录新争吵</h3>
                <div class="fight-form">
                    <input type="date" id="fightDate" class="fight-input" required>
                    <input type="text" id="fightReason" class="fight-input" placeholder="争吵原因" required>
                    <textarea id="fightDesc" class="fight-input" placeholder="详细描述..." rows="3"></textarea>
                    <textarea id="fightSolution" class="fight-input" placeholder="解决方案..." rows="3"></textarea>
                    <select id="fightStatus" class="fight-input">
                        <option value="resolved">已解决</option>
                        <option value="ongoing">未解决</option>
                    </select>
                    <div class="image-upload">
                        <label for="fightImages" class="upload-label">
                            <span>添加照片</span>
                            <input type="file" id="fightImages" accept="image/*" multiple>
                        </label>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(n),n.querySelector(".close-btn").onclick=()=>n.remove(),n.querySelector(".cancel-btn").onclick=()=>n.remove();var e=n.querySelector("#fightImages");let r=n.querySelector("#imagePreview");e.onchange=e=>{r.innerHTML="",Array.from(e.target.files).forEach(e=>{var t=new FileReader;t.onload=e=>{var t=document.createElement("div");t.className="preview-image",t.style.backgroundImage=`url(${e.target.result})`,r.appendChild(t)},t.readAsDataURL(e)})},n.querySelector(".save-btn").onclick=()=>{var e=n.querySelector("#fightDate").value,t=n.querySelector("#fightReason").value,i=n.querySelector("#fightDesc").value,a=n.querySelector("#fightSolution").value,s=n.querySelector("#fightStatus").value,l=Array.from(r.children).map(e=>e.style.backgroundImage.slice(5,-2));e&&t?(this.addFight({date:e,reason:t,desc:i,solution:a,status:s,images:l,timestamp:(new Date).getTime()}),n.remove()):alert("请填写日期和争吵原因")},n.onclick=e=>{e.target===n&&n.remove()}}addFight(e){this.fights.unshift(e),localStorage.setItem("fights",JSON.stringify(this.fights)),this.renderFights()}deleteFight(e){confirm("确定要删除这条记录吗？")&&(this.fights.splice(e,1),localStorage.setItem("fights",JSON.stringify(this.fights)),this.renderFights())}renderFights(){let a=document.querySelector(".fights-timeline");a.innerHTML="",this.fights.forEach((e,t)=>{var i=document.createElement("div");i.className="fight-card",i.innerHTML=`
                <div class="fight-header">
                    <div class="fight-date">${e.date}</div>
                    <button class="delete-fight-btn" data-index="${t}">×</button>
                </div>
                <h3 class="fight-reason">${e.reason}</h3>
                ${e.desc?`<p class="fight-desc">${e.desc}</p>`:""}
                ${e.solution?`<p class="fight-solution">解决方案：${e.solution}</p>`:""}
                ${e.images&&0<e.images.length?`
                    <div class="fight-images">
                        ${e.images.map(e=>`
                            <div class="fight-image" style="background-image: url(${e})"></div>
                        `).join("")}
                    </div>
                `:""}
                <div class="fight-status status-${e.status}">
                    ${"resolved"===e.status?"已解决":"未解决"}
                </div>
            `,i.querySelector(".delete-fight-btn").addEventListener("click",e=>{e.stopPropagation(),this.deleteFight(t)}),i.querySelectorAll(".fight-image").forEach(e=>{e.addEventListener("click",()=>{this.showLargeImage(e.style.backgroundImage.slice(5,-2))})}),a.appendChild(i)})}showLargeImage(e){let t=document.createElement("div");t.className="image-view-modal",t.innerHTML=`
            <div class="image-view-content">
                <span class="close-btn">&times;</span>
                <img src="${e}" alt="照片">
            </div>
        `,document.body.appendChild(t),t.querySelector(".close-btn").onclick=()=>t.remove(),t.onclick=e=>{e.target===t&&t.remove()}}}document.addEventListener("DOMContentLoaded",()=>{new FightManager});