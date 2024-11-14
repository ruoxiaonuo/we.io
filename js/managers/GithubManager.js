class GithubManager{constructor(){this.token=Utils.storage.get("githubToken"),this.repo=Utils.storage.get("githubRepo"),this.baseUrl="https://api.github.com",this.init()}init(){this.bindEvents(),this.checkConfig()}bindEvents(){var t=document.getElementById("githubConfigBtn");t&&t.addEventListener("click",()=>this.showConfigModal())}checkConfig(){return!(!this.token||!this.repo)||(console.warn("GitHub 配置未完成"),!1)}async syncData(t,e="memory"){try{if(!this.checkConfig())throw new Error("请先完成 GitHub 配置");LoadingManager.show("正在同步...");var o,s=(new Date).toISOString(),n=`data/${e}s/${s}.json`,i=btoa(JSON.stringify(t,null,2)),a=await fetch(`${this.baseUrl}/repos/${this.repo}/contents/`+n,{method:"PUT",headers:{Authorization:"token "+this.token,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify({message:`Add ${e}: `+s,content:i})});if(a.ok)return UIManager.showToast("同步成功","success"),!0;throw o=await a.json(),new Error(o.message)}catch(t){return UIManager.showToast(t.message,"error"),!1}finally{LoadingManager.hide()}}showConfigModal(){let t=UIManager.createModal({title:"GitHub 同步设置",content:`
                <div class="github-config-form">
                    <div class="form-group">
                        <label>Personal Access Token</label>
                        <input type="password" id="githubToken" 
                               class="form-input" 
                               value="${this.token||""}"
                               placeholder="输入你的 GitHub Token">
                        <div class="form-help">
                            <i class="fas fa-info-circle"></i>
                            在 GitHub Settings -> Developer settings -> 
                            Personal access tokens 生成
                        </div>
                    </div>
                    <div class="form-group">
                        <label>仓库地址</label>
                        <input type="text" id="githubRepo" 
                               class="form-input" 
                               value="${this.repo||""}"
                               placeholder="username/repository">
                        <div class="form-help">
                            <i class="fas fa-info-circle"></i>
                            格式：用户名/仓库名，例如：john/our-memory-data
                        </div>
                    </div>
                </div>
            `,footer:`
                <button class="btn btn-primary save-config">保存配置</button>
                <button class="btn btn-secondary" data-dismiss="modal">取消</button>
                <button class="btn btn-link test-config">测试连接</button>
            `});t.querySelector(".save-config").onclick=()=>this.saveConfig(t),t.querySelector(".test-config").onclick=()=>this.testConnection()}async saveConfig(t){var e=document.getElementById("githubToken").value.trim(),o=document.getElementById("githubRepo").value.trim();e&&o?(this.token=e,this.repo=o,Utils.storage.set("githubToken",e),Utils.storage.set("githubRepo",o),UIManager.showToast("配置已保存","success"),t.close()):UIManager.showToast("请填写完整信息","error")}async testConnection(){try{LoadingManager.show("测试连接中...");var t=document.getElementById("githubToken").value.trim(),e=document.getElementById("githubRepo").value.trim();if(!t||!e)throw new Error("请先填写配置信息");if(!(await fetch(this.baseUrl+"/repos/"+e,{headers:{Authorization:"token "+t,Accept:"application/vnd.github.v3+json"}})).ok)throw new Error("连接测试失败，请检查配置");UIManager.showToast("连接测试成功","success")}catch(t){UIManager.showToast(t.message,"error")}finally{LoadingManager.hide()}}}