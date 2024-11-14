class SettingsManager{static DEFAULTS={theme:"DEFAULT",notifications:{enabled:!0,types:{anniversary:!0,memory:!0,calendar:!0,fight:!0},advanceTime:{days:1,hours:0}},display:{showLunar:!0,showFestivals:!0,timeFormat:"24h"},privacy:{autoLock:!1,lockTimeout:5,requirePassword:!1,password:""},backup:{autoBackup:!1,backupInterval:7,lastBackup:null}};constructor(){this.settings=this.loadSettings(),this.init()}init(){window.eventBus.on("settingsChanged",t=>{this.saveSettings(t)}),this.createSettingsPanel()}loadSettings(){try{var t=localStorage.getItem("appSettings");return t?this.mergeSettings(JSON.parse(t)):{...SettingsManager.DEFAULTS}}catch(t){return console.error("加载设置失败:",t),{...SettingsManager.DEFAULTS}}}mergeSettings(t){var e,s,i={...SettingsManager.DEFAULTS};for([e,s]of Object.entries(t))s&&"object"==typeof s&&!Array.isArray(s)?i[e]=this.mergeSettings({...SettingsManager.DEFAULTS[e],...s}):i[e]=s;return i}saveSettings(t=this.settings){try{localStorage.setItem("appSettings",JSON.stringify(t)),this.settings=t,window.eventBus.emit("settingsUpdated",t)}catch(t){console.error("保存设置失败:",t),UIManager.showToast("设置保存失败","error")}}createSettingsPanel(){var t=document.createElement("div");return t.className="settings-panel",t.innerHTML=`
            <div class="settings-content">
                <h2>设置</h2>
                <div class="settings-sections">
                    ${this.createThemeSection()}
                    ${this.createNotificationSection()}
                    ${this.createDisplaySection()}
                    ${this.createPrivacySection()}
                    ${this.createBackupSection()}
                </div>
                <div class="settings-footer">
                    <button class="save-settings">保存设置</button>
                    <button class="reset-settings">重置设置</button>
                </div>
            </div>
        `,this.bindSettingsEvents(t),t}createThemeSection(){return`
            <section class="settings-section">
                <h3>主题设置</h3>
                <div class="setting-item">
                    <label>主题选择</label>
                    <select name="theme">
                        <option value="DEFAULT" ${"DEFAULT"===this.settings.theme?"selected":""}>默认主题</option>
                        <option value="DARK" ${"DARK"===this.settings.theme?"selected":""}>暗色主题</option>
                    </select>
                </div>
            </section>
        `}createNotificationSection(){return`
            <section class="settings-section">
                <h3>通知设置</h3>
                <div class="setting-item">
                    <label>启用通知</label>
                    <input type="checkbox" name="notifications.enabled" 
                        ${this.settings.notifications.enabled?"checked":""}>
                </div>
                <div class="setting-item">
                    <label>提前提醒时间</label>
                    <div class="time-inputs">
                        <input type="number" name="notifications.advanceTime.days" 
                            value="${this.settings.notifications.advanceTime.days}" min="0"> 天
                        <input type="number" name="notifications.advanceTime.hours" 
                            value="${this.settings.notifications.advanceTime.hours}" min="0" max="23"> 小时
                    </div>
                </div>
            </section>
        `}createDisplaySection(){return`
            <section class="settings-section">
                <h3>显示设置</h3>
                <div class="setting-item">
                    <label>显示农历</label>
                    <input type="checkbox" name="display.showLunar" 
                        ${this.settings.display.showLunar?"checked":""}>
                </div>
                <div class="setting-item">
                    <label>显示节日</label>
                    <input type="checkbox" name="display.showFestivals" 
                        ${this.settings.display.showFestivals?"checked":""}>
                </div>
            </section>
        `}createPrivacySection(){return`
            <section class="settings-section">
                <h3>隐私设置</h3>
                <div class="setting-item">
                    <label>自动锁定</label>
                    <input type="checkbox" name="privacy.autoLock" 
                        ${this.settings.privacy.autoLock?"checked":""}>
                </div>
                <div class="setting-item">
                    <label>锁定时间（分钟）</label>
                    <input type="number" name="privacy.lockTimeout" 
                        value="${this.settings.privacy.lockTimeout}" min="1">
                </div>
            </section>
        `}createBackupSection(){return`
            <section class="settings-section">
                <h3>备份设置</h3>
                <div class="setting-item">
                    <label>自动备份</label>
                    <input type="checkbox" name="backup.autoBackup" 
                        ${this.settings.backup.autoBackup?"checked":""}>
                </div>
                <div class="setting-item">
                    <label>备份间隔（天）</label>
                    <input type="number" name="backup.backupInterval" 
                        value="${this.settings.backup.backupInterval}" min="1">
                </div>
                <div class="setting-item">
                    <button class="backup-now">立即备份</button>
                    <button class="restore-backup">恢复备份</button>
                </div>
            </section>
        `}bindSettingsEvents(e){e.querySelector(".save-settings").onclick=()=>{var t=this.collectFormData(e);this.saveSettings(t),UIManager.showToast("设置已保存","success")},e.querySelector(".reset-settings").onclick=()=>{confirm("确定要重置所有设置吗？")&&(this.settings={...SettingsManager.DEFAULTS},this.saveSettings(),UIManager.showToast("设置已重置","success"))},e.querySelector(".backup-now").onclick=()=>{DataManager.exportData()},e.querySelector(".restore-backup").onclick=()=>{var t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=async t=>{t=t.target.files[0];t&&await DataManager.importData(t)},t.click()}}collectFormData(t){let i={...this.settings};return t.querySelectorAll("input, select").forEach(t=>{var e=t.name.split(".");let s=i;for(let t=0;t<e.length-1;t++)s=s[e[t]];t="checkbox"===t.type?t.checked:"number"===t.type?Number(t.value):t.value;s[e[e.length-1]]=t}),i}getSetting(t){return t.split(".").reduce((t,e)=>t?.[e],this.settings)}updateSetting(t,e){var t=t.split("."),s=t.pop();t.reduce((t,e)=>t[e],this.settings)[s]=e,this.saveSettings()}}document.addEventListener("DOMContentLoaded",()=>{window.settingsManager=new SettingsManager});