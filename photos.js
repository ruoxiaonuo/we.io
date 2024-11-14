class PhotoManager{constructor(){this.photos=JSON.parse(localStorage.getItem("photos"))||[],this.currentFilter="all",this.init()}init(){this.renderPhotos(),this.bindEvents()}bindEvents(){document.getElementById("uploadPhoto").addEventListener("click",()=>{this.showUploadForm()}),document.querySelectorAll(".filter-btn").forEach(e=>{e.addEventListener("click",e=>{document.querySelectorAll(".filter-btn").forEach(e=>e.classList.remove("active")),e.target.classList.add("active"),this.currentFilter=e.target.textContent.toLowerCase(),this.renderPhotos()})})}showUploadForm(){let s=document.createElement("div");s.className="photo-modal",s.innerHTML=`
            <div class="photo-modal-content">
                <span class="close-btn">&times;</span>
                <h3>上传照片</h3>
                <div class="photo-form">
                    <input type="date" id="photoDate" class="photo-input" required>
                    <input type="text" id="photoTitle" class="photo-input" placeholder="标题" required>
                    <textarea id="photoDesc" class="photo-input" placeholder="描述这张照片..." rows="3"></textarea>
                    <select id="photoCategory" class="photo-input">
                        <option value="2024">2024</option>
                        <option value="travel">旅行</option>
                        <option value="daily">日常</option>
                    </select>
                    <div class="image-upload">
                        <label for="photoFile" class="upload-label">
                            <span>选择照片</span>
                            <input type="file" id="photoFile" accept="image/*" required>
                        </label>
                        <div id="photoPreview" class="photo-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(s),s.querySelector(".close-btn").onclick=()=>s.remove(),s.querySelector(".cancel-btn").onclick=()=>s.remove();var e=s.querySelector("#photoFile");let o=s.querySelector("#photoPreview");e.onchange=e=>{var t,e=e.target.files[0];e&&((t=new FileReader).onload=e=>{o.innerHTML=`
                        <div class="preview-image" style="background-image: url(${e.target.result})"></div>
                    `},t.readAsDataURL(e))},s.querySelector(".save-btn").onclick=()=>{var e=s.querySelector("#photoDate").value,t=s.querySelector("#photoTitle").value,o=s.querySelector("#photoDesc").value,i=s.querySelector("#photoCategory").value,a=s.querySelector(".preview-image");e&&t&&a?(this.addPhoto({date:e,title:t,desc:o,category:i,image:a.style.backgroundImage.slice(5,-2),timestamp:(new Date).getTime()}),s.remove()):alert("请填写完整信息并选择照片")},s.onclick=e=>{e.target===s&&s.remove()}}addPhoto(e){this.photos.unshift(e),localStorage.setItem("photos",JSON.stringify(this.photos)),this.renderPhotos()}deletePhoto(e){confirm("确定要删除这张照片吗？")&&(this.photos.splice(e,1),localStorage.setItem("photos",JSON.stringify(this.photos)),this.renderPhotos())}renderPhotos(){let i=document.querySelector(".photo-grid");i.innerHTML="",("all"===this.currentFilter?this.photos:this.photos.filter(e=>e.category===this.currentFilter)).forEach((e,t)=>{var o=document.createElement("div");o.className="photo-item",o.innerHTML=`
                <div class="photo-header">
                    <div class="photo-date">${e.date}</div>
                    <button class="delete-photo-btn" data-index="${t}">×</button>
                </div>
                <div class="photo-image" style="background-image: url(${e.image})"></div>
                <div class="photo-info">
                    <h3>${e.title}</h3>
                    ${e.desc?`<p class="photo-desc">${e.desc}</p>`:""}
                </div>
            `,o.querySelector(".delete-photo-btn").addEventListener("click",e=>{e.stopPropagation(),this.deletePhoto(t)}),o.querySelector(".photo-image").addEventListener("click",()=>{this.showLargePhoto(e)}),i.appendChild(o)})}showLargePhoto(e){let t=document.createElement("div");t.className="photo-view-modal",t.innerHTML=`
            <div class="photo-view-content">
                <span class="close-btn">&times;</span>
                <img src="${e.image}" alt="${e.title}">
                <div class="photo-view-info">
                    <h3>${e.title}</h3>
                    <p class="photo-date">${e.date}</p>
                    ${e.desc?`<p class="photo-desc">${e.desc}</p>`:""}
                </div>
            </div>
        `,document.body.appendChild(t),t.querySelector(".close-btn").onclick=()=>t.remove(),t.onclick=e=>{e.target===t&&t.remove()}}}document.addEventListener("DOMContentLoaded",()=>{new PhotoManager});