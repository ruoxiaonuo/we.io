class ThemeManager{static THEMES={DEFAULT:{primary:"#ff6b6b",secondary:"#ffa5a5",background:"#fff0f0",text:"#333333",textLight:"#666666",white:"#ffffff",shadow:"rgba(0, 0, 0, 0.1)"},DARK:{primary:"#ff4f4f",secondary:"#ff8080",background:"#1a1a1a",text:"#ffffff",textLight:"#cccccc",white:"#2a2a2a",shadow:"rgba(0, 0, 0, 0.3)"}};static currentTheme="DEFAULT";static init(){var t=localStorage.getItem("theme")||"DEFAULT";this.setTheme(t),window.matchMedia("(prefers-color-scheme: dark)").addListener(t=>{this.setTheme(t.matches?"DARK":"DEFAULT")})}static setTheme(t){if(this.THEMES[t]){this.currentTheme=t,localStorage.setItem("theme",t);var e=this.THEMES[t];let r=document.documentElement;Object.entries(e).forEach(([t,e])=>{r.style.setProperty("--"+t,e)}),window.eventBus.emit("themeChanged",t),document.body.className="theme-"+t.toLowerCase()}}static toggleTheme(){var t="DEFAULT"===this.currentTheme?"DARK":"DEFAULT";this.setTheme(t)}static getColor(t){return this.THEMES[this.currentTheme][t]}static getGradient(t="45deg"){var e=this.THEMES[this.currentTheme];return`linear-gradient(${t}, ${e.primary}, ${e.secondary})`}static getShadow(t=1){return`0 ${2*t}px ${4*t}px rgba(0, 0, 0, ${.1*t})`}static addAnimation(e,t,r=300){return e.style.animation=t+` ${r}ms var(--timing-function)`,new Promise(t=>{e.addEventListener("animationend",()=>{e.style.animation="",t()},{once:!0})})}static createThemeToggle(){var t=document.createElement("button");return t.className="theme-toggle",t.innerHTML="DEFAULT"===this.currentTheme?"🌙":"☀️",t.onclick=()=>this.toggleTheme(),t}}let style=document.createElement("style");style.textContent=`
    :root {
        --timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --transition-duration: 300ms;
    }

    body {
        transition: background-color var(--transition-duration) var(--timing-function),
                    color var(--transition-duration) var(--timing-function);
    }

    .theme-toggle {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: var(--primary);
        color: var(--white);
        cursor: pointer;
        box-shadow: var(--shadow);
        transition: transform var(--transition-duration) var(--timing-function);
        z-index: 1000;
    }

    .theme-toggle:hover {
        transform: scale(1.1);
    }

    .theme-dark {
        background-color: var(--background);
        color: var(--text);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`,document.head.appendChild(style),document.addEventListener("DOMContentLoaded",()=>{ThemeManager.init()});