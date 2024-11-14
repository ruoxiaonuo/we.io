class MemoryManager{constructor(){this.memories=JSON.parse(localStorage.getItem("memories"))||[],this.init()}init(){this.renderMemories(),this.bindEvents()}bindEvents(){document.getElementById("addMemory").addEventListener("click",()=>{this.showAddMemoryForm()})}showAddMemoryForm(){let a=document.createElement("div");a.className="memory-modal",a.innerHTML=`
            <div class="memory-modal-content">
                <span class="close-btn">&times;</span>
                <h3>记录新回忆</h3>
                <div class="memory-form">
                    <input type="date" id="memoryDate" class="memory-input" required>
                    <input type="text" id="memoryTitle" class="memory-input" placeholder="标题" required>
                    <textarea id="memoryContent" class="memory-input" placeholder="写下这个美好的瞬间..." rows="4" required></textarea>
                    <div class="image-upload">
                        <label for="memoryImage" class="upload-label">
                            <span>添加图片</span>
                            <input type="file" id="memoryImage" accept="image/*" multiple>
                        </label>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(a),a.querySelector(".close-btn").onclick=()=>a.remove(),a.querySelector(".cancel-btn").onclick=()=>a.remove();var e=a.querySelector("#memoryImage");let i=a.querySelector("#imagePreview");e.onchange=e=>{i.innerHTML="",Array.from(e.target.files).forEach(e=>{var t=new FileReader;t.onload=e=>{var t=document.createElement("div");t.className="preview-image",t.style.backgroundImage=`url(${e.target.result})`,i.appendChild(t)},t.readAsDataURL(e)})},a.querySelector(".save-btn").onclick=()=>{var e=a.querySelector("#memoryDate").value,t=a.querySelector("#memoryTitle").value,r=a.querySelector("#memoryContent").value,m=Array.from(i.children).map(e=>e.style.backgroundImage.slice(5,-2));e&&t&&r?(this.addMemory({date:e,title:t,content:r,images:m,timestamp:(new Date).getTime()}),a.remove()):alert("请填写完整信息")},a.onclick=e=>{e.target===a&&a.remove()}}addMemory(e){this.memories.unshift(e),localStorage.setItem("memories",JSON.stringify(this.memories)),this.renderMemories()}deleteMemory(e){confirm("确定要删除这条回忆吗？")&&(this.memories.splice(e,1),localStorage.setItem("memories",JSON.stringify(this.memories)),this.renderMemories())}renderMemories(){let m=document.querySelector(".memory-timeline");m.innerHTML="",this.memories.forEach((e,t)=>{var r=document.createElement("div");r.className="memory-card",r.innerHTML=`
                <div class="memory-header">
                    <div class="memory-date">${e.date}</div>
                    <button class="delete-memory-btn" data-index="${t}">×</button>
                </div>
                <div class="memory-content">
                    <h3>${e.title}</h3>
                    <p>${e.content}</p>
                    ${e.images&&0<e.images.length?`
                        <div class="memory-images">
                            ${e.images.map(e=>`
                                <div class="memory-image" style="background-image: url(${e})"></div>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,r.querySelector(".delete-memory-btn").addEventListener("click",e=>{e.stopPropagation(),this.deleteMemory(t)}),m.appendChild(r)})}}document.addEventListener("DOMContentLoaded",()=>{new MemoryManager});