let mapConfig={width:800,height:600,locations:[{name:"西湖",x:400,y:300,description:"美丽的西湖"},{name:"钱塘江",x:450,y:350,description:"壮观的钱塘江"}]};class LocalMap{constructor(e){this.container=document.getElementById(e),this.markers=[],this.init()}init(){this.svg=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.svg.setAttribute("width",mapConfig.width),this.svg.setAttribute("height",mapConfig.height),this.svg.style.background="#f0f0f0";var e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttribute("width","100%"),e.setAttribute("height","100%"),e.setAttribute("fill","none"),e.setAttribute("stroke","#ccc"),this.svg.appendChild(e),this.svg.addEventListener("click",e=>{var t=this.svg.getBoundingClientRect(),a=e.clientX-t.left;this.addMarker(a,e.clientY-t.top)}),this.container.appendChild(this.svg),this.renderExistingLocations()}renderExistingLocations(){mapConfig.locations.forEach(e=>{this.addMarker(e.x,e.y,e)})}addMarker(e,t,a=null){var i=document.createElementNS("http://www.w3.org/2000/svg","g"),s=document.createElementNS("http://www.w3.org/2000/svg","circle"),n=(s.setAttribute("cx",e),s.setAttribute("cy",t),s.setAttribute("r","6"),s.setAttribute("fill","#ff6b6b"),document.createElementNS("http://www.w3.org/2000/svg","text"));n.setAttribute("x",e+10),n.setAttribute("y",t+5),n.setAttribute("fill","#333"),n.textContent=a?a.name:"新地点",i.appendChild(s),i.appendChild(n),i.addEventListener("click",()=>{this.showLocationDetails(a||{x:e,y:t,name:"新地点"})}),this.svg.appendChild(i),this.markers.push(i)}showLocationDetails(e){var t=document.createElement("div");t.className="map-modal",t.innerHTML=`
            <div class="map-modal-content">
                <span class="close-btn">&times;</span>
                <h3>${e.name}</h3>
                <div class="map-form">
                    <input type="date" id="visitDate" class="map-input" required>
                    <textarea id="visitDesc" class="map-input" placeholder="记录这里的故事..." rows="4"></textarea>
                    <div class="image-upload">
                        <label for="locationImages" class="upload-label">
                            <span>添加照片</span>
                            <input type="file" id="locationImages" accept="image/*" multiple>
                        </label>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(t),this.bindModalEvents(t,e)}bindModalEvents(i,s){var e=i.querySelector(".close-btn"),t=i.querySelector(".cancel-btn"),a=i.querySelector(".save-btn"),n=i.querySelector("#locationImages");let r=i.querySelector("#imagePreview");e.onclick=()=>i.remove(),t.onclick=()=>i.remove(),n.onchange=e=>{r.innerHTML="",Array.from(e.target.files).forEach(e=>{var t=new FileReader;t.onload=e=>{var t=document.createElement("div");t.className="preview-image",t.style.backgroundImage=`url(${e.target.result})`,r.appendChild(t)},t.readAsDataURL(e)})},a.onclick=()=>{var e=document.getElementById("visitDate").value,t=document.getElementById("visitDesc").value,a=Array.from(r.children).map(e=>e.style.backgroundImage.slice(5,-2));e?(this.saveLocation({...s,date:e,desc:t,images:a}),i.remove()):alert("请选择日期")}}saveLocation(e){var t=JSON.parse(localStorage.getItem("mapLocations")||"[]");t.push(e),localStorage.setItem("mapLocations",JSON.stringify(t))}}