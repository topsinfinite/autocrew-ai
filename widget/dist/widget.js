/* AutoCrew Chat Widget v1.0.0 - https://autocrew.ai */
"use strict";(()=>{var c={PRIMARY_COLOR:"#0891b2",POSITION:"bottom-right",THEME:"auto",TITLE:"Chat with us",SUBTITLE:"",WELCOME_MESSAGE:"Hi! How can I help you today?",FIRST_LAUNCH_ACTION:"none",GREETING_DELAY:3e3,SUGGESTED_ACTIONS:[],DISCLAIMER:"",SESSION_MAX_AGE:144e5,MESSAGE_DEBOUNCE:500};function te(t){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function ne(t,e,n){return"#"+[t,e,n].map(i=>{let s=Math.max(0,Math.min(255,Math.round(i))).toString(16);return s.length===1?"0"+s:s}).join("")}function R(t,e){let n=te(t);if(!n)return t;let i=1-e/100;return ne(n.r*i,n.g*i,n.b*i)}function ie(t){return t!=="auto"?t:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function D(t,e){let n=ie(e),i=R(t,10);return n==="dark"?`
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
  `}function y(t,e,n){let i=D(t,e),s=n==="bottom-left"?"left: 20px;":"right: 20px;";return`
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
      ${s}
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
      ${s}
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

    .ac-header-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ac-new-chat-btn,
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

    .ac-new-chat-btn:hover,
    .ac-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .ac-new-chat-btn svg,
    .ac-close-btn svg {
      width: 20px;
      height: 20px;
      fill: var(--ac-primary-text);
    }

    .ac-new-chat-btn svg {
      width: 18px;
      height: 18px;
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

    /* Actions Wrapper */
    .ac-actions-wrapper {
      flex-shrink: 0;
    }

    /* Suggested Actions */
    .ac-suggested-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 16px;
      background: var(--ac-bg-secondary);
      border-top: 1px solid var(--ac-border);
    }

    .ac-action-btn {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid var(--ac-border);
      background: var(--ac-bg);
      color: var(--ac-text);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .ac-action-btn:hover {
      border-color: var(--ac-primary);
      color: var(--ac-primary);
      background: var(--ac-bg);
    }

    .ac-action-btn:focus {
      outline: 2px solid var(--ac-primary);
      outline-offset: 2px;
    }

    .ac-action-btn:active {
      transform: scale(0.98);
    }

    /* Disclaimer */
    .ac-disclaimer {
      padding: 8px 16px;
      background: var(--ac-bg-secondary);
      text-align: center;
      flex-shrink: 0;
    }

    .ac-disclaimer:empty {
      display: none;
    }

    .ac-disclaimer p {
      font-size: 11px;
      line-height: 1.4;
      color: var(--ac-text-muted);
      margin: 0;
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
      ${s}
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
  `}function a(t,e,n){let i=document.createElement(t);return e&&Object.entries(e).forEach(([s,o])=>{s==="className"?i.className=o:(s.startsWith("data-"),i.setAttribute(s,o))}),n&&n.forEach(s=>{typeof s=="string"?i.appendChild(document.createTextNode(s)):i.appendChild(s)}),i}function E(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function z(t){return E(t).replace(/\n/g,"<br>")}function u(t){t.scrollTop=t.scrollHeight}var G=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
  </svg>
`,se=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`;function $(t){let e=a("button",{className:"ac-button","aria-label":"Open chat","aria-expanded":"false"});return e.innerHTML=G,e.addEventListener("click",()=>{t.onToggle()}),e}function S(t,e){t.innerHTML=e?se:G,t.setAttribute("aria-expanded",String(e)),t.setAttribute("aria-label",e?"Close chat":"Open chat"),t.classList.toggle("open",e)}var ae=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`,oe=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
`,re=`
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
`;function U(t,e,n){let i=a("div",{className:"ac-window"}),s=a("div",{className:"ac-header"}),o=a("div",{className:"ac-header-content"}),g=a("h2",{className:"ac-header-title"},[t]);if(o.appendChild(g),e){let l=a("p",{className:"ac-header-subtitle"},[e]);o.appendChild(l)}let d=a("div",{className:"ac-header-buttons"}),p=a("button",{className:"ac-new-chat-btn","aria-label":"Start new chat",title:"Start new chat"});p.innerHTML=re,p.addEventListener("click",n.onNewChat);let v=a("button",{className:"ac-close-btn","aria-label":"Close chat"});v.innerHTML=ae,v.addEventListener("click",n.onClose),d.appendChild(p),d.appendChild(v),s.appendChild(o),s.appendChild(d);let H=a("div",{className:"ac-messages",role:"log","aria-live":"polite","aria-label":"Chat messages"}),W=a("div",{className:"ac-actions-wrapper"}),B=a("div",{className:"ac-disclaimer"}),C=a("div",{className:"ac-input-area"}),_=a("div",{className:"ac-input-wrapper"}),r=document.createElement("textarea");r.className="ac-input",r.placeholder="Type a message...",r.rows=1,r.setAttribute("aria-label","Message input"),r.addEventListener("input",()=>{r.style.height="auto",r.style.height=Math.min(r.scrollHeight,100)+"px"}),r.addEventListener("keydown",l=>{if(l.key==="Enter"&&!l.shiftKey){l.preventDefault();let O=r.value.trim();O&&(n.onSend(O),r.value="",r.style.height="auto")}}),_.appendChild(r);let f=a("button",{className:"ac-send-btn","aria-label":"Send message"});return f.innerHTML=oe,f.addEventListener("click",()=>{let l=r.value.trim();l&&(n.onSend(l),r.value="",r.style.height="auto")}),C.appendChild(_),C.appendChild(f),i.appendChild(s),i.appendChild(H),i.appendChild(W),i.appendChild(B),i.appendChild(C),i.addEventListener("keydown",l=>{l.key==="Escape"&&n.onClose()}),{window:i,messagesContainer:H,actionsContainer:W,disclaimerContainer:B,input:r,sendButton:f}}function M(t,e){t.classList.toggle("open",e)}function ce(t){return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function F(t){let e=a("div",{className:`ac-message ${t.role}`,"data-message-id":t.id}),n=a("div",{className:"ac-message-bubble"});n.innerHTML=z(t.content);let i=a("div",{className:"ac-message-time"},[ce(t.timestamp)]);return e.appendChild(n),e.appendChild(i),e}function A(t,e){t.innerHTML="",e.forEach(n=>{let i=F(n);t.appendChild(i)})}function T(t,e){let n=F(e);t.appendChild(n)}function de(){let t=a("div",{className:"ac-typing",role:"status","aria-label":"Assistant is typing"});for(let e=0;e<3;e++){let n=a("div",{className:"ac-typing-dot"});t.appendChild(n)}return t}function P(t){let e=de();return t.appendChild(e),e}function L(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function j(t,e){let n=a("div",{className:"ac-greeting",role:"button","aria-label":"Open chat",tabindex:"0"}),i=a("p",{className:"ac-greeting-text"});i.innerHTML=E(t);let s=a("button",{className:"ac-greeting-close","aria-label":"Dismiss greeting"});return s.textContent="\xD7",s.addEventListener("click",o=>{o.stopPropagation(),e.onClose()}),n.addEventListener("click",()=>{e.onClick()}),n.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),e.onClick())}),n.appendChild(i),n.appendChild(s),n}function b(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function I(t,e){let n=a("div",{className:"ac-suggested-actions",role:"group","aria-label":"Suggested actions"});return t.forEach(i=>{let s=a("button",{className:"ac-action-btn",type:"button"},[i.label]);s.addEventListener("click",()=>{e.onActionClick(i)}),n.appendChild(s)}),{container:n,hide:()=>{n.style.display="none"},show:()=>{n.style.display="flex"}}}async function le(t,e,n,i){let s={action:"sendMessage",sessionId:e,chatInput:n,...i&&{metadata:i}},o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!o.ok)throw new Error(`Request failed: ${o.status} ${o.statusText}`);let g=o.headers.get("content-type");if(g!=null&&g.includes("application/json")){let d=await o.json();if(typeof d.output=="string")return d.output;if(Array.isArray(d)){let p=d[0];if(p!=null&&p.output)return p.output}return JSON.stringify(d)}return o.text()}var k={maxRetries:2,baseDelay:1e3};async function V(t,e,n,i){let s=null;for(let o=0;o<=k.maxRetries;o++)try{return await le(t,e,n,i)}catch(g){if(s=g instanceof Error?g:new Error(String(g)),s.message.includes("4"))throw s;o<k.maxRetries&&await new Promise(d=>setTimeout(d,k.baseDelay*(o+1)))}throw s||new Error("Failed to send message")}function Y(){let t=Date.now().toString(36),e=Math.random().toString(36).substring(2,10);return`ac_${t}_${e}`}function h(){return`msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}`}var q="autocrew_";function w(t){return`${q}${t}`}function K(t){return`${q}visited_${t}`}function J(t){try{let e=localStorage.getItem(w(t));if(!e)return null;let n=JSON.parse(e);return Date.now()-n.createdAt>c.SESSION_MAX_AGE?(localStorage.removeItem(w(t)),null):n}catch(e){return null}}function X(t){try{localStorage.setItem(w(t.crewCode),JSON.stringify(t))}catch(e){console.warn("[AutoCrew] Unable to save session to localStorage")}}function N(t){let e=J(t);if(e)return e;let n={sessionId:Y(),crewCode:t,messages:[],createdAt:Date.now()};return X(n),n}function m(t,e){let n=J(t);if(!n)return;n.messages.push(e);let i=50;n.messages.length>i&&(n.messages=n.messages.slice(-i)),X(n)}function Q(t){try{localStorage.removeItem(w(t))}catch(e){}}function Z(t){try{return!localStorage.getItem(K(t))}catch(e){return!0}}function ee(t){try{localStorage.setItem(K(t),"true")}catch(e){}}var x=class{constructor(e){this.button=null;this.windowElements=null;this.greetingBubble=null;this.typingIndicator=null;this.suggestedActionsEl=null;this.hasInteracted=!1;var s,o;let n=e.metadata||{client_id:e.clientId,crew_code:e.crewCode,agent_name:e.agentName,environment:typeof window!="undefined"&&window.location.hostname==="localhost"?"development":"production"};this.config={webhookUrl:e.webhookUrl,crewCode:e.crewCode,clientId:e.clientId,metadata:n,agentName:e.agentName||((s=e.metadata)==null?void 0:s.agent_name)||"",primaryColor:e.primaryColor||c.PRIMARY_COLOR,position:e.position||c.POSITION,theme:e.theme||c.THEME,title:e.title||c.TITLE,subtitle:e.subtitle||c.SUBTITLE,welcomeMessage:e.welcomeMessage||c.WELCOME_MESSAGE,firstLaunchAction:e.firstLaunchAction||c.FIRST_LAUNCH_ACTION,greetingDelay:(o=e.greetingDelay)!=null?o:c.GREETING_DELAY,suggestedActions:e.suggestedActions||c.SUGGESTED_ACTIONS,disclaimer:e.disclaimer||c.DISCLAIMER};let i=N(this.config.crewCode);this.state={isOpen:!1,isLoading:!1,messages:i.messages,sessionId:i.sessionId,error:null},this.container=document.createElement("div"),this.container.id="autocrew-widget",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.render(),this.attachToDOM(),this.handleFirstLaunch(),this.setupThemeListener()}injectStyles(){let e=document.createElement("style");e.textContent=y(this.config.primaryColor,this.config.theme,this.config.position),this.shadowRoot.appendChild(e)}render(){if(this.button=$({onToggle:()=>this.toggle()}),this.windowElements=U(this.config.title,this.config.subtitle,{onClose:()=>this.close(),onSend:e=>this.handleSendMessage(e),onNewChat:()=>this.handleNewChat()}),this.state.messages.length===0&&this.config.welcomeMessage){let e={id:h(),role:"assistant",content:this.config.welcomeMessage,timestamp:Date.now()};this.state.messages.push(e),m(this.config.crewCode,e)}if(A(this.windowElements.messagesContainer,this.state.messages),this.config.suggestedActions.length>0&&!this.hasInteracted&&(this.suggestedActionsEl=I(this.config.suggestedActions,{onActionClick:e=>this.handleActionClick(e)}),this.windowElements.actionsContainer.appendChild(this.suggestedActionsEl.container)),this.config.disclaimer){let e=document.createElement("p");e.textContent=this.config.disclaimer,this.windowElements.disclaimerContainer.appendChild(e)}this.shadowRoot.appendChild(this.button),this.shadowRoot.appendChild(this.windowElements.window)}attachToDOM(){document.body.appendChild(this.container)}handleFirstLaunch(){if(Z(this.config.crewCode))switch(ee(this.config.crewCode),this.config.firstLaunchAction){case"auto-open":setTimeout(()=>this.open(),500);break;case"show-greeting":setTimeout(()=>this.showGreeting(),this.config.greetingDelay);break;case"none":default:break}}setupThemeListener(){if(this.config.theme!=="auto")return;window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateStyles()})}updateStyles(){let e=this.shadowRoot.querySelector("style");e&&(e.textContent=y(this.config.primaryColor,this.config.theme,this.config.position))}toggle(){this.state.isOpen?this.close():this.open()}open(){this.state.isOpen=!0,this.greetingBubble&&(b(this.greetingBubble),this.greetingBubble=null),this.button&&S(this.button,!0),this.windowElements&&(M(this.windowElements.window,!0),setTimeout(()=>{var e;(e=this.windowElements)==null||e.input.focus()},100),u(this.windowElements.messagesContainer))}close(){this.state.isOpen=!1,this.button&&(S(this.button,!1),this.button.focus()),this.windowElements&&M(this.windowElements.window,!1)}showGreeting(){this.state.isOpen||this.greetingBubble||(this.greetingBubble=j(this.config.welcomeMessage,{onClick:()=>{b(this.greetingBubble),this.greetingBubble=null,this.open()},onClose:()=>{b(this.greetingBubble),this.greetingBubble=null}}),this.shadowRoot.appendChild(this.greetingBubble))}handleActionClick(e){this.hideSuggestedActions(),this.handleSendMessage(e.message)}hideSuggestedActions(){this.suggestedActionsEl&&(this.suggestedActionsEl.hide(),this.hasInteracted=!0)}handleNewChat(){if(Q(this.config.crewCode),this.state.messages=[],this.state.sessionId=N(this.config.crewCode).sessionId,this.hasInteracted=!1,this.config.welcomeMessage){let e={id:h(),role:"assistant",content:this.config.welcomeMessage,timestamp:Date.now()};this.state.messages.push(e),m(this.config.crewCode,e)}this.windowElements&&(this.windowElements.messagesContainer.innerHTML="",A(this.windowElements.messagesContainer,this.state.messages),this.windowElements.actionsContainer.innerHTML="",this.config.suggestedActions.length>0&&(this.suggestedActionsEl=I(this.config.suggestedActions,{onActionClick:e=>this.handleActionClick(e)}),this.windowElements.actionsContainer.appendChild(this.suggestedActionsEl.container)),this.windowElements.messagesContainer.scrollTop=0)}async handleSendMessage(e){if(!e.trim()||this.state.isLoading)return;this.hideSuggestedActions();let n={id:h(),role:"user",content:e.trim(),timestamp:Date.now()};this.state.messages.push(n),m(this.config.crewCode,n),this.windowElements&&(T(this.windowElements.messagesContainer,n),u(this.windowElements.messagesContainer)),this.state.isLoading=!0,this.state.error=null,this.updateInputState(),this.windowElements&&(this.typingIndicator=P(this.windowElements.messagesContainer),u(this.windowElements.messagesContainer));try{let i=await V(this.config.webhookUrl,this.state.sessionId,e.trim(),this.config.metadata);L(this.typingIndicator),this.typingIndicator=null;let s={id:h(),role:"assistant",content:i,timestamp:Date.now()};this.state.messages.push(s),m(this.config.crewCode,s),this.windowElements&&(T(this.windowElements.messagesContainer,s),u(this.windowElements.messagesContainer))}catch(i){L(this.typingIndicator),this.typingIndicator=null,this.state.error=i instanceof Error?i.message:"Failed to send message",this.showError(this.state.error)}finally{this.state.isLoading=!1,this.updateInputState()}}updateInputState(){this.windowElements&&(this.windowElements.input.disabled=this.state.isLoading,this.windowElements.sendButton.disabled=this.state.isLoading)}showError(e){if(!this.windowElements)return;let n=document.createElement("div");n.className="ac-error",n.textContent=`Error: ${e}. Please try again.`,this.windowElements.messagesContainer.appendChild(n),u(this.windowElements.messagesContainer),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},5e3)}destroy(){this.container.parentNode&&this.container.parentNode.removeChild(this.container)}};function ge(t){if(!t||typeof t!="object")return!1;let e=t;return typeof e.webhookUrl!="string"||!e.webhookUrl?(console.error("[AutoCrew Widget] Missing required field: webhookUrl"),!1):typeof e.crewCode!="string"||!e.crewCode?(console.error("[AutoCrew Widget] Missing required field: crewCode"),!1):typeof e.clientId!="string"||!e.clientId?(console.error("[AutoCrew Widget] Missing required field: clientId"),!1):(e.primaryColor!==void 0&&typeof e.primaryColor!="string"&&console.warn("[AutoCrew Widget] Invalid primaryColor, using default"),e.position!==void 0&&!["bottom-right","bottom-left"].includes(e.position)&&console.warn("[AutoCrew Widget] Invalid position, using default"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme)&&console.warn("[AutoCrew Widget] Invalid theme, using default"),e.firstLaunchAction!==void 0&&!["none","auto-open","show-greeting"].includes(e.firstLaunchAction)&&console.warn("[AutoCrew Widget] Invalid firstLaunchAction, using default"),!0)}function pe(t){return new x(t)}(function(){if(window.__autocrewWidgetInitialized){console.warn("[AutoCrew Widget] Already initialized");return}let t=window.AutoCrewConfig;if(!t){console.error("[AutoCrew Widget] No configuration found. Please set window.AutoCrewConfig before loading the widget.");return}if(!ge(t)){console.error("[AutoCrew Widget] Invalid configuration. Widget not loaded.");return}let e=()=>{try{pe(t),window.__autocrewWidgetInitialized=!0,console.log("[AutoCrew Widget] Initialized successfully")}catch(n){console.error("[AutoCrew Widget] Failed to initialize:",n)}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()})();})();
