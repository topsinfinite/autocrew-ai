/* AutoCrew Chat Widget v1.0.0 - https://autocrew.ai */
"use strict";(()=>{var c={PRIMARY_COLOR:"#0891b2",POSITION:"bottom-right",THEME:"auto",TITLE:"Chat with us",SUBTITLE:"",WELCOME_MESSAGE:"Hi! How can I help you today?",FIRST_LAUNCH_ACTION:"none",GREETING_DELAY:3e3,SESSION_MAX_AGE:864e5,MESSAGE_DEBOUNCE:500};function K(t){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function J(t,e,n){return"#"+[t,e,n].map(i=>{let o=Math.max(0,Math.min(255,Math.round(i))).toString(16);return o.length===1?"0"+o:o}).join("")}function A(t,e){let n=K(t);if(!n)return t;let i=1-e/100;return J(n.r*i,n.g*i,n.b*i)}function X(t){return t!=="auto"?t:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function N(t,e){let n=X(e),i=A(t,10);return n==="dark"?`
      :host {
        --ac-primary: ${t};
        --ac-primary-hover: ${i};
        --ac-primary-text: #ffffff;
        --ac-bg: #1e293b;
        --ac-bg-secondary: #334155;
        --ac-bg-tertiary: #475569;
        --ac-text: #f1f5f9;
        --ac-text-muted: #94a3b8;
        --ac-border: #475569;
        --ac-user-bubble: ${t};
        --ac-user-text: #ffffff;
        --ac-bot-bubble: #334155;
        --ac-bot-text: #f1f5f9;
        --ac-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
        --ac-input-bg: #334155;
        --ac-input-border: #475569;
        --ac-input-focus: ${t};
      }
    `:`
    :host {
      --ac-primary: ${t};
      --ac-primary-hover: ${i};
      --ac-primary-text: #ffffff;
      --ac-bg: #ffffff;
      --ac-bg-secondary: #f8fafc;
      --ac-bg-tertiary: #f1f5f9;
      --ac-text: #1e293b;
      --ac-text-muted: #64748b;
      --ac-border: #e2e8f0;
      --ac-user-bubble: ${t};
      --ac-user-text: #ffffff;
      --ac-bot-bubble: #f1f5f9;
      --ac-bot-text: #1e293b;
      --ac-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
      --ac-input-bg: #ffffff;
      --ac-input-border: #e2e8f0;
      --ac-input-focus: ${t};
    }
  `}function v(t,e,n){let i=N(t,e),o=n==="bottom-left"?"left: 20px;":"right: 20px;";return`
    ${i}

    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Chat Button */
    .ac-button {
      position: fixed;
      bottom: 20px;
      ${o}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--ac-primary);
      border: none;
      cursor: pointer;
      box-shadow: var(--ac-shadow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background 0.2s ease;
      z-index: 9999;
    }

    .ac-button:hover {
      background: var(--ac-primary-hover);
      transform: scale(1.05);
    }

    .ac-button:focus {
      outline: 2px solid var(--ac-primary);
      outline-offset: 2px;
    }

    .ac-button svg {
      width: 28px;
      height: 28px;
      fill: var(--ac-primary-text);
      transition: transform 0.2s ease;
    }

    .ac-button.open svg {
      transform: rotate(90deg);
    }

    /* Chat Window */
    .ac-window {
      position: fixed;
      bottom: 90px;
      ${o}
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: var(--ac-bg);
      border-radius: 16px;
      box-shadow: var(--ac-shadow);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      border: 1px solid var(--ac-border);
    }

    .ac-window.open {
      display: flex;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Header */
    .ac-header {
      padding: 16px;
      background: var(--ac-primary);
      color: var(--ac-primary-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .ac-header-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ac-header-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .ac-header-subtitle {
      font-size: 12px;
      opacity: 0.9;
      margin: 0;
    }

    .ac-close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .ac-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .ac-close-btn svg {
      width: 20px;
      height: 20px;
      fill: var(--ac-primary-text);
    }

    /* Messages Area */
    .ac-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--ac-bg-secondary);
    }

    .ac-messages::-webkit-scrollbar {
      width: 6px;
    }

    .ac-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .ac-messages::-webkit-scrollbar-thumb {
      background: var(--ac-border);
      border-radius: 3px;
    }

    /* Message Bubble */
    .ac-message {
      display: flex;
      flex-direction: column;
      max-width: 85%;
    }

    .ac-message.user {
      align-self: flex-end;
    }

    .ac-message.assistant {
      align-self: flex-start;
    }

    .ac-message-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .ac-message.user .ac-message-bubble {
      background: var(--ac-user-bubble);
      color: var(--ac-user-text);
      border-bottom-right-radius: 4px;
    }

    .ac-message.assistant .ac-message-bubble {
      background: var(--ac-bot-bubble);
      color: var(--ac-bot-text);
      border-bottom-left-radius: 4px;
    }

    .ac-message-time {
      font-size: 10px;
      color: var(--ac-text-muted);
      margin-top: 4px;
      padding: 0 4px;
    }

    .ac-message.user .ac-message-time {
      text-align: right;
    }

    /* Typing Indicator */
    .ac-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: var(--ac-bot-bubble);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }

    .ac-typing-dot {
      width: 8px;
      height: 8px;
      background: var(--ac-text-muted);
      border-radius: 50%;
      animation: typingBounce 1.4s ease-in-out infinite;
    }

    .ac-typing-dot:nth-child(1) { animation-delay: 0s; }
    .ac-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .ac-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Input Area */
    .ac-input-area {
      padding: 12px 16px;
      background: var(--ac-bg);
      border-top: 1px solid var(--ac-border);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .ac-input-wrapper {
      flex: 1;
      position: relative;
    }

    .ac-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--ac-input-border);
      border-radius: 20px;
      background: var(--ac-input-bg);
      color: var(--ac-text);
      font-size: 14px;
      font-family: inherit;
      resize: none;
      max-height: 100px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .ac-input:focus {
      border-color: var(--ac-input-focus);
    }

    .ac-input::placeholder {
      color: var(--ac-text-muted);
    }

    .ac-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--ac-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease, opacity 0.2s ease;
      flex-shrink: 0;
    }

    .ac-send-btn:hover:not(:disabled) {
      background: var(--ac-primary-hover);
    }

    .ac-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ac-send-btn svg {
      width: 18px;
      height: 18px;
      fill: var(--ac-primary-text);
    }

    /* Greeting Bubble */
    .ac-greeting {
      position: fixed;
      bottom: 90px;
      ${o}
      max-width: 280px;
      padding: 12px 16px;
      background: var(--ac-bg);
      border-radius: 16px;
      border-bottom-right-radius: ${n==="bottom-left"?"16px":"4px"};
      border-bottom-left-radius: ${n==="bottom-left"?"4px":"16px"};
      box-shadow: var(--ac-shadow);
      z-index: 9997;
      cursor: pointer;
      transition: transform 0.2s ease;
      animation: slideIn 0.3s ease;
      border: 1px solid var(--ac-border);
    }

    .ac-greeting:hover {
      transform: scale(1.02);
    }

    .ac-greeting-text {
      color: var(--ac-text);
      font-size: 14px;
      margin: 0;
    }

    .ac-greeting-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ac-bg-tertiary);
      border: 1px solid var(--ac-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--ac-text-muted);
    }

    .ac-greeting-close:hover {
      background: var(--ac-border);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Error Message */
    .ac-error {
      padding: 10px 14px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 13px;
      text-align: center;
      margin: 8px 0;
    }

    /* Mobile Responsive */
    @media (max-width: 420px) {
      .ac-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        bottom: 80px;
        left: 10px;
        right: 10px;
        border-radius: 12px;
      }

      .ac-button {
        width: 56px;
        height: 56px;
      }

      .ac-greeting {
        left: 10px;
        right: 70px;
        max-width: none;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .ac-window.open,
      .ac-greeting,
      .ac-button,
      .ac-button svg {
        animation: none;
        transition: none;
      }

      .ac-typing-dot {
        animation: none;
      }
    }
  `}function r(t,e,n){let i=document.createElement(t);return e&&Object.entries(e).forEach(([o,a])=>{o==="className"?i.className=a:(o.startsWith("data-"),i.setAttribute(o,a))}),n&&n.forEach(o=>{typeof o=="string"?i.appendChild(document.createTextNode(o)):i.appendChild(o)}),i}function C(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function W(t){return C(t).replace(/\n/g,"<br>")}function u(t){t.scrollTop=t.scrollHeight}var H=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
  </svg>
`,Q=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`;function B(t){let e=r("button",{className:"ac-button","aria-label":"Open chat","aria-expanded":"false"});return e.innerHTML=H,e.addEventListener("click",()=>{t.onToggle()}),e}function y(t,e){t.innerHTML=e?Q:H,t.setAttribute("aria-expanded",String(e)),t.setAttribute("aria-label",e?"Close chat":"Open chat"),t.classList.toggle("open",e)}var Z=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`,ee=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
`;function _(t,e,n){let i=r("div",{className:"ac-window"}),o=r("div",{className:"ac-header"}),a=r("div",{className:"ac-header-content"}),g=r("h2",{className:"ac-header-title"},[t]);if(a.appendChild(g),e){let l=r("p",{className:"ac-header-subtitle"},[e]);a.appendChild(l)}let d=r("button",{className:"ac-close-btn","aria-label":"Close chat"});d.innerHTML=Z,d.addEventListener("click",n.onClose),o.appendChild(a),o.appendChild(d);let p=r("div",{className:"ac-messages",role:"log","aria-live":"polite","aria-label":"Chat messages"}),x=r("div",{className:"ac-input-area"}),I=r("div",{className:"ac-input-wrapper"}),s=document.createElement("textarea");s.className="ac-input",s.placeholder="Type a message...",s.rows=1,s.setAttribute("aria-label","Message input"),s.addEventListener("input",()=>{s.style.height="auto",s.style.height=Math.min(s.scrollHeight,100)+"px"}),s.addEventListener("keydown",l=>{if(l.key==="Enter"&&!l.shiftKey){l.preventDefault();let k=s.value.trim();k&&(n.onSend(k),s.value="",s.style.height="auto")}}),I.appendChild(s);let m=r("button",{className:"ac-send-btn","aria-label":"Send message"});return m.innerHTML=ee,m.addEventListener("click",()=>{let l=s.value.trim();l&&(n.onSend(l),s.value="",s.style.height="auto")}),x.appendChild(I),x.appendChild(m),i.appendChild(o),i.appendChild(p),i.appendChild(x),i.addEventListener("keydown",l=>{l.key==="Escape"&&n.onClose()}),{window:i,messagesContainer:p,input:s,sendButton:m}}function E(t,e){t.classList.toggle("open",e)}function te(t){return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function R(t){let e=r("div",{className:`ac-message ${t.role}`,"data-message-id":t.id}),n=r("div",{className:"ac-message-bubble"});n.innerHTML=W(t.content);let i=r("div",{className:"ac-message-time"},[te(t.timestamp)]);return e.appendChild(n),e.appendChild(i),e}function O(t,e){t.innerHTML="",e.forEach(n=>{let i=R(n);t.appendChild(i)})}function M(t,e){let n=R(e);t.appendChild(n)}function ne(){let t=r("div",{className:"ac-typing",role:"status","aria-label":"Assistant is typing"});for(let e=0;e<3;e++){let n=r("div",{className:"ac-typing-dot"});t.appendChild(n)}return t}function D(t){let e=ne();return t.appendChild(e),e}function T(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function z(t,e){let n=r("div",{className:"ac-greeting",role:"button","aria-label":"Open chat",tabindex:"0"}),i=r("p",{className:"ac-greeting-text"});i.innerHTML=C(t);let o=r("button",{className:"ac-greeting-close","aria-label":"Dismiss greeting"});return o.textContent="\xD7",o.addEventListener("click",a=>{a.stopPropagation(),e.onClose()}),n.addEventListener("click",()=>{e.onClick()}),n.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),e.onClick())}),n.appendChild(i),n.appendChild(o),n}function h(t){t&&t.parentNode&&t.parentNode.removeChild(t)}async function ie(t,e,n,i){let o={action:"sendMessage",sessionId:e,chatInput:n,...i&&{metadata:i}},a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!a.ok)throw new Error(`Request failed: ${a.status} ${a.statusText}`);let g=a.headers.get("content-type");if(g!=null&&g.includes("application/json")){let d=await a.json();if(typeof d.output=="string")return d.output;if(Array.isArray(d)){let p=d[0];if(p!=null&&p.output)return p.output}return JSON.stringify(d)}return a.text()}var S={maxRetries:2,baseDelay:1e3};async function $(t,e,n,i){let o=null;for(let a=0;a<=S.maxRetries;a++)try{return await ie(t,e,n,i)}catch(g){if(o=g instanceof Error?g:new Error(String(g)),o.message.includes("4"))throw o;a<S.maxRetries&&await new Promise(d=>setTimeout(d,S.baseDelay*(a+1)))}throw o||new Error("Failed to send message")}function G(){let t=Date.now().toString(36),e=Math.random().toString(36).substring(2,10);return`ac_${t}_${e}`}function f(){return`msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}`}var U="autocrew_";function L(t){return`${U}${t}`}function F(t){return`${U}visited_${t}`}function P(t){try{let e=localStorage.getItem(L(t));if(!e)return null;let n=JSON.parse(e);return Date.now()-n.createdAt>c.SESSION_MAX_AGE?(localStorage.removeItem(L(t)),null):n}catch(e){return null}}function j(t){try{localStorage.setItem(L(t.crewCode),JSON.stringify(t))}catch(e){console.warn("[AutoCrew] Unable to save session to localStorage")}}function Y(t){let e=P(t);if(e)return e;let n={sessionId:G(),crewCode:t,messages:[],createdAt:Date.now()};return j(n),n}function b(t,e){let n=P(t);if(!n)return;n.messages.push(e);let i=50;n.messages.length>i&&(n.messages=n.messages.slice(-i)),j(n)}function q(t){try{return!localStorage.getItem(F(t))}catch(e){return!0}}function V(t){try{localStorage.setItem(F(t),"true")}catch(e){}}var w=class{constructor(e){this.button=null;this.windowElements=null;this.greetingBubble=null;this.typingIndicator=null;var o,a;let n=e.metadata||{client_id:e.clientId,crew_code:e.crewCode,agent_name:e.agentName,environment:typeof window!="undefined"&&window.location.hostname==="localhost"?"development":"production"};this.config={webhookUrl:e.webhookUrl,crewCode:e.crewCode,clientId:e.clientId,metadata:n,agentName:e.agentName||((o=e.metadata)==null?void 0:o.agent_name)||"",primaryColor:e.primaryColor||c.PRIMARY_COLOR,position:e.position||c.POSITION,theme:e.theme||c.THEME,title:e.title||c.TITLE,subtitle:e.subtitle||c.SUBTITLE,welcomeMessage:e.welcomeMessage||c.WELCOME_MESSAGE,firstLaunchAction:e.firstLaunchAction||c.FIRST_LAUNCH_ACTION,greetingDelay:(a=e.greetingDelay)!=null?a:c.GREETING_DELAY};let i=Y(this.config.crewCode);this.state={isOpen:!1,isLoading:!1,messages:i.messages,sessionId:i.sessionId,error:null},this.container=document.createElement("div"),this.container.id="autocrew-widget",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.render(),this.attachToDOM(),this.handleFirstLaunch(),this.setupThemeListener()}injectStyles(){let e=document.createElement("style");e.textContent=v(this.config.primaryColor,this.config.theme,this.config.position),this.shadowRoot.appendChild(e)}render(){if(this.button=B({onToggle:()=>this.toggle()}),this.windowElements=_(this.config.title,this.config.subtitle,{onClose:()=>this.close(),onSend:e=>this.handleSendMessage(e)}),this.state.messages.length===0&&this.config.welcomeMessage){let e={id:f(),role:"assistant",content:this.config.welcomeMessage,timestamp:Date.now()};this.state.messages.push(e),b(this.config.crewCode,e)}O(this.windowElements.messagesContainer,this.state.messages),this.shadowRoot.appendChild(this.button),this.shadowRoot.appendChild(this.windowElements.window)}attachToDOM(){document.body.appendChild(this.container)}handleFirstLaunch(){if(q(this.config.crewCode))switch(V(this.config.crewCode),this.config.firstLaunchAction){case"auto-open":setTimeout(()=>this.open(),500);break;case"show-greeting":setTimeout(()=>this.showGreeting(),this.config.greetingDelay);break;case"none":default:break}}setupThemeListener(){if(this.config.theme!=="auto")return;window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateStyles()})}updateStyles(){let e=this.shadowRoot.querySelector("style");e&&(e.textContent=v(this.config.primaryColor,this.config.theme,this.config.position))}toggle(){this.state.isOpen?this.close():this.open()}open(){this.state.isOpen=!0,this.greetingBubble&&(h(this.greetingBubble),this.greetingBubble=null),this.button&&y(this.button,!0),this.windowElements&&(E(this.windowElements.window,!0),setTimeout(()=>{var e;(e=this.windowElements)==null||e.input.focus()},100),u(this.windowElements.messagesContainer))}close(){this.state.isOpen=!1,this.button&&(y(this.button,!1),this.button.focus()),this.windowElements&&E(this.windowElements.window,!1)}showGreeting(){this.state.isOpen||this.greetingBubble||(this.greetingBubble=z(this.config.welcomeMessage,{onClick:()=>{h(this.greetingBubble),this.greetingBubble=null,this.open()},onClose:()=>{h(this.greetingBubble),this.greetingBubble=null}}),this.shadowRoot.appendChild(this.greetingBubble))}async handleSendMessage(e){if(!e.trim()||this.state.isLoading)return;let n={id:f(),role:"user",content:e.trim(),timestamp:Date.now()};this.state.messages.push(n),b(this.config.crewCode,n),this.windowElements&&(M(this.windowElements.messagesContainer,n),u(this.windowElements.messagesContainer)),this.state.isLoading=!0,this.state.error=null,this.updateInputState(),this.windowElements&&(this.typingIndicator=D(this.windowElements.messagesContainer),u(this.windowElements.messagesContainer));try{let i=await $(this.config.webhookUrl,this.state.sessionId,e.trim(),this.config.metadata);T(this.typingIndicator),this.typingIndicator=null;let o={id:f(),role:"assistant",content:i,timestamp:Date.now()};this.state.messages.push(o),b(this.config.crewCode,o),this.windowElements&&(M(this.windowElements.messagesContainer,o),u(this.windowElements.messagesContainer))}catch(i){T(this.typingIndicator),this.typingIndicator=null,this.state.error=i instanceof Error?i.message:"Failed to send message",this.showError(this.state.error)}finally{this.state.isLoading=!1,this.updateInputState()}}updateInputState(){this.windowElements&&(this.windowElements.input.disabled=this.state.isLoading,this.windowElements.sendButton.disabled=this.state.isLoading)}showError(e){if(!this.windowElements)return;let n=document.createElement("div");n.className="ac-error",n.textContent=`Error: ${e}. Please try again.`,this.windowElements.messagesContainer.appendChild(n),u(this.windowElements.messagesContainer),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},5e3)}destroy(){this.container.parentNode&&this.container.parentNode.removeChild(this.container)}};function oe(t){if(!t||typeof t!="object")return!1;let e=t;return typeof e.webhookUrl!="string"||!e.webhookUrl?(console.error("[AutoCrew Widget] Missing required field: webhookUrl"),!1):typeof e.crewCode!="string"||!e.crewCode?(console.error("[AutoCrew Widget] Missing required field: crewCode"),!1):typeof e.clientId!="string"||!e.clientId?(console.error("[AutoCrew Widget] Missing required field: clientId"),!1):(e.primaryColor!==void 0&&typeof e.primaryColor!="string"&&console.warn("[AutoCrew Widget] Invalid primaryColor, using default"),e.position!==void 0&&!["bottom-right","bottom-left"].includes(e.position)&&console.warn("[AutoCrew Widget] Invalid position, using default"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme)&&console.warn("[AutoCrew Widget] Invalid theme, using default"),e.firstLaunchAction!==void 0&&!["none","auto-open","show-greeting"].includes(e.firstLaunchAction)&&console.warn("[AutoCrew Widget] Invalid firstLaunchAction, using default"),!0)}function ae(t){return new w(t)}(function(){if(window.__autocrewWidgetInitialized){console.warn("[AutoCrew Widget] Already initialized");return}let t=window.AutoCrewConfig;if(!t){console.error("[AutoCrew Widget] No configuration found. Please set window.AutoCrewConfig before loading the widget.");return}if(!oe(t)){console.error("[AutoCrew Widget] Invalid configuration. Widget not loaded.");return}let e=()=>{try{ae(t),window.__autocrewWidgetInitialized=!0,console.log("[AutoCrew Widget] Initialized successfully")}catch(n){console.error("[AutoCrew Widget] Failed to initialize:",n)}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()})();})();
