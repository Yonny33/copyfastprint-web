const aa=()=>{};var Mr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps=function(i){const e=[];let t=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},ca=function(i){const e=[];let t=0,r=0;for(;t<i.length;){const o=i[t++];if(o<128)e[r++]=String.fromCharCode(o);else if(o>191&&o<224){const c=i[t++];e[r++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=i[t++],h=i[t++],y=i[t++],E=((o&7)<<18|(c&63)<<12|(h&63)<<6|y&63)-65536;e[r++]=String.fromCharCode(55296+(E>>10)),e[r++]=String.fromCharCode(56320+(E&1023))}else{const c=i[t++],h=i[t++];e[r++]=String.fromCharCode((o&15)<<12|(c&63)<<6|h&63)}}return e.join("")},Rs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const c=i[o],h=o+1<i.length,y=h?i[o+1]:0,E=o+2<i.length,v=E?i[o+2]:0,b=c>>2,S=(c&3)<<4|y>>4;let D=(y&15)<<2|v>>6,H=v&63;E||(H=64,h||(D=64)),r.push(t[b],t[S],t[D],t[H])}return r.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(Ps(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):ca(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const c=t[i.charAt(o++)],y=o<i.length?t[i.charAt(o)]:0;++o;const v=o<i.length?t[i.charAt(o)]:64;++o;const S=o<i.length?t[i.charAt(o)]:64;if(++o,c==null||y==null||v==null||S==null)throw new ha;const D=c<<2|y>>4;if(r.push(D),v!==64){const H=y<<4&240|v>>2;if(r.push(H),S!==64){const x=v<<6&192|S;r.push(x)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class ha extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const la=function(i){const e=Ps(i);return Rs.encodeByteArray(e,!0)},pn=function(i){return la(i).replace(/\./g,"")},Cs=function(i){try{return Rs.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ua(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const da=()=>ua().__FIREBASE_DEFAULTS__,fa=()=>{if(typeof process>"u"||typeof Mr>"u")return;const i=Mr.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},pa=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&Cs(i[1]);return e&&JSON.parse(e)},Ii=()=>{try{return aa()||da()||fa()||pa()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},ks=i=>{var e,t;return(t=(e=Ii())==null?void 0:e.emulatorHosts)==null?void 0:t[i]},ga=i=>{const e=ks(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Os=()=>{var i;return(i=Ii())==null?void 0:i.config},Ns=i=>{var e;return(e=Ii())==null?void 0:e[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",o=i.iat||0,c=i.sub||i.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}},...i};return[pn(JSON.stringify(t)),pn(JSON.stringify(h)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ya(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(q())}function Ia(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function wa(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Ea(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function va(){const i=q();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Ta(){try{return typeof indexedDB=="object"}catch{return!1}}function Sa(){return new Promise((i,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var c;e(((c=o.error)==null?void 0:c.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aa="FirebaseError";class me extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Aa,Object.setPrototypeOf(this,me.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,jt.prototype.create)}}class jt{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},o=`${this.service}/${e}`,c=this.errors[e],h=c?ba(c,r):"Error",y=`${this.serviceName}: ${h} (${o}).`;return new me(o,y,r)}}function ba(i,e){return i.replace(Pa,(t,r)=>{const o=e[r];return o!=null?String(o):`<${r}?>`})}const Pa=/\{\$([^}]+)}/g;function Ra(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function qe(i,e){if(i===e)return!0;const t=Object.keys(i),r=Object.keys(e);for(const o of t){if(!r.includes(o))return!1;const c=i[o],h=e[o];if(Ur(c)&&Ur(h)){if(!qe(c,h))return!1}else if(c!==h)return!1}for(const o of r)if(!t.includes(o))return!1;return!0}function Ur(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(i){const e=[];for(const[t,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function kt(i){const e={};return i.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[o,c]=r.split("=");e[decodeURIComponent(o)]=decodeURIComponent(c)}}),e}function Ot(i){const e=i.indexOf("?");if(!e)return"";const t=i.indexOf("#",e);return i.substring(e,t>0?t:void 0)}function Ca(i,e){const t=new ka(i,e);return t.subscribe.bind(t)}class ka{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let o;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Oa(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:r},o.next===void 0&&(o.next=ei),o.error===void 0&&(o.error=ei),o.complete===void 0&&(o.complete=ei);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Oa(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function ei(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(i){return i&&i._delegate?i._delegate:i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ds(i){return(await fetch(i,{credentials:"include"})).ok}class Ke{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new ma;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(La(e))try{this.getOrInitializeService({instanceIdentifier:He})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:o});r.resolve(c)}catch{}}}}clearInstance(e=He){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=He){return this.instances.has(e)}getOptions(e=He){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[c,h]of this.instancesDeferred.entries()){const y=this.normalizeInstanceIdentifier(c);r===y&&h.resolve(o)}return o}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(r)??new Set;o.add(e),this.onInitCallbacks.set(r,o);const c=this.instances.get(r);return c&&e(c,r),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const o of r)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Da(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=He){return this.component?this.component.multipleInstances?e:He:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Da(i){return i===He?void 0:i}function La(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ma{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Na(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(O||(O={}));const Ua={debug:O.DEBUG,verbose:O.VERBOSE,info:O.INFO,warn:O.WARN,error:O.ERROR,silent:O.SILENT},xa=O.INFO,Fa={[O.DEBUG]:"log",[O.VERBOSE]:"log",[O.INFO]:"info",[O.WARN]:"warn",[O.ERROR]:"error"},Va=(i,e,...t)=>{if(e<i.logLevel)return;const r=new Date().toISOString(),o=Fa[e];if(o)console[o](`[${r}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class wi{constructor(e){this.name=e,this._logLevel=xa,this._logHandler=Va,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in O))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ua[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,O.DEBUG,...e),this._logHandler(this,O.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,O.VERBOSE,...e),this._logHandler(this,O.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,O.INFO,...e),this._logHandler(this,O.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,O.WARN,...e),this._logHandler(this,O.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,O.ERROR,...e),this._logHandler(this,O.ERROR,...e)}}const ja=(i,e)=>e.some(t=>i instanceof t);let xr,Fr;function Ba(){return xr||(xr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ha(){return Fr||(Fr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ls=new WeakMap,hi=new WeakMap,Ms=new WeakMap,ti=new WeakMap,Ei=new WeakMap;function $a(i){const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("success",c),i.removeEventListener("error",h)},c=()=>{t(Oe(i.result)),o()},h=()=>{r(i.error),o()};i.addEventListener("success",c),i.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&Ls.set(t,i)}).catch(()=>{}),Ei.set(e,i),e}function Wa(i){if(hi.has(i))return;const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("complete",c),i.removeEventListener("error",h),i.removeEventListener("abort",h)},c=()=>{t(),o()},h=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",c),i.addEventListener("error",h),i.addEventListener("abort",h)});hi.set(i,e)}let li={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return hi.get(i);if(e==="objectStoreNames")return i.objectStoreNames||Ms.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Oe(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function Ga(i){li=i(li)}function za(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=i.call(ni(this),e,...t);return Ms.set(r,e.sort?e.sort():[e]),Oe(r)}:Ha().includes(i)?function(...e){return i.apply(ni(this),e),Oe(Ls.get(this))}:function(...e){return Oe(i.apply(ni(this),e))}}function qa(i){return typeof i=="function"?za(i):(i instanceof IDBTransaction&&Wa(i),ja(i,Ba())?new Proxy(i,li):i)}function Oe(i){if(i instanceof IDBRequest)return $a(i);if(ti.has(i))return ti.get(i);const e=qa(i);return e!==i&&(ti.set(i,e),Ei.set(e,i)),e}const ni=i=>Ei.get(i);function Ka(i,e,{blocked:t,upgrade:r,blocking:o,terminated:c}={}){const h=indexedDB.open(i,e),y=Oe(h);return r&&h.addEventListener("upgradeneeded",E=>{r(Oe(h.result),E.oldVersion,E.newVersion,Oe(h.transaction),E)}),t&&h.addEventListener("blocked",E=>t(E.oldVersion,E.newVersion,E)),y.then(E=>{c&&E.addEventListener("close",()=>c()),o&&E.addEventListener("versionchange",v=>o(v.oldVersion,v.newVersion,v))}).catch(()=>{}),y}const Ja=["get","getKey","getAll","getAllKeys","count"],Xa=["put","add","delete","clear"],ii=new Map;function Vr(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(ii.get(e))return ii.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,o=Xa.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(o||Ja.includes(t)))return;const c=async function(h,...y){const E=this.transaction(h,o?"readwrite":"readonly");let v=E.store;return r&&(v=v.index(y.shift())),(await Promise.all([v[t](...y),o&&E.done]))[0]};return ii.set(e,c),c}Ga(i=>({...i,get:(e,t,r)=>Vr(e,t)||i.get(e,t,r),has:(e,t)=>!!Vr(e,t)||i.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Qa(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Qa(i){const e=i.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ui="@firebase/app",jr="0.14.10";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pe=new wi("@firebase/app"),Za="@firebase/app-compat",ec="@firebase/analytics-compat",tc="@firebase/analytics",nc="@firebase/app-check-compat",ic="@firebase/app-check",rc="@firebase/auth",sc="@firebase/auth-compat",oc="@firebase/database",ac="@firebase/data-connect",cc="@firebase/database-compat",hc="@firebase/functions",lc="@firebase/functions-compat",uc="@firebase/installations",dc="@firebase/installations-compat",fc="@firebase/messaging",pc="@firebase/messaging-compat",gc="@firebase/performance",mc="@firebase/performance-compat",_c="@firebase/remote-config",yc="@firebase/remote-config-compat",Ic="@firebase/storage",wc="@firebase/storage-compat",Ec="@firebase/firestore",vc="@firebase/ai",Tc="@firebase/firestore-compat",Sc="firebase",Ac="12.11.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const di="[DEFAULT]",bc={[ui]:"fire-core",[Za]:"fire-core-compat",[tc]:"fire-analytics",[ec]:"fire-analytics-compat",[ic]:"fire-app-check",[nc]:"fire-app-check-compat",[rc]:"fire-auth",[sc]:"fire-auth-compat",[oc]:"fire-rtdb",[ac]:"fire-data-connect",[cc]:"fire-rtdb-compat",[hc]:"fire-fn",[lc]:"fire-fn-compat",[uc]:"fire-iid",[dc]:"fire-iid-compat",[fc]:"fire-fcm",[pc]:"fire-fcm-compat",[gc]:"fire-perf",[mc]:"fire-perf-compat",[_c]:"fire-rc",[yc]:"fire-rc-compat",[Ic]:"fire-gcs",[wc]:"fire-gcs-compat",[Ec]:"fire-fst",[Tc]:"fire-fst-compat",[vc]:"fire-vertex","fire-js":"fire-js",[Sc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gn=new Map,Pc=new Map,fi=new Map;function Br(i,e){try{i.container.addComponent(e)}catch(t){pe.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function ct(i){const e=i.name;if(fi.has(e))return pe.debug(`There were multiple attempts to register component ${e}.`),!1;fi.set(e,i);for(const t of gn.values())Br(t,i);for(const t of Pc.values())Br(t,i);return!0}function vi(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function Q(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ne=new jt("app","Firebase",Rc);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ke("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ne.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ut=Ac;function kc(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const r={name:di,automaticDataCollectionEnabled:!0,...e},o=r.name;if(typeof o!="string"||!o)throw Ne.create("bad-app-name",{appName:String(o)});if(t||(t=Os()),!t)throw Ne.create("no-options");const c=gn.get(o);if(c){if(qe(t,c.options)&&qe(r,c.config))return c;throw Ne.create("duplicate-app",{appName:o})}const h=new Ma(o);for(const E of fi.values())h.addComponent(E);const y=new Cc(t,r,h);return gn.set(o,y),y}function Us(i=di){const e=gn.get(i);if(!e&&i===di&&Os())return kc();if(!e)throw Ne.create("no-app",{appName:i});return e}function De(i,e,t){let r=bc[i]??i;t&&(r+=`-${t}`);const o=r.match(/\s|\//),c=e.match(/\s|\//);if(o||c){const h=[`Unable to register library "${r}" with version "${e}":`];o&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),o&&c&&h.push("and"),c&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),pe.warn(h.join(" "));return}ct(new Ke(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oc="firebase-heartbeat-database",Nc=1,Ut="firebase-heartbeat-store";let ri=null;function xs(){return ri||(ri=Ka(Oc,Nc,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(Ut)}catch(t){console.warn(t)}}}}).catch(i=>{throw Ne.create("idb-open",{originalErrorMessage:i.message})})),ri}async function Dc(i){try{const t=(await xs()).transaction(Ut),r=await t.objectStore(Ut).get(Fs(i));return await t.done,r}catch(e){if(e instanceof me)pe.warn(e.message);else{const t=Ne.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});pe.warn(t.message)}}}async function Hr(i,e){try{const r=(await xs()).transaction(Ut,"readwrite");await r.objectStore(Ut).put(e,Fs(i)),await r.done}catch(t){if(t instanceof me)pe.warn(t.message);else{const r=Ne.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});pe.warn(r.message)}}}function Fs(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc=1024,Mc=30;class Uc{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Fc(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=$r();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(h=>h.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:o}),this._heartbeatsCache.heartbeats.length>Mc){const h=Vc(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){pe.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=$r(),{heartbeatsToSend:r,unsentEntries:o}=xc(this._heartbeatsCache.heartbeats),c=pn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(t){return pe.warn(t),""}}}function $r(){return new Date().toISOString().substring(0,10)}function xc(i,e=Lc){const t=[];let r=i.slice();for(const o of i){const c=t.find(h=>h.agent===o.agent);if(c){if(c.dates.push(o.date),Wr(t)>e){c.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),Wr(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Fc{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ta()?Sa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Dc(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Hr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Hr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Wr(i){return pn(JSON.stringify({version:2,heartbeats:i})).length}function Vc(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let r=1;r<i.length;r++)i[r].date<t&&(t=i[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(i){ct(new Ke("platform-logger",e=>new Ya(e),"PRIVATE")),ct(new Ke("heartbeat",e=>new Uc(e),"PRIVATE")),De(ui,jr,i),De(ui,jr,"esm2020"),De("fire-js","")}jc("");var Bc="firebase",Hc="12.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */De(Bc,Hc,"app");function Vs(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const $c=Vs,js=new jt("auth","Firebase",Vs());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mn=new wi("@firebase/auth");function Wc(i,...e){mn.logLevel<=O.WARN&&mn.warn(`Auth (${ut}): ${i}`,...e)}function hn(i,...e){mn.logLevel<=O.ERROR&&mn.error(`Auth (${ut}): ${i}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function te(i,...e){throw Ti(i,...e)}function he(i,...e){return Ti(i,...e)}function Bs(i,e,t){const r={...$c(),[e]:t};return new jt("auth","Firebase",r).create(e,{appName:i.name})}function Le(i){return Bs(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ti(i,...e){if(typeof i!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(t,...r)}return js.create(i,...e)}function A(i,e,...t){if(!i)throw Ti(e,...t)}function de(i){const e="INTERNAL ASSERTION FAILED: "+i;throw hn(e),new Error(e)}function ge(i,e){i||de(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pi(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.href)||""}function Gc(){return Gr()==="http:"||Gr()==="https:"}function Gr(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Gc()||wa()||"connection"in navigator)?navigator.onLine:!0}function qc(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t){this.shortDelay=e,this.longDelay=t,ge(t>e,"Short delay should be less than long delay!"),this.isMobile=ya()||Ea()}get(){return zc()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Si(i,e){ge(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;de("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;de("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;de("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kc={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Xc=new Ht(3e4,6e4);function Ye(i,e){return i.tenantId&&!e.tenantId?{...e,tenantId:i.tenantId}:e}async function Ue(i,e,t,r,o={}){return $s(i,o,async()=>{let c={},h={};r&&(e==="GET"?h=r:c={body:JSON.stringify(r)});const y=Bt({key:i.config.apiKey,...h}).slice(1),E=await i._getAdditionalHeaders();E["Content-Type"]="application/json",i.languageCode&&(E["X-Firebase-Locale"]=i.languageCode);const v={method:e,headers:E,...c};return Ia()||(v.referrerPolicy="no-referrer"),i.emulatorConfig&&Tn(i.emulatorConfig.host)&&(v.credentials="include"),Hs.fetch()(await Ws(i,i.config.apiHost,t,y),v)})}async function $s(i,e,t){i._canInitEmulator=!1;const r={...Kc,...e};try{const o=new Qc(i),c=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await c.json();if("needConfirmation"in h)throw on(i,"account-exists-with-different-credential",h);if(c.ok&&!("errorMessage"in h))return h;{const y=c.ok?h.errorMessage:h.error.message,[E,v]=y.split(" : ");if(E==="FEDERATED_USER_ID_ALREADY_LINKED")throw on(i,"credential-already-in-use",h);if(E==="EMAIL_EXISTS")throw on(i,"email-already-in-use",h);if(E==="USER_DISABLED")throw on(i,"user-disabled",h);const b=r[E]||E.toLowerCase().replace(/[_\s]+/g,"-");if(v)throw Bs(i,b,v);te(i,b)}}catch(o){if(o instanceof me)throw o;te(i,"network-request-failed",{message:String(o)})}}async function Sn(i,e,t,r,o={}){const c=await Ue(i,e,t,r,o);return"mfaPendingCredential"in c&&te(i,"multi-factor-auth-required",{_serverResponse:c}),c}async function Ws(i,e,t,r){const o=`${e}${t}?${r}`,c=i,h=c.config.emulator?Si(i.config,o):`${i.config.apiScheme}://${o}`;return Jc.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(h).toString():h}function Yc(i){switch(i){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Qc{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(he(this.auth,"network-request-failed")),Xc.get())})}}function on(i,e,t){const r={appName:i.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const o=he(i,e,r);return o.customData._tokenResponse=t,o}function zr(i){return i!==void 0&&i.enterprise!==void 0}class Zc{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Yc(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function eh(i,e){return Ue(i,"GET","/v2/recaptchaConfig",Ye(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function th(i,e){return Ue(i,"POST","/v1/accounts:delete",e)}async function _n(i,e){return Ue(i,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nt(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function nh(i,e=!1){const t=ne(i),r=await t.getIdToken(e),o=Ai(r);A(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,h=c==null?void 0:c.sign_in_provider;return{claims:o,token:r,authTime:Nt(si(o.auth_time)),issuedAtTime:Nt(si(o.iat)),expirationTime:Nt(si(o.exp)),signInProvider:h||null,signInSecondFactor:(c==null?void 0:c.sign_in_second_factor)||null}}function si(i){return Number(i)*1e3}function Ai(i){const[e,t,r]=i.split(".");if(e===void 0||t===void 0||r===void 0)return hn("JWT malformed, contained fewer than 3 sections"),null;try{const o=Cs(t);return o?JSON.parse(o):(hn("Failed to decode base64 JWT payload"),null)}catch(o){return hn("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function qr(i){const e=Ai(i);return A(e,"internal-error"),A(typeof e.exp<"u","internal-error"),A(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xt(i,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof me&&ih(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function ih({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Nt(this.lastLoginAt),this.creationTime=Nt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yn(i){var S;const e=i.auth,t=await i.getIdToken(),r=await xt(i,_n(e,{idToken:t}));A(r==null?void 0:r.users.length,e,"internal-error");const o=r.users[0];i._notifyReloadListener(o);const c=(S=o.providerUserInfo)!=null&&S.length?Gs(o.providerUserInfo):[],h=oh(i.providerData,c),y=i.isAnonymous,E=!(i.email&&o.passwordHash)&&!(h!=null&&h.length),v=y?E:!1,b={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new gi(o.createdAt,o.lastLoginAt),isAnonymous:v};Object.assign(i,b)}async function sh(i){const e=ne(i);await yn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function oh(i,e){return[...i.filter(r=>!e.some(o=>o.providerId===r.providerId)),...e]}function Gs(i){return i.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ah(i,e){const t=await $s(i,{},async()=>{const r=Bt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=i.config,h=await Ws(i,o,"/v1/token",`key=${c}`),y=await i._getAdditionalHeaders();y["Content-Type"]="application/x-www-form-urlencoded";const E={method:"POST",headers:y,body:r};return i.emulatorConfig&&Tn(i.emulatorConfig.host)&&(E.credentials="include"),Hs.fetch()(h,E)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function ch(i,e){return Ue(i,"POST","/v2/accounts:revokeToken",Ye(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){A(e.idToken,"internal-error"),A(typeof e.idToken<"u","internal-error"),A(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):qr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){A(e.length!==0,"internal-error");const t=qr(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(A(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:o,expiresIn:c}=await ah(e,t);this.updateTokensAndExpiration(r,o,Number(c))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:o,expirationTime:c}=t,h=new rt;return r&&(A(typeof r=="string","internal-error",{appName:e}),h.refreshToken=r),o&&(A(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),c&&(A(typeof c=="number","internal-error",{appName:e}),h.expirationTime=c),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new rt,this.toJSON())}_performRefresh(){return de("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(i,e){A(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class Z{constructor({uid:e,auth:t,stsTokenManager:r,...o}){this.providerId="firebase",this.proactiveRefresh=new rh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new gi(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await xt(this,this.stsTokenManager.getToken(this.auth,e));return A(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return nh(this,e)}reload(){return sh(this)}_assign(e){this!==e&&(A(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Z({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){A(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await yn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Q(this.auth.app))return Promise.reject(Le(this.auth));const e=await this.getIdToken();return await xt(this,th(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,o=t.email??void 0,c=t.phoneNumber??void 0,h=t.photoURL??void 0,y=t.tenantId??void 0,E=t._redirectEventId??void 0,v=t.createdAt??void 0,b=t.lastLoginAt??void 0,{uid:S,emailVerified:D,isAnonymous:H,providerData:x,stsTokenManager:B}=t;A(S&&B,e,"internal-error");const M=rt.fromJSON(this.name,B);A(typeof S=="string",e,"internal-error"),be(r,e.name),be(o,e.name),A(typeof D=="boolean",e,"internal-error"),A(typeof H=="boolean",e,"internal-error"),be(c,e.name),be(h,e.name),be(y,e.name),be(E,e.name),be(v,e.name),be(b,e.name);const ie=new Z({uid:S,auth:e,email:o,emailVerified:D,displayName:r,isAnonymous:H,photoURL:h,phoneNumber:c,tenantId:y,stsTokenManager:M,createdAt:v,lastLoginAt:b});return x&&Array.isArray(x)&&(ie.providerData=x.map(_e=>({..._e}))),E&&(ie._redirectEventId=E),ie}static async _fromIdTokenResponse(e,t,r=!1){const o=new rt;o.updateFromServerResponse(t);const c=new Z({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:r});return await yn(c),c}static async _fromGetAccountInfoResponse(e,t,r){const o=t.users[0];A(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?Gs(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(c!=null&&c.length),y=new rt;y.updateFromIdToken(r);const E=new Z({uid:o.localId,auth:e,stsTokenManager:y,isAnonymous:h}),v={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new gi(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(c!=null&&c.length)};return Object.assign(E,v),E}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kr=new Map;function fe(i){ge(i instanceof Function,"Expected a class definition");let e=Kr.get(i);return e?(ge(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,Kr.set(i,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}zs.type="NONE";const Jr=zs;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ln(i,e,t){return`firebase:${i}:${e}:${t}`}class st{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:o,name:c}=this.auth;this.fullUserKey=ln(this.userKey,o.apiKey,c),this.fullPersistenceKey=ln("persistence",o.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await _n(this.auth,{idToken:e}).catch(()=>{});return t?Z._fromGetAccountInfoResponse(this.auth,t,e):null}return Z._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new st(fe(Jr),e,r);const o=(await Promise.all(t.map(async v=>{if(await v._isAvailable())return v}))).filter(v=>v);let c=o[0]||fe(Jr);const h=ln(r,e.config.apiKey,e.name);let y=null;for(const v of t)try{const b=await v._get(h);if(b){let S;if(typeof b=="string"){const D=await _n(e,{idToken:b}).catch(()=>{});if(!D)break;S=await Z._fromGetAccountInfoResponse(e,D,b)}else S=Z._fromJSON(e,b);v!==c&&(y=S),c=v;break}}catch{}const E=o.filter(v=>v._shouldAllowMigration);return!c._shouldAllowMigration||!E.length?new st(c,e,r):(c=E[0],y&&await c._set(h,y.toJSON()),await Promise.all(t.map(async v=>{if(v!==c)try{await v._remove(h)}catch{}})),new st(c,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xr(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Xs(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(qs(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Qs(e))return"Blackberry";if(Zs(e))return"Webos";if(Ks(e))return"Safari";if((e.includes("chrome/")||Js(e))&&!e.includes("edge/"))return"Chrome";if(Ys(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function qs(i=q()){return/firefox\//i.test(i)}function Ks(i=q()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Js(i=q()){return/crios\//i.test(i)}function Xs(i=q()){return/iemobile/i.test(i)}function Ys(i=q()){return/android/i.test(i)}function Qs(i=q()){return/blackberry/i.test(i)}function Zs(i=q()){return/webos/i.test(i)}function bi(i=q()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function hh(i=q()){var e;return bi(i)&&!!((e=window.navigator)!=null&&e.standalone)}function lh(){return va()&&document.documentMode===10}function eo(i=q()){return bi(i)||Ys(i)||Zs(i)||Qs(i)||/windows phone/i.test(i)||Xs(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function to(i,e=[]){let t;switch(i){case"Browser":t=Xr(q());break;case"Worker":t=`${Xr(q())}-${i}`;break;default:t=i}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ut}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=c=>new Promise((h,y)=>{try{const E=e(c);h(E)}catch(E){y(E)}});r.onAbort=t,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dh(i,e={}){return Ue(i,"GET","/v2/passwordPolicy",Ye(i,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fh=6;class ph{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??fh,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let o=0;o<e.length;o++)r=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh{constructor(e,t,r,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yr(this),this.idTokenSubscription=new Yr(this),this.beforeStateQueue=new uh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=js,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=fe(t)),this._initializationPromise=this.queue(async()=>{var r,o,c;if(!this._deleted&&(this.persistenceManager=await st.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((c=this.currentUser)==null?void 0:c.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await _n(this,{idToken:e}),r=await Z._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var c;if(Q(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(y=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(y,y))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(c=this.redirectUser)==null?void 0:c._redirectEventId,y=r==null?void 0:r._redirectEventId,E=await this.tryRedirectSignIn(e);(!h||h===y)&&(E!=null&&E.user)&&(r=E.user,o=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(r)}catch(h){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return A(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await yn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=qc()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Q(this.app))return Promise.reject(Le(this));const t=e?ne(e):null;return t&&A(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&A(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Q(this.app)?Promise.reject(Le(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Q(this.app)?Promise.reject(Le(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(fe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await dh(this),t=new ph(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new jt("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await ch(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&fe(e)||this._popupRedirectResolver;A(t,this,"argument-error"),this.redirectPersistenceManager=await st.create(this,[fe(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,o){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let h=!1;const y=this._isInitialized?Promise.resolve():this._initializationPromise;if(A(y,this,"internal-error"),y.then(()=>{h||c(this.currentUser)}),typeof t=="function"){const E=e.addObserver(t,r,o);return()=>{h=!0,E()}}else{const E=e.addObserver(t);return()=>{h=!0,E()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return A(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=to(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(Q(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&Wc(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function dt(i){return ne(i)}class Yr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ca(t=>this.observer=t)}get next(){return A(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let An={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function mh(i){An=i}function no(i){return An.loadJS(i)}function _h(){return An.recaptchaEnterpriseScript}function yh(){return An.gapiScript}function Ih(i){return`__${i}${Math.floor(Math.random()*1e6)}`}class wh{constructor(){this.enterprise=new Eh}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Eh{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const vh="recaptcha-enterprise",io="NO_RECAPTCHA";class Th{constructor(e){this.type=vh,this.auth=dt(e)}async verify(e="verify",t=!1){async function r(c){if(!t){if(c.tenantId==null&&c._agentRecaptchaConfig!=null)return c._agentRecaptchaConfig.siteKey;if(c.tenantId!=null&&c._tenantRecaptchaConfigs[c.tenantId]!==void 0)return c._tenantRecaptchaConfigs[c.tenantId].siteKey}return new Promise(async(h,y)=>{eh(c,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(E=>{if(E.recaptchaKey===void 0)y(new Error("recaptcha Enterprise site key undefined"));else{const v=new Zc(E);return c.tenantId==null?c._agentRecaptchaConfig=v:c._tenantRecaptchaConfigs[c.tenantId]=v,h(v.siteKey)}}).catch(E=>{y(E)})})}function o(c,h,y){const E=window.grecaptcha;zr(E)?E.enterprise.ready(()=>{E.enterprise.execute(c,{action:e}).then(v=>{h(v)}).catch(()=>{h(io)})}):y(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new wh().execute("siteKey",{action:"verify"}):new Promise((c,h)=>{r(this.auth).then(y=>{if(!t&&zr(window.grecaptcha))o(y,c,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let E=_h();E.length!==0&&(E+=y),no(E).then(()=>{o(y,c,h)}).catch(v=>{h(v)})}}).catch(y=>{h(y)})})}}async function Qr(i,e,t,r=!1,o=!1){const c=new Th(i);let h;if(o)h=io;else try{h=await c.verify(t)}catch{h=await c.verify(t,!0)}const y={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in y){const E=y.phoneEnrollmentInfo.phoneNumber,v=y.phoneEnrollmentInfo.recaptchaToken;Object.assign(y,{phoneEnrollmentInfo:{phoneNumber:E,recaptchaToken:v,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in y){const E=y.phoneSignInInfo.recaptchaToken;Object.assign(y,{phoneSignInInfo:{recaptchaToken:E,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return y}return r?Object.assign(y,{captchaResp:h}):Object.assign(y,{captchaResponse:h}),Object.assign(y,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(y,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),y}async function Zr(i,e,t,r,o){var c;if((c=i._getRecaptchaConfig())!=null&&c.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await Qr(i,e,t,t==="getOobCode");return r(i,h)}else return r(i,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const y=await Qr(i,e,t,t==="getOobCode");return r(i,y)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(i,e){const t=vi(i,"auth");if(t.isInitialized()){const o=t.getImmediate(),c=t.getOptions();if(qe(c,e??{}))return o;te(o,"already-initialized")}return t.initialize({options:e})}function Ah(i,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(fe);e!=null&&e.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function bh(i,e,t){const r=dt(i);A(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const o=!1,c=ro(e),{host:h,port:y}=Ph(e),E=y===null?"":`:${y}`,v={url:`${c}//${h}${E}/`},b=Object.freeze({host:h,port:y,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!r._canInitEmulator){A(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),A(qe(v,r.config.emulator)&&qe(b,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=v,r.emulatorConfig=b,r.settings.appVerificationDisabledForTesting=!0,Tn(h)?Ds(`${c}//${h}${E}`):Rh()}function ro(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function Ph(i){const e=ro(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const c=o[1];return{host:c,port:es(r.substr(c.length+1))}}else{const[c,h]=r.split(":");return{host:c,port:es(h)}}}function es(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function Rh(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return de("not implemented")}_getIdTokenResponse(e){return de("not implemented")}_linkToIdToken(e,t){return de("not implemented")}_getReauthenticationResolver(e){return de("not implemented")}}async function Ch(i,e){return Ue(i,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kh(i,e){return Sn(i,"POST","/v1/accounts:signInWithPassword",Ye(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oh(i,e){return Sn(i,"POST","/v1/accounts:signInWithEmailLink",Ye(i,e))}async function Nh(i,e){return Sn(i,"POST","/v1/accounts:signInWithEmailLink",Ye(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft extends Pi{constructor(e,t,r,o=null){super("password",r),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new Ft(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Ft(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zr(e,t,"signInWithPassword",kh);case"emailLink":return Oh(e,{email:this._email,oobCode:this._password});default:te(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zr(e,r,"signUpPassword",Ch);case"emailLink":return Nh(e,{idToken:t,email:this._email,oobCode:this._password});default:te(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ot(i,e){return Sn(i,"POST","/v1/accounts:signInWithIdp",Ye(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh="http://localhost";class Je extends Pi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Je(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):te("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:o,...c}=t;if(!r||!o)return null;const h=new Je(r,o);return h.idToken=c.idToken||void 0,h.accessToken=c.accessToken||void 0,h.secret=c.secret,h.nonce=c.nonce,h.pendingToken=c.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return ot(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,ot(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ot(e,t)}buildRequest(){const e={requestUri:Dh,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Bt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lh(i){switch(i){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Mh(i){const e=kt(Ot(i)).link,t=e?kt(Ot(e)).deep_link_id:null,r=kt(Ot(i)).deep_link_id;return(r?kt(Ot(r)).link:null)||r||t||e||i}class Ri{constructor(e){const t=kt(Ot(e)),r=t.apiKey??null,o=t.oobCode??null,c=Lh(t.mode??null);A(r&&o&&c,"argument-error"),this.apiKey=r,this.operation=c,this.code=o,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=Mh(e);try{return new Ri(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(){this.providerId=ft.PROVIDER_ID}static credential(e,t){return Ft._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Ri.parseLink(t);return A(r,"argument-error"),Ft._fromEmailAndCode(e,r.code,r.tenantId)}}ft.PROVIDER_ID="password";ft.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ft.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t extends so{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe extends $t{constructor(){super("facebook.com")}static credential(e){return Je._fromParams({providerId:Pe.PROVIDER_ID,signInMethod:Pe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Pe.credentialFromTaggedObject(e)}static credentialFromError(e){return Pe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Pe.credential(e.oauthAccessToken)}catch{return null}}}Pe.FACEBOOK_SIGN_IN_METHOD="facebook.com";Pe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re extends $t{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Je._fromParams({providerId:Re.PROVIDER_ID,signInMethod:Re.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Re.credentialFromTaggedObject(e)}static credentialFromError(e){return Re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Re.credential(t,r)}catch{return null}}}Re.GOOGLE_SIGN_IN_METHOD="google.com";Re.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce extends $t{constructor(){super("github.com")}static credential(e){return Je._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ce.credential(e.oauthAccessToken)}catch{return null}}}Ce.GITHUB_SIGN_IN_METHOD="github.com";Ce.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends $t{constructor(){super("twitter.com")}static credential(e,t){return Je._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return ke.credential(t,r)}catch{return null}}}ke.TWITTER_SIGN_IN_METHOD="twitter.com";ke.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,o=!1){const c=await Z._fromIdTokenResponse(e,r,o),h=ts(r);return new ht({user:c,providerId:h,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const o=ts(r);return new ht({user:e,providerId:o,_tokenResponse:r,operationType:t})}}function ts(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In extends me{constructor(e,t,r,o){super(t.code,t.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,In.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,o){return new In(e,t,r,o)}}function oo(i,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?In._fromErrorAndOperation(i,c,e,r):c})}async function Uh(i,e,t=!1){const r=await xt(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return ht._forOperation(i,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xh(i,e,t=!1){const{auth:r}=i;if(Q(r.app))return Promise.reject(Le(r));const o="reauthenticate";try{const c=await xt(i,oo(r,o,e,i),t);A(c.idToken,r,"internal-error");const h=Ai(c.idToken);A(h,r,"internal-error");const{sub:y}=h;return A(i.uid===y,r,"user-mismatch"),ht._forOperation(i,o,c)}catch(c){throw(c==null?void 0:c.code)==="auth/user-not-found"&&te(r,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ao(i,e,t=!1){if(Q(i.app))return Promise.reject(Le(i));const r="signIn",o=await oo(i,r,e),c=await ht._fromIdTokenResponse(i,r,o);return t||await i._updateCurrentUser(c.user),c}async function Fh(i,e){return ao(dt(i),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vh(i){const e=dt(i);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function Du(i,e,t){return Q(i.app)?Promise.reject(Le(i)):Fh(ne(i),ft.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Vh(i),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lu(i,e){return ne(i).setPersistence(e)}function jh(i,e,t,r){return ne(i).onIdTokenChanged(e,t,r)}function Bh(i,e,t){return ne(i).beforeAuthStateChanged(e,t)}function Mu(i,e,t,r){return ne(i).onAuthStateChanged(e,t,r)}function Uu(i){return ne(i).signOut()}const wn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(wn,"1"),this.storage.removeItem(wn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hh=1e3,$h=10;class ho extends co{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=eo(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),o=this.localCache[t];r!==o&&e(t,o,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,y,E)=>{this.notifyListeners(h,E)});return}const r=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(r);!t&&this.localCache[r]===h||this.notifyListeners(r,h)},c=this.storage.getItem(r);lh()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,$h):o()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Hh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ho.type="LOCAL";const Wh=ho;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo extends co{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}lo.type="SESSION";const uo=lo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gh(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const r=new bn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:o,data:c}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const y=Array.from(h).map(async v=>v(t.origin,c)),E=await Gh(y);t.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:E})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ci(i="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return i+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,h;return new Promise((y,E)=>{const v=Ci("",20);o.port1.start();const b=setTimeout(()=>{E(new Error("unsupported_event"))},r);h={messageChannel:o,onMessage(S){const D=S;if(D.data.eventId===v)switch(D.data.status){case"ack":clearTimeout(b),c=setTimeout(()=>{E(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),y(D.data.response);break;default:clearTimeout(b),clearTimeout(c),E(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:v,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(){return window}function qh(i){le().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(){return typeof le().WorkerGlobalScope<"u"&&typeof le().importScripts=="function"}async function Kh(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Jh(){var i;return((i=navigator==null?void 0:navigator.serviceWorker)==null?void 0:i.controller)||null}function Xh(){return fo()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const po="firebaseLocalStorageDb",Yh=1,En="firebaseLocalStorage",go="fbase_key";class Wt{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Pn(i,e){return i.transaction([En],e?"readwrite":"readonly").objectStore(En)}function Qh(){const i=indexedDB.deleteDatabase(po);return new Wt(i).toPromise()}function mi(){const i=indexedDB.open(po,Yh);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(En,{keyPath:go})}catch(o){t(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(En)?e(r):(r.close(),await Qh(),e(await mi()))})})}async function ns(i,e,t){const r=Pn(i,!0).put({[go]:e,value:t});return new Wt(r).toPromise()}async function Zh(i,e){const t=Pn(i,!1).get(e),r=await new Wt(t).toPromise();return r===void 0?null:r.value}function is(i,e){const t=Pn(i,!0).delete(e);return new Wt(t).toPromise()}const el=800,tl=3;class mo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await mi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>tl)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return fo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bn._getInstance(Xh()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await Kh(),!this.activeServiceWorker)return;this.sender=new zh(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Jh()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await mi();return await ns(e,wn,"1"),await is(e,wn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>ns(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Zh(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>is(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=Pn(o,!1).getAll();return new Wt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),el)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}mo.type="LOCAL";const nl=mo;new Ht(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function il(i,e){return e?fe(e):(A(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki extends Pi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ot(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ot(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ot(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function rl(i){return ao(i.auth,new ki(i),i.bypassAuthState)}function sl(i){const{auth:e,user:t}=i;return A(t,e,"internal-error"),xh(t,new ki(i),i.bypassAuthState)}async function ol(i){const{auth:e,user:t}=i;return A(t,e,"internal-error"),Uh(t,new ki(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(e,t,r,o,c=!1){this.auth=e,this.resolver=r,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:o,tenantId:c,error:h,type:y}=e;if(h){this.reject(h);return}const E={auth:this.auth,requestUri:t,sessionId:r,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(y)(E))}catch(v){this.reject(v)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return rl;case"linkViaPopup":case"linkViaRedirect":return ol;case"reauthViaPopup":case"reauthViaRedirect":return sl;default:te(this.auth,"internal-error")}}resolve(e){ge(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ge(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al=new Ht(2e3,1e4);class it extends _o{constructor(e,t,r,o,c){super(e,t,o,c),this.provider=r,this.authWindow=null,this.pollId=null,it.currentPopupAction&&it.currentPopupAction.cancel(),it.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return A(e,this.auth,"internal-error"),e}async onExecution(){ge(this.filter.length===1,"Popup operations only handle one event");const e=Ci();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(he(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(he(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,it.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(he(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,al.get())};e()}}it.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cl="pendingRedirect",un=new Map;class hl extends _o{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=un.get(this.auth._key());if(!e){try{const r=await ll(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}un.set(this.auth._key(),e)}return this.bypassAuthState||un.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function ll(i,e){const t=fl(e),r=dl(i);if(!await r._isAvailable())return!1;const o=await r._get(t)==="true";return await r._remove(t),o}function ul(i,e){un.set(i._key(),e)}function dl(i){return fe(i._redirectPersistence)}function fl(i){return ln(cl,i.config.apiKey,i.name)}async function pl(i,e,t=!1){if(Q(i.app))return Promise.reject(Le(i));const r=dt(i),o=il(r,e),h=await new hl(r,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gl=10*60*1e3;class ml{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!_l(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!yo(e)){const o=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(he(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=gl&&this.cachedEventUids.clear(),this.cachedEventUids.has(rs(e))}saveEventToCache(e){this.cachedEventUids.add(rs(e)),this.lastProcessedEventTime=Date.now()}}function rs(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function yo({type:i,error:e}){return i==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function _l(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return yo(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yl(i,e={}){return Ue(i,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Il=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,wl=/^https?/;async function El(i){if(i.config.emulator)return;const{authorizedDomains:e}=await yl(i);for(const t of e)try{if(vl(t))return}catch{}te(i,"unauthorized-domain")}function vl(i){const e=pi(),{protocol:t,hostname:r}=new URL(e);if(i.startsWith("chrome-extension://")){const h=new URL(i);return h.hostname===""&&r===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===r}if(!wl.test(t))return!1;if(Il.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tl=new Ht(3e4,6e4);function ss(){const i=le().___jsl;if(i!=null&&i.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function Sl(i){return new Promise((e,t)=>{var o,c,h;function r(){ss(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ss(),t(he(i,"network-request-failed"))},timeout:Tl.get()})}if((c=(o=le().gapi)==null?void 0:o.iframes)!=null&&c.Iframe)e(gapi.iframes.getContext());else if((h=le().gapi)!=null&&h.load)r();else{const y=Ih("iframefcb");return le()[y]=()=>{gapi.load?r():t(he(i,"network-request-failed"))},no(`${yh()}?onload=${y}`).catch(E=>t(E))}}).catch(e=>{throw dn=null,e})}let dn=null;function Al(i){return dn=dn||Sl(i),dn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl=new Ht(5e3,15e3),Pl="__/auth/iframe",Rl="emulator/auth/iframe",Cl={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},kl=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ol(i){const e=i.config;A(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?Si(e,Rl):`https://${i.config.authDomain}/${Pl}`,r={apiKey:e.apiKey,appName:i.name,v:ut},o=kl.get(i.config.apiHost);o&&(r.eid=o);const c=i._getFrameworks();return c.length&&(r.fw=c.join(",")),`${t}?${Bt(r).slice(1)}`}async function Nl(i){const e=await Al(i),t=le().gapi;return A(t,i,"internal-error"),e.open({where:document.body,url:Ol(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Cl,dontclear:!0},r=>new Promise(async(o,c)=>{await r.restyle({setHideOnLeave:!1});const h=he(i,"network-request-failed"),y=le().setTimeout(()=>{c(h)},bl.get());function E(){le().clearTimeout(y),o(r)}r.ping(E).then(E,()=>{c(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ll=500,Ml=600,Ul="_blank",xl="http://localhost";class os{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Fl(i,e,t,r=Ll,o=Ml){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let y="";const E={...Dl,width:r.toString(),height:o.toString(),top:c,left:h},v=q().toLowerCase();t&&(y=Js(v)?Ul:t),qs(v)&&(e=e||xl,E.scrollbars="yes");const b=Object.entries(E).reduce((D,[H,x])=>`${D}${H}=${x},`,"");if(hh(v)&&y!=="_self")return Vl(e||"",y),new os(null);const S=window.open(e||"",y,b);A(S,i,"popup-blocked");try{S.focus()}catch{}return new os(S)}function Vl(i,e){const t=document.createElement("a");t.href=i,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl="__/auth/handler",Bl="emulator/auth/handler",Hl=encodeURIComponent("fac");async function as(i,e,t,r,o,c){A(i.config.authDomain,i,"auth-domain-config-required"),A(i.config.apiKey,i,"invalid-api-key");const h={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:r,v:ut,eventId:o};if(e instanceof so){e.setDefaultLanguage(i.languageCode),h.providerId=e.providerId||"",Ra(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[b,S]of Object.entries({}))h[b]=S}if(e instanceof $t){const b=e.getScopes().filter(S=>S!=="");b.length>0&&(h.scopes=b.join(","))}i.tenantId&&(h.tid=i.tenantId);const y=h;for(const b of Object.keys(y))y[b]===void 0&&delete y[b];const E=await i._getAppCheckToken(),v=E?`#${Hl}=${encodeURIComponent(E)}`:"";return`${$l(i)}?${Bt(y).slice(1)}${v}`}function $l({config:i}){return i.emulator?Si(i,Bl):`https://${i.authDomain}/${jl}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="webStorageSupport";class Wl{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=uo,this._completeRedirectFn=pl,this._overrideRedirectResult=ul}async _openPopup(e,t,r,o){var h;ge((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const c=await as(e,t,r,pi(),o);return Fl(e,c,Ci())}async _openRedirect(e,t,r,o){await this._originValidation(e);const c=await as(e,t,r,pi(),o);return qh(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:c}=this.eventManagers[t];return o?Promise.resolve(o):(ge(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Nl(e),r=new ml(e);return t.register("authEvent",o=>(A(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(oi,{type:oi},o=>{var h;const c=(h=o==null?void 0:o[0])==null?void 0:h[oi];c!==void 0&&t(!!c),te(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=El(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return eo()||Ks()||bi()}}const Gl=Wl;var cs="@firebase/auth",hs="1.12.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){A(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ql(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Kl(i){ct(new Ke("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:h,authDomain:y}=r.options;A(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const E={apiKey:h,authDomain:y,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:to(i)},v=new gh(r,o,c,E);return Ah(v,t),v},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ct(new Ke("auth-internal",e=>{const t=dt(e.getProvider("auth").getImmediate());return(r=>new zl(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),De(cs,hs,ql(i)),De(cs,hs,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl=5*60,Xl=Ns("authIdTokenMaxAge")||Jl;let ls=null;const Yl=i=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Xl)return;const o=t==null?void 0:t.token;ls!==o&&(ls=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function xu(i=Us()){const e=vi(i,"auth");if(e.isInitialized())return e.getImmediate();const t=Sh(i,{popupRedirectResolver:Gl,persistence:[nl,Wh,uo]}),r=Ns("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const h=Yl(c.toString());Bh(t,h,()=>h(t.currentUser)),jh(t,y=>h(y))}}const o=ks("auth");return o&&bh(t,`http://${o}`),t}function Ql(){var i;return((i=document.getElementsByTagName("head"))==null?void 0:i[0])??document}mh({loadJS(i){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=e,r.onerror=o=>{const c=he("internal-error");c.customData=o,t(c)},r.type="text/javascript",r.charset="UTF-8",Ql().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Kl("Browser");var us=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Oi;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(g,u){function f(){}f.prototype=u.prototype,g.F=u.prototype,g.prototype=new f,g.prototype.constructor=g,g.D=function(m,p,I){for(var d=Array(arguments.length-2),K=2;K<arguments.length;K++)d[K-2]=arguments[K];return u.prototype[p].apply(m,d)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(g,u,f){f||(f=0);const m=Array(16);if(typeof u=="string")for(var p=0;p<16;++p)m[p]=u.charCodeAt(f++)|u.charCodeAt(f++)<<8|u.charCodeAt(f++)<<16|u.charCodeAt(f++)<<24;else for(p=0;p<16;++p)m[p]=u[f++]|u[f++]<<8|u[f++]<<16|u[f++]<<24;u=g.g[0],f=g.g[1],p=g.g[2];let I=g.g[3],d;d=u+(I^f&(p^I))+m[0]+3614090360&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(p^u&(f^p))+m[1]+3905402710&4294967295,I=u+(d<<12&4294967295|d>>>20),d=p+(f^I&(u^f))+m[2]+606105819&4294967295,p=I+(d<<17&4294967295|d>>>15),d=f+(u^p&(I^u))+m[3]+3250441966&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(I^f&(p^I))+m[4]+4118548399&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(p^u&(f^p))+m[5]+1200080426&4294967295,I=u+(d<<12&4294967295|d>>>20),d=p+(f^I&(u^f))+m[6]+2821735955&4294967295,p=I+(d<<17&4294967295|d>>>15),d=f+(u^p&(I^u))+m[7]+4249261313&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(I^f&(p^I))+m[8]+1770035416&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(p^u&(f^p))+m[9]+2336552879&4294967295,I=u+(d<<12&4294967295|d>>>20),d=p+(f^I&(u^f))+m[10]+4294925233&4294967295,p=I+(d<<17&4294967295|d>>>15),d=f+(u^p&(I^u))+m[11]+2304563134&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(I^f&(p^I))+m[12]+1804603682&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(p^u&(f^p))+m[13]+4254626195&4294967295,I=u+(d<<12&4294967295|d>>>20),d=p+(f^I&(u^f))+m[14]+2792965006&4294967295,p=I+(d<<17&4294967295|d>>>15),d=f+(u^p&(I^u))+m[15]+1236535329&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(p^I&(f^p))+m[1]+4129170786&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^p&(u^f))+m[6]+3225465664&4294967295,I=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(I^u))+m[11]+643717713&4294967295,p=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(p^I))+m[0]+3921069994&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^I&(f^p))+m[5]+3593408605&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^p&(u^f))+m[10]+38016083&4294967295,I=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(I^u))+m[15]+3634488961&4294967295,p=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(p^I))+m[4]+3889429448&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^I&(f^p))+m[9]+568446438&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^p&(u^f))+m[14]+3275163606&4294967295,I=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(I^u))+m[3]+4107603335&4294967295,p=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(p^I))+m[8]+1163531501&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^I&(f^p))+m[13]+2850285829&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^p&(u^f))+m[2]+4243563512&4294967295,I=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(I^u))+m[7]+1735328473&4294967295,p=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(p^I))+m[12]+2368359562&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(f^p^I)+m[5]+4294588738&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^p)+m[8]+2272392833&4294967295,I=u+(d<<11&4294967295|d>>>21),d=p+(I^u^f)+m[11]+1839030562&4294967295,p=I+(d<<16&4294967295|d>>>16),d=f+(p^I^u)+m[14]+4259657740&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^I)+m[1]+2763975236&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^p)+m[4]+1272893353&4294967295,I=u+(d<<11&4294967295|d>>>21),d=p+(I^u^f)+m[7]+4139469664&4294967295,p=I+(d<<16&4294967295|d>>>16),d=f+(p^I^u)+m[10]+3200236656&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^I)+m[13]+681279174&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^p)+m[0]+3936430074&4294967295,I=u+(d<<11&4294967295|d>>>21),d=p+(I^u^f)+m[3]+3572445317&4294967295,p=I+(d<<16&4294967295|d>>>16),d=f+(p^I^u)+m[6]+76029189&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^I)+m[9]+3654602809&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^p)+m[12]+3873151461&4294967295,I=u+(d<<11&4294967295|d>>>21),d=p+(I^u^f)+m[15]+530742520&4294967295,p=I+(d<<16&4294967295|d>>>16),d=f+(p^I^u)+m[2]+3299628645&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(p^(f|~I))+m[0]+4096336452&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~p))+m[7]+1126891415&4294967295,I=u+(d<<10&4294967295|d>>>22),d=p+(u^(I|~f))+m[14]+2878612391&4294967295,p=I+(d<<15&4294967295|d>>>17),d=f+(I^(p|~u))+m[5]+4237533241&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~I))+m[12]+1700485571&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~p))+m[3]+2399980690&4294967295,I=u+(d<<10&4294967295|d>>>22),d=p+(u^(I|~f))+m[10]+4293915773&4294967295,p=I+(d<<15&4294967295|d>>>17),d=f+(I^(p|~u))+m[1]+2240044497&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~I))+m[8]+1873313359&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~p))+m[15]+4264355552&4294967295,I=u+(d<<10&4294967295|d>>>22),d=p+(u^(I|~f))+m[6]+2734768916&4294967295,p=I+(d<<15&4294967295|d>>>17),d=f+(I^(p|~u))+m[13]+1309151649&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~I))+m[4]+4149444226&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~p))+m[11]+3174756917&4294967295,I=u+(d<<10&4294967295|d>>>22),d=p+(u^(I|~f))+m[2]+718787259&4294967295,p=I+(d<<15&4294967295|d>>>17),d=f+(I^(p|~u))+m[9]+3951481745&4294967295,g.g[0]=g.g[0]+u&4294967295,g.g[1]=g.g[1]+(p+(d<<21&4294967295|d>>>11))&4294967295,g.g[2]=g.g[2]+p&4294967295,g.g[3]=g.g[3]+I&4294967295}r.prototype.v=function(g,u){u===void 0&&(u=g.length);const f=u-this.blockSize,m=this.C;let p=this.h,I=0;for(;I<u;){if(p==0)for(;I<=f;)o(this,g,I),I+=this.blockSize;if(typeof g=="string"){for(;I<u;)if(m[p++]=g.charCodeAt(I++),p==this.blockSize){o(this,m),p=0;break}}else for(;I<u;)if(m[p++]=g[I++],p==this.blockSize){o(this,m),p=0;break}}this.h=p,this.o+=u},r.prototype.A=function(){var g=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);g[0]=128;for(var u=1;u<g.length-8;++u)g[u]=0;u=this.o*8;for(var f=g.length-8;f<g.length;++f)g[f]=u&255,u/=256;for(this.v(g),g=Array(16),u=0,f=0;f<4;++f)for(let m=0;m<32;m+=8)g[u++]=this.g[f]>>>m&255;return g};function c(g,u){var f=y;return Object.prototype.hasOwnProperty.call(f,g)?f[g]:f[g]=u(g)}function h(g,u){this.h=u;const f=[];let m=!0;for(let p=g.length-1;p>=0;p--){const I=g[p]|0;m&&I==u||(f[p]=I,m=!1)}this.g=f}var y={};function E(g){return-128<=g&&g<128?c(g,function(u){return new h([u|0],u<0?-1:0)}):new h([g|0],g<0?-1:0)}function v(g){if(isNaN(g)||!isFinite(g))return S;if(g<0)return M(v(-g));const u=[];let f=1;for(let m=0;g>=f;m++)u[m]=g/f|0,f*=4294967296;return new h(u,0)}function b(g,u){if(g.length==0)throw Error("number format error: empty string");if(u=u||10,u<2||36<u)throw Error("radix out of range: "+u);if(g.charAt(0)=="-")return M(b(g.substring(1),u));if(g.indexOf("-")>=0)throw Error('number format error: interior "-" character');const f=v(Math.pow(u,8));let m=S;for(let I=0;I<g.length;I+=8){var p=Math.min(8,g.length-I);const d=parseInt(g.substring(I,I+p),u);p<8?(p=v(Math.pow(u,p)),m=m.j(p).add(v(d))):(m=m.j(f),m=m.add(v(d)))}return m}var S=E(0),D=E(1),H=E(16777216);i=h.prototype,i.m=function(){if(B(this))return-M(this).m();let g=0,u=1;for(let f=0;f<this.g.length;f++){const m=this.i(f);g+=(m>=0?m:4294967296+m)*u,u*=4294967296}return g},i.toString=function(g){if(g=g||10,g<2||36<g)throw Error("radix out of range: "+g);if(x(this))return"0";if(B(this))return"-"+M(this).toString(g);const u=v(Math.pow(g,6));var f=this;let m="";for(;;){const p=Qe(f,u).g;f=ie(f,p.j(u));let I=((f.g.length>0?f.g[0]:f.h)>>>0).toString(g);if(f=p,x(f))return I+m;for(;I.length<6;)I="0"+I;m=I+m}},i.i=function(g){return g<0?0:g<this.g.length?this.g[g]:this.h};function x(g){if(g.h!=0)return!1;for(let u=0;u<g.g.length;u++)if(g.g[u]!=0)return!1;return!0}function B(g){return g.h==-1}i.l=function(g){return g=ie(this,g),B(g)?-1:x(g)?0:1};function M(g){const u=g.g.length,f=[];for(let m=0;m<u;m++)f[m]=~g.g[m];return new h(f,~g.h).add(D)}i.abs=function(){return B(this)?M(this):this},i.add=function(g){const u=Math.max(this.g.length,g.g.length),f=[];let m=0;for(let p=0;p<=u;p++){let I=m+(this.i(p)&65535)+(g.i(p)&65535),d=(I>>>16)+(this.i(p)>>>16)+(g.i(p)>>>16);m=d>>>16,I&=65535,d&=65535,f[p]=d<<16|I}return new h(f,f[f.length-1]&-2147483648?-1:0)};function ie(g,u){return g.add(M(u))}i.j=function(g){if(x(this)||x(g))return S;if(B(this))return B(g)?M(this).j(M(g)):M(M(this).j(g));if(B(g))return M(this.j(M(g)));if(this.l(H)<0&&g.l(H)<0)return v(this.m()*g.m());const u=this.g.length+g.g.length,f=[];for(var m=0;m<2*u;m++)f[m]=0;for(m=0;m<this.g.length;m++)for(let p=0;p<g.g.length;p++){const I=this.i(m)>>>16,d=this.i(m)&65535,K=g.i(p)>>>16,xe=g.i(p)&65535;f[2*m+2*p]+=d*xe,_e(f,2*m+2*p),f[2*m+2*p+1]+=I*xe,_e(f,2*m+2*p+1),f[2*m+2*p+1]+=d*K,_e(f,2*m+2*p+1),f[2*m+2*p+2]+=I*K,_e(f,2*m+2*p+2)}for(g=0;g<u;g++)f[g]=f[2*g+1]<<16|f[2*g];for(g=u;g<2*u;g++)f[g]=0;return new h(f,0)};function _e(g,u){for(;(g[u]&65535)!=g[u];)g[u+1]+=g[u]>>>16,g[u]&=65535,u++}function ye(g,u){this.g=g,this.h=u}function Qe(g,u){if(x(u))throw Error("division by zero");if(x(g))return new ye(S,S);if(B(g))return u=Qe(M(g),u),new ye(M(u.g),M(u.h));if(B(u))return u=Qe(g,M(u)),new ye(M(u.g),u.h);if(g.g.length>30){if(B(g)||B(u))throw Error("slowDivide_ only works with positive integers.");for(var f=D,m=u;m.l(g)<=0;)f=Ie(f),m=Ie(m);var p=J(f,1),I=J(m,1);for(m=J(m,2),f=J(f,2);!x(m);){var d=I.add(m);d.l(g)<=0&&(p=p.add(f),I=d),m=J(m,1),f=J(f,1)}return u=ie(g,p.j(u)),new ye(p,u)}for(p=S;g.l(u)>=0;){for(f=Math.max(1,Math.floor(g.m()/u.m())),m=Math.ceil(Math.log(f)/Math.LN2),m=m<=48?1:Math.pow(2,m-48),I=v(f),d=I.j(u);B(d)||d.l(g)>0;)f-=m,I=v(f),d=I.j(u);x(I)&&(I=D),p=p.add(I),g=ie(g,d)}return new ye(p,g)}i.B=function(g){return Qe(this,g).h},i.and=function(g){const u=Math.max(this.g.length,g.g.length),f=[];for(let m=0;m<u;m++)f[m]=this.i(m)&g.i(m);return new h(f,this.h&g.h)},i.or=function(g){const u=Math.max(this.g.length,g.g.length),f=[];for(let m=0;m<u;m++)f[m]=this.i(m)|g.i(m);return new h(f,this.h|g.h)},i.xor=function(g){const u=Math.max(this.g.length,g.g.length),f=[];for(let m=0;m<u;m++)f[m]=this.i(m)^g.i(m);return new h(f,this.h^g.h)};function Ie(g){const u=g.g.length+1,f=[];for(let m=0;m<u;m++)f[m]=g.i(m)<<1|g.i(m-1)>>>31;return new h(f,g.h)}function J(g,u){const f=u>>5;u%=32;const m=g.g.length-f,p=[];for(let I=0;I<m;I++)p[I]=u>0?g.i(I+f)>>>u|g.i(I+f+1)<<32-u:g.i(I+f);return new h(p,g.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=v,h.fromString=b,Oi=h}).apply(typeof us<"u"?us:typeof self<"u"?self:typeof window<"u"?window:{});var an=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=Object.defineProperty;function t(n){n=[typeof globalThis=="object"&&globalThis,n,typeof window=="object"&&window,typeof self=="object"&&self,typeof an=="object"&&an];for(var s=0;s<n.length;++s){var a=n[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=t(this);function o(n,s){if(s)e:{var a=r;n=n.split(".");for(var l=0;l<n.length-1;l++){var _=n[l];if(!(_ in a))break e;a=a[_]}n=n[n.length-1],l=a[n],s=s(l),s!=l&&s!=null&&e(a,n,{configurable:!0,writable:!0,value:s})}}o("Symbol.dispose",function(n){return n||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(n){return n||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(n){return n||function(s){var a=[],l;for(l in s)Object.prototype.hasOwnProperty.call(s,l)&&a.push([l,s[l]]);return a}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var c=c||{},h=this||self;function y(n){var s=typeof n;return s=="object"&&n!=null||s=="function"}function E(n,s,a){return n.call.apply(n.bind,arguments)}function v(n,s,a){return v=E,v.apply(null,arguments)}function b(n,s){var a=Array.prototype.slice.call(arguments,1);return function(){var l=a.slice();return l.push.apply(l,arguments),n.apply(this,l)}}function S(n,s){function a(){}a.prototype=s.prototype,n.Z=s.prototype,n.prototype=new a,n.prototype.constructor=n,n.Ob=function(l,_,w){for(var T=Array(arguments.length-2),P=2;P<arguments.length;P++)T[P-2]=arguments[P];return s.prototype[_].apply(l,T)}}var D=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?n=>n&&AsyncContext.Snapshot.wrap(n):n=>n;function H(n){const s=n.length;if(s>0){const a=Array(s);for(let l=0;l<s;l++)a[l]=n[l];return a}return[]}function x(n,s){for(let l=1;l<arguments.length;l++){const _=arguments[l];var a=typeof _;if(a=a!="object"?a:_?Array.isArray(_)?"array":a:"null",a=="array"||a=="object"&&typeof _.length=="number"){a=n.length||0;const w=_.length||0;n.length=a+w;for(let T=0;T<w;T++)n[a+T]=_[T]}else n.push(_)}}class B{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return this.h>0?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function M(n){h.setTimeout(()=>{throw n},0)}function ie(){var n=g;let s=null;return n.g&&(s=n.g,n.g=n.g.next,n.g||(n.h=null),s.next=null),s}class _e{constructor(){this.h=this.g=null}add(s,a){const l=ye.get();l.set(s,a),this.h?this.h.next=l:this.g=l,this.h=l}}var ye=new B(()=>new Qe,n=>n.reset());class Qe{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let Ie,J=!1,g=new _e,u=()=>{const n=Promise.resolve(void 0);Ie=()=>{n.then(f)}};function f(){for(var n;n=ie();){try{n.h.call(n.g)}catch(a){M(a)}var s=ye;s.j(n),s.h<100&&(s.h++,n.next=s.g,s.g=n)}J=!1}function m(){this.u=this.u,this.C=this.C}m.prototype.u=!1,m.prototype.dispose=function(){this.u||(this.u=!0,this.N())},m.prototype[Symbol.dispose]=function(){this.dispose()},m.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function p(n,s){this.type=n,this.g=this.target=s,this.defaultPrevented=!1}p.prototype.h=function(){this.defaultPrevented=!0};var I=function(){if(!h.addEventListener||!Object.defineProperty)return!1;var n=!1,s=Object.defineProperty({},"passive",{get:function(){n=!0}});try{const a=()=>{};h.addEventListener("test",a,s),h.removeEventListener("test",a,s)}catch{}return n}();function d(n){return/^[\s\xa0]*$/.test(n)}function K(n,s){p.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n&&this.init(n,s)}S(K,p),K.prototype.init=function(n,s){const a=this.type=n.type,l=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;this.target=n.target||n.srcElement,this.g=s,s=n.relatedTarget,s||(a=="mouseover"?s=n.fromElement:a=="mouseout"&&(s=n.toElement)),this.relatedTarget=s,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=n.pointerType,this.state=n.state,this.i=n,n.defaultPrevented&&K.Z.h.call(this)},K.prototype.h=function(){K.Z.h.call(this);const n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var xe="closure_listenable_"+(Math.random()*1e6|0),Po=0;function Ro(n,s,a,l,_){this.listener=n,this.proxy=null,this.src=s,this.type=a,this.capture=!!l,this.ha=_,this.key=++Po,this.da=this.fa=!1}function qt(n){n.da=!0,n.listener=null,n.proxy=null,n.src=null,n.ha=null}function Kt(n,s,a){for(const l in n)s.call(a,n[l],l,n)}function Co(n,s){for(const a in n)s.call(void 0,n[a],a,n)}function Ui(n){const s={};for(const a in n)s[a]=n[a];return s}const xi="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Fi(n,s){let a,l;for(let _=1;_<arguments.length;_++){l=arguments[_];for(a in l)n[a]=l[a];for(let w=0;w<xi.length;w++)a=xi[w],Object.prototype.hasOwnProperty.call(l,a)&&(n[a]=l[a])}}function Jt(n){this.src=n,this.g={},this.h=0}Jt.prototype.add=function(n,s,a,l,_){const w=n.toString();n=this.g[w],n||(n=this.g[w]=[],this.h++);const T=Cn(n,s,l,_);return T>-1?(s=n[T],a||(s.fa=!1)):(s=new Ro(s,this.src,w,!!l,_),s.fa=a,n.push(s)),s};function Rn(n,s){const a=s.type;if(a in n.g){var l=n.g[a],_=Array.prototype.indexOf.call(l,s,void 0),w;(w=_>=0)&&Array.prototype.splice.call(l,_,1),w&&(qt(s),n.g[a].length==0&&(delete n.g[a],n.h--))}}function Cn(n,s,a,l){for(let _=0;_<n.length;++_){const w=n[_];if(!w.da&&w.listener==s&&w.capture==!!a&&w.ha==l)return _}return-1}var kn="closure_lm_"+(Math.random()*1e6|0),On={};function Vi(n,s,a,l,_){if(Array.isArray(s)){for(let w=0;w<s.length;w++)Vi(n,s[w],a,l,_);return null}return a=Hi(a),n&&n[xe]?n.J(s,a,y(l)?!!l.capture:!1,_):ko(n,s,a,!1,l,_)}function ko(n,s,a,l,_,w){if(!s)throw Error("Invalid event type");const T=y(_)?!!_.capture:!!_;let P=Dn(n);if(P||(n[kn]=P=new Jt(n)),a=P.add(s,a,l,T,w),a.proxy)return a;if(l=Oo(),a.proxy=l,l.src=n,l.listener=a,n.addEventListener)I||(_=T),_===void 0&&(_=!1),n.addEventListener(s.toString(),l,_);else if(n.attachEvent)n.attachEvent(Bi(s.toString()),l);else if(n.addListener&&n.removeListener)n.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Oo(){function n(a){return s.call(n.src,n.listener,a)}const s=No;return n}function ji(n,s,a,l,_){if(Array.isArray(s))for(var w=0;w<s.length;w++)ji(n,s[w],a,l,_);else l=y(l)?!!l.capture:!!l,a=Hi(a),n&&n[xe]?(n=n.i,w=String(s).toString(),w in n.g&&(s=n.g[w],a=Cn(s,a,l,_),a>-1&&(qt(s[a]),Array.prototype.splice.call(s,a,1),s.length==0&&(delete n.g[w],n.h--)))):n&&(n=Dn(n))&&(s=n.g[s.toString()],n=-1,s&&(n=Cn(s,a,l,_)),(a=n>-1?s[n]:null)&&Nn(a))}function Nn(n){if(typeof n!="number"&&n&&!n.da){var s=n.src;if(s&&s[xe])Rn(s.i,n);else{var a=n.type,l=n.proxy;s.removeEventListener?s.removeEventListener(a,l,n.capture):s.detachEvent?s.detachEvent(Bi(a),l):s.addListener&&s.removeListener&&s.removeListener(l),(a=Dn(s))?(Rn(a,n),a.h==0&&(a.src=null,s[kn]=null)):qt(n)}}}function Bi(n){return n in On?On[n]:On[n]="on"+n}function No(n,s){if(n.da)n=!0;else{s=new K(s,this);const a=n.listener,l=n.ha||n.src;n.fa&&Nn(n),n=a.call(l,s)}return n}function Dn(n){return n=n[kn],n instanceof Jt?n:null}var Ln="__closure_events_fn_"+(Math.random()*1e9>>>0);function Hi(n){return typeof n=="function"?n:(n[Ln]||(n[Ln]=function(s){return n.handleEvent(s)}),n[Ln])}function $(){m.call(this),this.i=new Jt(this),this.M=this,this.G=null}S($,m),$.prototype[xe]=!0,$.prototype.removeEventListener=function(n,s,a,l){ji(this,n,s,a,l)};function W(n,s){var a,l=n.G;if(l)for(a=[];l;l=l.G)a.push(l);if(n=n.M,l=s.type||s,typeof s=="string")s=new p(s,n);else if(s instanceof p)s.target=s.target||n;else{var _=s;s=new p(l,n),Fi(s,_)}_=!0;let w,T;if(a)for(T=a.length-1;T>=0;T--)w=s.g=a[T],_=Xt(w,l,!0,s)&&_;if(w=s.g=n,_=Xt(w,l,!0,s)&&_,_=Xt(w,l,!1,s)&&_,a)for(T=0;T<a.length;T++)w=s.g=a[T],_=Xt(w,l,!1,s)&&_}$.prototype.N=function(){if($.Z.N.call(this),this.i){var n=this.i;for(const s in n.g){const a=n.g[s];for(let l=0;l<a.length;l++)qt(a[l]);delete n.g[s],n.h--}}this.G=null},$.prototype.J=function(n,s,a,l){return this.i.add(String(n),s,!1,a,l)},$.prototype.K=function(n,s,a,l){return this.i.add(String(n),s,!0,a,l)};function Xt(n,s,a,l){if(s=n.i.g[String(s)],!s)return!0;s=s.concat();let _=!0;for(let w=0;w<s.length;++w){const T=s[w];if(T&&!T.da&&T.capture==a){const P=T.listener,V=T.ha||T.src;T.fa&&Rn(n.i,T),_=P.call(V,l)!==!1&&_}}return _&&!l.defaultPrevented}function Do(n,s){if(typeof n!="function")if(n&&typeof n.handleEvent=="function")n=v(n.handleEvent,n);else throw Error("Invalid listener argument");return Number(s)>2147483647?-1:h.setTimeout(n,s||0)}function $i(n){n.g=Do(()=>{n.g=null,n.i&&(n.i=!1,$i(n))},n.l);const s=n.h;n.h=null,n.m.apply(null,s)}class Lo extends m{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:$i(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function pt(n){m.call(this),this.h=n,this.g={}}S(pt,m);var Wi=[];function Gi(n){Kt(n.g,function(s,a){this.g.hasOwnProperty(a)&&Nn(s)},n),n.g={}}pt.prototype.N=function(){pt.Z.N.call(this),Gi(this)},pt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Mn=h.JSON.stringify,Mo=h.JSON.parse,Uo=class{stringify(n){return h.JSON.stringify(n,void 0)}parse(n){return h.JSON.parse(n,void 0)}};function zi(){}function xo(){}var gt={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Un(){p.call(this,"d")}S(Un,p);function xn(){p.call(this,"c")}S(xn,p);var Ze={},qi=null;function Fn(){return qi=qi||new $}Ze.Ia="serverreachability";function Ki(n){p.call(this,Ze.Ia,n)}S(Ki,p);function mt(n){const s=Fn();W(s,new Ki(s))}Ze.STAT_EVENT="statevent";function Ji(n,s){p.call(this,Ze.STAT_EVENT,n),this.stat=s}S(Ji,p);function G(n){const s=Fn();W(s,new Ji(s,n))}Ze.Ja="timingevent";function Xi(n,s){p.call(this,Ze.Ja,n),this.size=s}S(Xi,p);function _t(n,s){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){n()},s)}function yt(){this.g=!0}yt.prototype.ua=function(){this.g=!1};function Fo(n,s,a,l,_,w){n.info(function(){if(n.g)if(w){var T="",P=w.split("&");for(let N=0;N<P.length;N++){var V=P[N].split("=");if(V.length>1){const j=V[0];V=V[1];const se=j.split("_");T=se.length>=2&&se[1]=="type"?T+(j+"="+V+"&"):T+(j+"=redacted&")}}}else T=null;else T=w;return"XMLHTTP REQ ("+l+") [attempt "+_+"]: "+s+`
`+a+`
`+T})}function Vo(n,s,a,l,_,w,T){n.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+_+"]: "+s+`
`+a+`
`+w+" "+T})}function et(n,s,a,l){n.info(function(){return"XMLHTTP TEXT ("+s+"): "+Bo(n,a)+(l?" "+l:"")})}function jo(n,s){n.info(function(){return"TIMEOUT: "+s})}yt.prototype.info=function(){};function Bo(n,s){if(!n.g)return s;if(!s)return null;try{const w=JSON.parse(s);if(w){for(n=0;n<w.length;n++)if(Array.isArray(w[n])){var a=w[n];if(!(a.length<2)){var l=a[1];if(Array.isArray(l)&&!(l.length<1)){var _=l[0];if(_!="noop"&&_!="stop"&&_!="close")for(let T=1;T<l.length;T++)l[T]=""}}}}return Mn(w)}catch{return s}}var Vn={NO_ERROR:0,TIMEOUT:8},Ho={},Yi;function jn(){}S(jn,zi),jn.prototype.g=function(){return new XMLHttpRequest},Yi=new jn;function It(n){return encodeURIComponent(String(n))}function $o(n){var s=1;n=n.split(":");const a=[];for(;s>0&&n.length;)a.push(n.shift()),s--;return n.length&&a.push(n.join(":")),a}function we(n,s,a,l){this.j=n,this.i=s,this.l=a,this.S=l||1,this.V=new pt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Qi}function Qi(){this.i=null,this.g="",this.h=!1}var Zi={},Bn={};function Hn(n,s,a){n.M=1,n.A=Qt(re(s)),n.u=a,n.R=!0,er(n,null)}function er(n,s){n.F=Date.now(),Yt(n),n.B=re(n.A);var a=n.B,l=n.S;Array.isArray(l)||(l=[String(l)]),fr(a.i,"t",l),n.C=0,a=n.j.L,n.h=new Qi,n.g=Or(n.j,a?s:null,!n.u),n.P>0&&(n.O=new Lo(v(n.Y,n,n.g),n.P)),s=n.V,a=n.g,l=n.ba;var _="readystatechange";Array.isArray(_)||(_&&(Wi[0]=_.toString()),_=Wi);for(let w=0;w<_.length;w++){const T=Vi(a,_[w],l||s.handleEvent,!1,s.h||s);if(!T)break;s.g[T.key]=T}s=n.J?Ui(n.J):{},n.u?(n.v||(n.v="POST"),s["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.B,n.v,n.u,s)):(n.v="GET",n.g.ea(n.B,n.v,null,s)),mt(),Fo(n.i,n.v,n.B,n.l,n.S,n.u)}we.prototype.ba=function(n){n=n.target;const s=this.O;s&&Te(n)==3?s.j():this.Y(n)},we.prototype.Y=function(n){try{if(n==this.g)e:{const P=Te(this.g),V=this.g.ya(),N=this.g.ca();if(!(P<3)&&(P!=3||this.g&&(this.h.h||this.g.la()||wr(this.g)))){this.K||P!=4||V==7||(V==8||N<=0?mt(3):mt(2)),$n(this);var s=this.g.ca();this.X=s;var a=Wo(this);if(this.o=s==200,Vo(this.i,this.v,this.B,this.l,this.S,P,s),this.o){if(this.U&&!this.L){t:{if(this.g){var l,_=this.g;if((l=_.g?_.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!d(l)){var w=l;break t}}w=null}if(n=w)et(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Wn(this,n);else{this.o=!1,this.m=3,G(12),Fe(this),wt(this);break e}}if(this.R){n=!0;let j;for(;!this.K&&this.C<a.length;)if(j=Go(this,a),j==Bn){P==4&&(this.m=4,G(14),n=!1),et(this.i,this.l,null,"[Incomplete Response]");break}else if(j==Zi){this.m=4,G(15),et(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}else et(this.i,this.l,j,null),Wn(this,j);if(tr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),P!=4||a.length!=0||this.h.h||(this.m=1,G(16),n=!1),this.o=this.o&&n,!n)et(this.i,this.l,a,"[Invalid Chunked Response]"),Fe(this),wt(this);else if(a.length>0&&!this.W){this.W=!0;var T=this.j;T.g==this&&T.aa&&!T.P&&(T.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),Qn(T),T.P=!0,G(11))}}else et(this.i,this.l,a,null),Wn(this,a);P==4&&Fe(this),this.o&&!this.K&&(P==4?Pr(this.j,this):(this.o=!1,Yt(this)))}else sa(this.g),s==400&&a.indexOf("Unknown SID")>0?(this.m=3,G(12)):(this.m=0,G(13)),Fe(this),wt(this)}}}catch{}finally{}};function Wo(n){if(!tr(n))return n.g.la();const s=wr(n.g);if(s==="")return"";let a="";const l=s.length,_=Te(n.g)==4;if(!n.h.i){if(typeof TextDecoder>"u")return Fe(n),wt(n),"";n.h.i=new h.TextDecoder}for(let w=0;w<l;w++)n.h.h=!0,a+=n.h.i.decode(s[w],{stream:!(_&&w==l-1)});return s.length=0,n.h.g+=a,n.C=0,n.h.g}function tr(n){return n.g?n.v=="GET"&&n.M!=2&&n.j.Aa:!1}function Go(n,s){var a=n.C,l=s.indexOf(`
`,a);return l==-1?Bn:(a=Number(s.substring(a,l)),isNaN(a)?Zi:(l+=1,l+a>s.length?Bn:(s=s.slice(l,l+a),n.C=l+a,s)))}we.prototype.cancel=function(){this.K=!0,Fe(this)};function Yt(n){n.T=Date.now()+n.H,nr(n,n.H)}function nr(n,s){if(n.D!=null)throw Error("WatchDog timer not null");n.D=_t(v(n.aa,n),s)}function $n(n){n.D&&(h.clearTimeout(n.D),n.D=null)}we.prototype.aa=function(){this.D=null;const n=Date.now();n-this.T>=0?(jo(this.i,this.B),this.M!=2&&(mt(),G(17)),Fe(this),this.m=2,wt(this)):nr(this,this.T-n)};function wt(n){n.j.I==0||n.K||Pr(n.j,n)}function Fe(n){$n(n);var s=n.O;s&&typeof s.dispose=="function"&&s.dispose(),n.O=null,Gi(n.V),n.g&&(s=n.g,n.g=null,s.abort(),s.dispose())}function Wn(n,s){try{var a=n.j;if(a.I!=0&&(a.g==n||Gn(a.h,n))){if(!n.L&&Gn(a.h,n)&&a.I==3){try{var l=a.Ba.g.parse(s)}catch{l=null}if(Array.isArray(l)&&l.length==3){var _=l;if(_[0]==0){e:if(!a.v){if(a.g)if(a.g.F+3e3<n.F)rn(a),tn(a);else break e;Yn(a),G(18)}}else a.xa=_[1],0<a.xa-a.K&&_[2]<37500&&a.F&&a.A==0&&!a.C&&(a.C=_t(v(a.Va,a),6e3));sr(a.h)<=1&&a.ta&&(a.ta=void 0)}else je(a,11)}else if((n.L||a.g==n)&&rn(a),!d(s))for(_=a.Ba.g.parse(s),s=0;s<_.length;s++){let N=_[s];const j=N[0];if(!(j<=a.K))if(a.K=j,N=N[1],a.I==2)if(N[0]=="c"){a.M=N[1],a.ba=N[2];const se=N[3];se!=null&&(a.ka=se,a.j.info("VER="+a.ka));const Be=N[4];Be!=null&&(a.za=Be,a.j.info("SVER="+a.za));const Se=N[5];Se!=null&&typeof Se=="number"&&Se>0&&(l=1.5*Se,a.O=l,a.j.info("backChannelRequestTimeoutMs_="+l)),l=a;const Ae=n.g;if(Ae){const sn=Ae.g?Ae.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(sn){var w=l.h;w.g||sn.indexOf("spdy")==-1&&sn.indexOf("quic")==-1&&sn.indexOf("h2")==-1||(w.j=w.l,w.g=new Set,w.h&&(zn(w,w.h),w.h=null))}if(l.G){const Zn=Ae.g?Ae.g.getResponseHeader("X-HTTP-Session-Id"):null;Zn&&(l.wa=Zn,L(l.J,l.G,Zn))}}a.I=3,a.l&&a.l.ra(),a.aa&&(a.T=Date.now()-n.F,a.j.info("Handshake RTT: "+a.T+"ms")),l=a;var T=n;if(l.na=kr(l,l.L?l.ba:null,l.W),T.L){or(l.h,T);var P=T,V=l.O;V&&(P.H=V),P.D&&($n(P),Yt(P)),l.g=T}else Ar(l);a.i.length>0&&nn(a)}else N[0]!="stop"&&N[0]!="close"||je(a,7);else a.I==3&&(N[0]=="stop"||N[0]=="close"?N[0]=="stop"?je(a,7):Xn(a):N[0]!="noop"&&a.l&&a.l.qa(N),a.A=0)}}mt(4)}catch{}}var zo=class{constructor(n,s){this.g=n,this.map=s}};function ir(n){this.l=n||10,h.PerformanceNavigationTiming?(n=h.performance.getEntriesByType("navigation"),n=n.length>0&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=n?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function rr(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function sr(n){return n.h?1:n.g?n.g.size:0}function Gn(n,s){return n.h?n.h==s:n.g?n.g.has(s):!1}function zn(n,s){n.g?n.g.add(s):n.h=s}function or(n,s){n.h&&n.h==s?n.h=null:n.g&&n.g.has(s)&&n.g.delete(s)}ir.prototype.cancel=function(){if(this.i=ar(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function ar(n){if(n.h!=null)return n.i.concat(n.h.G);if(n.g!=null&&n.g.size!==0){let s=n.i;for(const a of n.g.values())s=s.concat(a.G);return s}return H(n.i)}var cr=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function qo(n,s){if(n){n=n.split("&");for(let a=0;a<n.length;a++){const l=n[a].indexOf("=");let _,w=null;l>=0?(_=n[a].substring(0,l),w=n[a].substring(l+1)):_=n[a],s(_,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Ee(n){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let s;n instanceof Ee?(this.l=n.l,Et(this,n.j),this.o=n.o,this.g=n.g,vt(this,n.u),this.h=n.h,qn(this,pr(n.i)),this.m=n.m):n&&(s=String(n).match(cr))?(this.l=!1,Et(this,s[1]||"",!0),this.o=Tt(s[2]||""),this.g=Tt(s[3]||"",!0),vt(this,s[4]),this.h=Tt(s[5]||"",!0),qn(this,s[6]||"",!0),this.m=Tt(s[7]||"")):(this.l=!1,this.i=new At(null,this.l))}Ee.prototype.toString=function(){const n=[];var s=this.j;s&&n.push(St(s,hr,!0),":");var a=this.g;return(a||s=="file")&&(n.push("//"),(s=this.o)&&n.push(St(s,hr,!0),"@"),n.push(It(a).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.u,a!=null&&n.push(":",String(a))),(a=this.h)&&(this.g&&a.charAt(0)!="/"&&n.push("/"),n.push(St(a,a.charAt(0)=="/"?Xo:Jo,!0))),(a=this.i.toString())&&n.push("?",a),(a=this.m)&&n.push("#",St(a,Qo)),n.join("")},Ee.prototype.resolve=function(n){const s=re(this);let a=!!n.j;a?Et(s,n.j):a=!!n.o,a?s.o=n.o:a=!!n.g,a?s.g=n.g:a=n.u!=null;var l=n.h;if(a)vt(s,n.u);else if(a=!!n.h){if(l.charAt(0)!="/")if(this.g&&!this.h)l="/"+l;else{var _=s.h.lastIndexOf("/");_!=-1&&(l=s.h.slice(0,_+1)+l)}if(_=l,_==".."||_==".")l="";else if(_.indexOf("./")!=-1||_.indexOf("/.")!=-1){l=_.lastIndexOf("/",0)==0,_=_.split("/");const w=[];for(let T=0;T<_.length;){const P=_[T++];P=="."?l&&T==_.length&&w.push(""):P==".."?((w.length>1||w.length==1&&w[0]!="")&&w.pop(),l&&T==_.length&&w.push("")):(w.push(P),l=!0)}l=w.join("/")}else l=_}return a?s.h=l:a=n.i.toString()!=="",a?qn(s,pr(n.i)):a=!!n.m,a&&(s.m=n.m),s};function re(n){return new Ee(n)}function Et(n,s,a){n.j=a?Tt(s,!0):s,n.j&&(n.j=n.j.replace(/:$/,""))}function vt(n,s){if(s){if(s=Number(s),isNaN(s)||s<0)throw Error("Bad port number "+s);n.u=s}else n.u=null}function qn(n,s,a){s instanceof At?(n.i=s,Zo(n.i,n.l)):(a||(s=St(s,Yo)),n.i=new At(s,n.l))}function L(n,s,a){n.i.set(s,a)}function Qt(n){return L(n,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),n}function Tt(n,s){return n?s?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function St(n,s,a){return typeof n=="string"?(n=encodeURI(n).replace(s,Ko),a&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function Ko(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var hr=/[#\/\?@]/g,Jo=/[#\?:]/g,Xo=/[#\?]/g,Yo=/[#\?@]/g,Qo=/#/g;function At(n,s){this.h=this.g=null,this.i=n||null,this.j=!!s}function Ve(n){n.g||(n.g=new Map,n.h=0,n.i&&qo(n.i,function(s,a){n.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}i=At.prototype,i.add=function(n,s){Ve(this),this.i=null,n=tt(this,n);let a=this.g.get(n);return a||this.g.set(n,a=[]),a.push(s),this.h+=1,this};function lr(n,s){Ve(n),s=tt(n,s),n.g.has(s)&&(n.i=null,n.h-=n.g.get(s).length,n.g.delete(s))}function ur(n,s){return Ve(n),s=tt(n,s),n.g.has(s)}i.forEach=function(n,s){Ve(this),this.g.forEach(function(a,l){a.forEach(function(_){n.call(s,_,l,this)},this)},this)};function dr(n,s){Ve(n);let a=[];if(typeof s=="string")ur(n,s)&&(a=a.concat(n.g.get(tt(n,s))));else for(n=Array.from(n.g.values()),s=0;s<n.length;s++)a=a.concat(n[s]);return a}i.set=function(n,s){return Ve(this),this.i=null,n=tt(this,n),ur(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[s]),this.h+=1,this},i.get=function(n,s){return n?(n=dr(this,n),n.length>0?String(n[0]):s):s};function fr(n,s,a){lr(n,s),a.length>0&&(n.i=null,n.g.set(tt(n,s),H(a)),n.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const n=[],s=Array.from(this.g.keys());for(let l=0;l<s.length;l++){var a=s[l];const _=It(a);a=dr(this,a);for(let w=0;w<a.length;w++){let T=_;a[w]!==""&&(T+="="+It(a[w])),n.push(T)}}return this.i=n.join("&")};function pr(n){const s=new At;return s.i=n.i,n.g&&(s.g=new Map(n.g),s.h=n.h),s}function tt(n,s){return s=String(s),n.j&&(s=s.toLowerCase()),s}function Zo(n,s){s&&!n.j&&(Ve(n),n.i=null,n.g.forEach(function(a,l){const _=l.toLowerCase();l!=_&&(lr(this,l),fr(this,_,a))},n)),n.j=s}function ea(n,s){const a=new yt;if(h.Image){const l=new Image;l.onload=b(ve,a,"TestLoadImage: loaded",!0,s,l),l.onerror=b(ve,a,"TestLoadImage: error",!1,s,l),l.onabort=b(ve,a,"TestLoadImage: abort",!1,s,l),l.ontimeout=b(ve,a,"TestLoadImage: timeout",!1,s,l),h.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=n}else s(!1)}function ta(n,s){const a=new yt,l=new AbortController,_=setTimeout(()=>{l.abort(),ve(a,"TestPingServer: timeout",!1,s)},1e4);fetch(n,{signal:l.signal}).then(w=>{clearTimeout(_),w.ok?ve(a,"TestPingServer: ok",!0,s):ve(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(_),ve(a,"TestPingServer: error",!1,s)})}function ve(n,s,a,l,_){try{_&&(_.onload=null,_.onerror=null,_.onabort=null,_.ontimeout=null),l(a)}catch{}}function na(){this.g=new Uo}function Kn(n){this.i=n.Sb||null,this.h=n.ab||!1}S(Kn,zi),Kn.prototype.g=function(){return new Zt(this.i,this.h)};function Zt(n,s){$.call(this),this.H=n,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}S(Zt,$),i=Zt.prototype,i.open=function(n,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=n,this.D=s,this.readyState=1,Pt(this)},i.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const s={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};n&&(s.body=n),(this.H||h).fetch(new Request(this.D,s)).then(this.Pa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,bt(this)),this.readyState=0},i.Pa=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,Pt(this)),this.g&&(this.readyState=3,Pt(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;gr(this)}else n.text().then(this.Oa.bind(this),this.ga.bind(this))};function gr(n){n.j.read().then(n.Ma.bind(n)).catch(n.ga.bind(n))}i.Ma=function(n){if(this.g){if(this.o&&n.value)this.response.push(n.value);else if(!this.o){var s=n.value?n.value:new Uint8Array(0);(s=this.B.decode(s,{stream:!n.done}))&&(this.response=this.responseText+=s)}n.done?bt(this):Pt(this),this.readyState==3&&gr(this)}},i.Oa=function(n){this.g&&(this.response=this.responseText=n,bt(this))},i.Na=function(n){this.g&&(this.response=n,bt(this))},i.ga=function(){this.g&&bt(this)};function bt(n){n.readyState=4,n.l=null,n.j=null,n.B=null,Pt(n)}i.setRequestHeader=function(n,s){this.A.append(n,s)},i.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,n.push(a[0]+": "+a[1]),a=s.next();return n.join(`\r
`)};function Pt(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(Zt.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});function mr(n){let s="";return Kt(n,function(a,l){s+=l,s+=":",s+=a,s+=`\r
`}),s}function Jn(n,s,a){e:{for(l in a){var l=!1;break e}l=!0}l||(a=mr(a),typeof n=="string"?a!=null&&It(a):L(n,s,a))}function U(n){$.call(this),this.headers=new Map,this.L=n||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}S(U,$);var ia=/^https?$/i,ra=["POST","PUT"];i=U.prototype,i.Fa=function(n){this.H=n},i.ea=function(n,s,a,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+n);s=s?s.toUpperCase():"GET",this.D=n,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Yi.g(),this.g.onreadystatechange=D(v(this.Ca,this));try{this.B=!0,this.g.open(s,String(n),!0),this.B=!1}catch(w){_r(this,w);return}if(n=a||"",a=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var _ in l)a.set(_,l[_]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const w of l.keys())a.set(w,l.get(w));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(a.keys()).find(w=>w.toLowerCase()=="content-type"),_=h.FormData&&n instanceof h.FormData,!(Array.prototype.indexOf.call(ra,s,void 0)>=0)||l||_||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[w,T]of a)this.g.setRequestHeader(w,T);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(n),this.v=!1}catch(w){_r(this,w)}};function _r(n,s){n.h=!1,n.g&&(n.j=!0,n.g.abort(),n.j=!1),n.l=s,n.o=5,yr(n),en(n)}function yr(n){n.A||(n.A=!0,W(n,"complete"),W(n,"error"))}i.abort=function(n){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=n||7,W(this,"complete"),W(this,"abort"),en(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),en(this,!0)),U.Z.N.call(this)},i.Ca=function(){this.u||(this.B||this.v||this.j?Ir(this):this.Xa())},i.Xa=function(){Ir(this)};function Ir(n){if(n.h&&typeof c<"u"){if(n.v&&Te(n)==4)setTimeout(n.Ca.bind(n),0);else if(W(n,"readystatechange"),Te(n)==4){n.h=!1;try{const w=n.ca();e:switch(w){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break e;default:s=!1}var a;if(!(a=s)){var l;if(l=w===0){let T=String(n.D).match(cr)[1]||null;!T&&h.self&&h.self.location&&(T=h.self.location.protocol.slice(0,-1)),l=!ia.test(T?T.toLowerCase():"")}a=l}if(a)W(n,"complete"),W(n,"success");else{n.o=6;try{var _=Te(n)>2?n.g.statusText:""}catch{_=""}n.l=_+" ["+n.ca()+"]",yr(n)}}finally{en(n)}}}}function en(n,s){if(n.g){n.m&&(clearTimeout(n.m),n.m=null);const a=n.g;n.g=null,s||W(n,"ready");try{a.onreadystatechange=null}catch{}}}i.isActive=function(){return!!this.g};function Te(n){return n.g?n.g.readyState:0}i.ca=function(){try{return Te(this)>2?this.g.status:-1}catch{return-1}},i.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.La=function(n){if(this.g){var s=this.g.responseText;return n&&s.indexOf(n)==0&&(s=s.substring(n.length)),Mo(s)}};function wr(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.F){case"":case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}function sa(n){const s={};n=(n.g&&Te(n)>=2&&n.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<n.length;l++){if(d(n[l]))continue;var a=$o(n[l]);const _=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const w=s[_]||[];s[_]=w,w.push(a)}Co(s,function(l){return l.join(", ")})}i.ya=function(){return this.o},i.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Rt(n,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[n]||s}function Er(n){this.za=0,this.i=[],this.j=new yt,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Rt("failFast",!1,n),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Rt("baseRetryDelayMs",5e3,n),this.Za=Rt("retryDelaySeedMs",1e4,n),this.Ta=Rt("forwardChannelMaxRetries",2,n),this.va=Rt("forwardChannelRequestTimeoutMs",2e4,n),this.ma=n&&n.xmlHttpFactory||void 0,this.Ua=n&&n.Rb||void 0,this.Aa=n&&n.useFetchStreams||!1,this.O=void 0,this.L=n&&n.supportsCrossDomainXhr||!1,this.M="",this.h=new ir(n&&n.concurrentRequestLimit),this.Ba=new na,this.S=n&&n.fastHandshake||!1,this.R=n&&n.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=n&&n.Pb||!1,n&&n.ua&&this.j.ua(),n&&n.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&n&&n.detectBufferingProxy||!1,this.ia=void 0,n&&n.longPollingTimeout&&n.longPollingTimeout>0&&(this.ia=n.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}i=Er.prototype,i.ka=8,i.I=1,i.connect=function(n,s,a,l){G(0),this.W=n,this.H=s||{},a&&l!==void 0&&(this.H.OSID=a,this.H.OAID=l),this.F=this.X,this.J=kr(this,null,this.W),nn(this)};function Xn(n){if(vr(n),n.I==3){var s=n.V++,a=re(n.J);if(L(a,"SID",n.M),L(a,"RID",s),L(a,"TYPE","terminate"),Ct(n,a),s=new we(n,n.j,s),s.M=2,s.A=Qt(re(a)),a=!1,h.navigator&&h.navigator.sendBeacon)try{a=h.navigator.sendBeacon(s.A.toString(),"")}catch{}!a&&h.Image&&(new Image().src=s.A,a=!0),a||(s.g=Or(s.j,null),s.g.ea(s.A)),s.F=Date.now(),Yt(s)}Cr(n)}function tn(n){n.g&&(Qn(n),n.g.cancel(),n.g=null)}function vr(n){tn(n),n.v&&(h.clearTimeout(n.v),n.v=null),rn(n),n.h.cancel(),n.m&&(typeof n.m=="number"&&h.clearTimeout(n.m),n.m=null)}function nn(n){if(!rr(n.h)&&!n.m){n.m=!0;var s=n.Ea;Ie||u(),J||(Ie(),J=!0),g.add(s,n),n.D=0}}function oa(n,s){return sr(n.h)>=n.h.j-(n.m?1:0)?!1:n.m?(n.i=s.G.concat(n.i),!0):n.I==1||n.I==2||n.D>=(n.Sa?0:n.Ta)?!1:(n.m=_t(v(n.Ea,n,s),Rr(n,n.D)),n.D++,!0)}i.Ea=function(n){if(this.m)if(this.m=null,this.I==1){if(!n){this.V=Math.floor(Math.random()*1e5),n=this.V++;const _=new we(this,this.j,n);let w=this.o;if(this.U&&(w?(w=Ui(w),Fi(w,this.U)):w=this.U),this.u!==null||this.R||(_.J=w,w=null),this.S)e:{for(var s=0,a=0;a<this.i.length;a++){t:{var l=this.i[a];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(s+=l,s>4096){s=a;break e}if(s===4096||a===this.i.length-1){s=a+1;break e}}s=1e3}else s=1e3;s=Sr(this,_,s),a=re(this.J),L(a,"RID",n),L(a,"CVER",22),this.G&&L(a,"X-HTTP-Session-Id",this.G),Ct(this,a),w&&(this.R?s="headers="+It(mr(w))+"&"+s:this.u&&Jn(a,this.u,w)),zn(this.h,_),this.Ra&&L(a,"TYPE","init"),this.S?(L(a,"$req",s),L(a,"SID","null"),_.U=!0,Hn(_,a,null)):Hn(_,a,s),this.I=2}}else this.I==3&&(n?Tr(this,n):this.i.length==0||rr(this.h)||Tr(this))};function Tr(n,s){var a;s?a=s.l:a=n.V++;const l=re(n.J);L(l,"SID",n.M),L(l,"RID",a),L(l,"AID",n.K),Ct(n,l),n.u&&n.o&&Jn(l,n.u,n.o),a=new we(n,n.j,a,n.D+1),n.u===null&&(a.J=n.o),s&&(n.i=s.G.concat(n.i)),s=Sr(n,a,1e3),a.H=Math.round(n.va*.5)+Math.round(n.va*.5*Math.random()),zn(n.h,a),Hn(a,l,s)}function Ct(n,s){n.H&&Kt(n.H,function(a,l){L(s,l,a)}),n.l&&Kt({},function(a,l){L(s,l,a)})}function Sr(n,s,a){a=Math.min(n.i.length,a);const l=n.l?v(n.l.Ka,n.l,n):null;e:{var _=n.i;let P=-1;for(;;){const V=["count="+a];P==-1?a>0?(P=_[0].g,V.push("ofs="+P)):P=0:V.push("ofs="+P);let N=!0;for(let j=0;j<a;j++){var w=_[j].g;const se=_[j].map;if(w-=P,w<0)P=Math.max(0,_[j].g-100),N=!1;else try{w="req"+w+"_"||"";try{var T=se instanceof Map?se:Object.entries(se);for(const[Be,Se]of T){let Ae=Se;y(Se)&&(Ae=Mn(Se)),V.push(w+Be+"="+encodeURIComponent(Ae))}}catch(Be){throw V.push(w+"type="+encodeURIComponent("_badmap")),Be}}catch{l&&l(se)}}if(N){T=V.join("&");break e}}T=void 0}return n=n.i.splice(0,a),s.G=n,T}function Ar(n){if(!n.g&&!n.v){n.Y=1;var s=n.Da;Ie||u(),J||(Ie(),J=!0),g.add(s,n),n.A=0}}function Yn(n){return n.g||n.v||n.A>=3?!1:(n.Y++,n.v=_t(v(n.Da,n),Rr(n,n.A)),n.A++,!0)}i.Da=function(){if(this.v=null,br(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var n=4*this.T;this.j.info("BP detection timer enabled: "+n),this.B=_t(v(this.Wa,this),n)}},i.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,G(10),tn(this),br(this))};function Qn(n){n.B!=null&&(h.clearTimeout(n.B),n.B=null)}function br(n){n.g=new we(n,n.j,"rpc",n.Y),n.u===null&&(n.g.J=n.o),n.g.P=0;var s=re(n.na);L(s,"RID","rpc"),L(s,"SID",n.M),L(s,"AID",n.K),L(s,"CI",n.F?"0":"1"),!n.F&&n.ia&&L(s,"TO",n.ia),L(s,"TYPE","xmlhttp"),Ct(n,s),n.u&&n.o&&Jn(s,n.u,n.o),n.O&&(n.g.H=n.O);var a=n.g;n=n.ba,a.M=1,a.A=Qt(re(s)),a.u=null,a.R=!0,er(a,n)}i.Va=function(){this.C!=null&&(this.C=null,tn(this),Yn(this),G(19))};function rn(n){n.C!=null&&(h.clearTimeout(n.C),n.C=null)}function Pr(n,s){var a=null;if(n.g==s){rn(n),Qn(n),n.g=null;var l=2}else if(Gn(n.h,s))a=s.G,or(n.h,s),l=1;else return;if(n.I!=0){if(s.o)if(l==1){a=s.u?s.u.length:0,s=Date.now()-s.F;var _=n.D;l=Fn(),W(l,new Xi(l,a)),nn(n)}else Ar(n);else if(_=s.m,_==3||_==0&&s.X>0||!(l==1&&oa(n,s)||l==2&&Yn(n)))switch(a&&a.length>0&&(s=n.h,s.i=s.i.concat(a)),_){case 1:je(n,5);break;case 4:je(n,10);break;case 3:je(n,6);break;default:je(n,2)}}}function Rr(n,s){let a=n.Qa+Math.floor(Math.random()*n.Za);return n.isActive()||(a*=2),a*s}function je(n,s){if(n.j.info("Error code "+s),s==2){var a=v(n.bb,n),l=n.Ua;const _=!l;l=new Ee(l||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Et(l,"https"),Qt(l),_?ea(l.toString(),a):ta(l.toString(),a)}else G(2);n.I=0,n.l&&n.l.pa(s),Cr(n),vr(n)}i.bb=function(n){n?(this.j.info("Successfully pinged google.com"),G(2)):(this.j.info("Failed to ping google.com"),G(1))};function Cr(n){if(n.I=0,n.ja=[],n.l){const s=ar(n.h);(s.length!=0||n.i.length!=0)&&(x(n.ja,s),x(n.ja,n.i),n.h.i.length=0,H(n.i),n.i.length=0),n.l.oa()}}function kr(n,s,a){var l=a instanceof Ee?re(a):new Ee(a);if(l.g!="")s&&(l.g=s+"."+l.g),vt(l,l.u);else{var _=h.location;l=_.protocol,s=s?s+"."+_.hostname:_.hostname,_=+_.port;const w=new Ee(null);l&&Et(w,l),s&&(w.g=s),_&&vt(w,_),a&&(w.h=a),l=w}return a=n.G,s=n.wa,a&&s&&L(l,a,s),L(l,"VER",n.ka),Ct(n,l),l}function Or(n,s,a){if(s&&!n.L)throw Error("Can't create secondary domain capable XhrIo object.");return s=n.Aa&&!n.ma?new U(new Kn({ab:a})):new U(n.ma),s.Fa(n.L),s}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Nr(){}i=Nr.prototype,i.ra=function(){},i.qa=function(){},i.pa=function(){},i.oa=function(){},i.isActive=function(){return!0},i.Ka=function(){};function X(n,s){$.call(this),this.g=new Er(s),this.l=n,this.h=s&&s.messageUrlParams||null,n=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.o=n,n=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(n?n["X-WebChannel-Content-Type"]=s.messageContentType:n={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.sa&&(n?n["X-WebChannel-Client-Profile"]=s.sa:n={"X-WebChannel-Client-Profile":s.sa}),this.g.U=n,(n=s&&s.Qb)&&!d(n)&&(this.g.u=n),this.A=s&&s.supportsCrossDomainXhr||!1,this.v=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!d(s)&&(this.g.G=s,n=this.h,n!==null&&s in n&&(n=this.h,s in n&&delete n[s])),this.j=new nt(this)}S(X,$),X.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},X.prototype.close=function(){Xn(this.g)},X.prototype.o=function(n){var s=this.g;if(typeof n=="string"){var a={};a.__data__=n,n=a}else this.v&&(a={},a.__data__=Mn(n),n=a);s.i.push(new zo(s.Ya++,n)),s.I==3&&nn(s)},X.prototype.N=function(){this.g.l=null,delete this.j,Xn(this.g),delete this.g,X.Z.N.call(this)};function Dr(n){Un.call(this),n.__headers__&&(this.headers=n.__headers__,this.statusCode=n.__status__,delete n.__headers__,delete n.__status__);var s=n.__sm__;if(s){e:{for(const a in s){n=a;break e}n=void 0}(this.i=n)&&(n=this.i,s=s!==null&&n in s?s[n]:void 0),this.data=s}else this.data=n}S(Dr,Un);function Lr(){xn.call(this),this.status=1}S(Lr,xn);function nt(n){this.g=n}S(nt,Nr),nt.prototype.ra=function(){W(this.g,"a")},nt.prototype.qa=function(n){W(this.g,new Dr(n))},nt.prototype.pa=function(n){W(this.g,new Lr)},nt.prototype.oa=function(){W(this.g,"b")},X.prototype.send=X.prototype.o,X.prototype.open=X.prototype.m,X.prototype.close=X.prototype.close,Vn.NO_ERROR=0,Vn.TIMEOUT=8,Vn.HTTP_ERROR=6,Ho.COMPLETE="complete",xo.EventType=gt,gt.OPEN="a",gt.CLOSE="b",gt.ERROR="c",gt.MESSAGE="d",$.prototype.listen=$.prototype.J,U.prototype.listenOnce=U.prototype.K,U.prototype.getLastError=U.prototype.Ha,U.prototype.getLastErrorCode=U.prototype.ya,U.prototype.getStatus=U.prototype.ca,U.prototype.getResponseJson=U.prototype.La,U.prototype.getResponseText=U.prototype.la,U.prototype.send=U.prototype.ea,U.prototype.setWithCredentials=U.prototype.Fa}).apply(typeof an<"u"?an:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}z.UNAUTHENTICATED=new z(null),z.GOOGLE_CREDENTIALS=new z("google-credentials-uid"),z.FIRST_PARTY=new z("first-party-uid"),z.MOCK_USER=new z("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gt="12.11.0";function Zl(i){Gt=i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lt=new wi("@firebase/firestore");function ee(i,...e){if(lt.logLevel<=O.DEBUG){const t=e.map(Ni);lt.debug(`Firestore (${Gt}): ${i}`,...t)}}function Io(i,...e){if(lt.logLevel<=O.ERROR){const t=e.map(Ni);lt.error(`Firestore (${Gt}): ${i}`,...t)}}function eu(i,...e){if(lt.logLevel<=O.WARN){const t=e.map(Ni);lt.warn(`Firestore (${Gt}): ${i}`,...t)}}function Ni(i){if(typeof i=="string")return i;try{return function(t){return JSON.stringify(t)}(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(i,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,wo(i,r,t)}function wo(i,e,t){let r=`FIRESTORE (${Gt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Io(r),new Error(r)}function Dt(i,e,t,r){let o="Unexpected state";typeof t=="string"?o=t:r=t,i||wo(e,o,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class k extends me{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class tu{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(z.UNAUTHENTICATED))}shutdown(){}}class nu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class iu{constructor(e){this.t=e,this.currentUser=z.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Dt(this.o===void 0,42304);let r=this.i;const o=E=>this.i!==r?(r=this.i,t(E)):Promise.resolve();let c=new Lt;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new Lt,e.enqueueRetryable(()=>o(this.currentUser))};const h=()=>{const E=c;e.enqueueRetryable(async()=>{await E.promise,await o(this.currentUser)})},y=E=>{ee("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=E,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit(E=>y(E)),setTimeout(()=>{if(!this.auth){const E=this.t.getImmediate({optional:!0});E?y(E):(ee("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new Lt)}},0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(ee("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Dt(typeof r.accessToken=="string",31837,{l:r}),new Eo(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Dt(e===null||typeof e=="string",2055,{h:e}),new z(e)}}class ru{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=z.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class su{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new ru(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(z.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ds{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ou{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Q(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Dt(this.o===void 0,3512);const r=c=>{c.error!=null&&ee("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const h=c.token!==this.m;return this.m=c.token,ee("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable(()=>r(c))};const o=c=>{ee("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(c=>o(c)),setTimeout(()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?o(c):ee("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ds(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Dt(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ds(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function au(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<i;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const o=au(40);for(let c=0;c<o.length;++c)r.length<20&&o[c]<t&&(r+=e.charAt(o[c]%62))}return r}}function Me(i,e){return i<e?-1:i>e?1:0}function hu(i,e){const t=Math.min(i.length,e.length);for(let r=0;r<t;r++){const o=i.charAt(r),c=e.charAt(r);if(o!==c)return ai(o)===ai(c)?Me(o,c):ai(o)?1:-1}return Me(i.length,e.length)}const lu=55296,uu=57343;function ai(i){const e=i.charCodeAt(0);return e>=lu&&e<=uu}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs="__name__";class oe{constructor(e,t,r){t===void 0?t=0:t>e.length&&Vt(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Vt(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return oe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof oe?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let o=0;o<r;o++){const c=oe.compareSegments(e.get(o),t.get(o));if(c!==0)return c}return Me(e.length,t.length)}static compareSegments(e,t){const r=oe.isNumericId(e),o=oe.isNumericId(t);return r&&!o?-1:!r&&o?1:r&&o?oe.extractNumericId(e).compare(oe.extractNumericId(t)):hu(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Oi.fromString(e.substring(4,e.length-2))}}class Y extends oe{construct(e,t,r){return new Y(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new k(C.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(o=>o.length>0))}return new Y(t)}static emptyPath(){return new Y([])}}const du=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class $e extends oe{construct(e,t,r){return new $e(e,t,r)}static isValidIdentifier(e){return du.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),$e.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===fs}static keyField(){return new $e([fs])}static fromServerFormat(e){const t=[];let r="",o=0;const c=()=>{if(r.length===0)throw new k(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let h=!1;for(;o<e.length;){const y=e[o];if(y==="\\"){if(o+1===e.length)throw new k(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const E=e[o+1];if(E!=="\\"&&E!=="."&&E!=="`")throw new k(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=E,o+=2}else y==="`"?(h=!h,o++):y!=="."||h?(r+=y,o++):(c(),o++)}if(c(),h)throw new k(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new $e(t)}static emptyPath(){return new $e([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.path=e}static fromPath(e){return new We(Y.fromString(e))}static fromName(e){return new We(Y.fromString(e).popFirst(5))}static empty(){return new We(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Y.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Y.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new We(new Y(e.slice()))}}function fu(i,e,t,r){if(e===!0&&r===!0)throw new k(C.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function pu(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function gu(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":Vt(12329,{type:typeof i})}function mu(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new k(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=gu(i);throw new k(C.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(i,e){const t={typeString:i};return e&&(t.value=e),t}function zt(i,e){if(!pu(i))throw new k(C.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const o=e[r].typeString,c="value"in e[r]?{value:e[r].value}:void 0;if(!(r in i)){t=`JSON missing required field: '${r}'`;break}const h=i[r];if(o&&typeof h!==o){t=`JSON field '${r}' must be a ${o}.`;break}if(c!==void 0&&h!==c.value){t=`Expected '${r}' field to equal '${c.value}'`;break}}if(t)throw new k(C.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ps=-62135596800,gs=1e6;class ae{static now(){return ae.fromMillis(Date.now())}static fromDate(e){return ae.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*gs);return new ae(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new k(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new k(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ps)throw new k(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new k(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/gs}_compareTo(e){return this.seconds===e.seconds?Me(this.nanoseconds,e.nanoseconds):Me(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ae._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(zt(e,ae._jsonSchema))return new ae(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ps;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ae._jsonSchemaVersion="firestore/timestamp/1.0",ae._jsonSchema={type:F("string",ae._jsonSchemaVersion),seconds:F("number"),nanoseconds:F("number")};function _u(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(o){try{return atob(o)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new yu("Invalid base64 string: "+c):c}}(e);return new Xe(t)}static fromUint8Array(e){const t=function(o){let c="";for(let h=0;h<o.length;++h)c+=String.fromCharCode(o[h]);return c}(e);return new Xe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Me(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Xe.EMPTY_BYTE_STRING=new Xe("");const _i="(default)";class vn{constructor(e,t){this.projectId=e,this.database=t||_i}static empty(){return new vn("","")}get isDefaultDatabase(){return this.database===_i}isEqual(e){return e instanceof vn&&e.projectId===this.projectId&&e.database===this.database}}function Iu(i,e){if(!Object.prototype.hasOwnProperty.apply(i.options,["projectId"]))throw new k(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new vn(i.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{constructor(e,t=null,r=[],o=[],c=null,h="F",y=null,E=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=o,this.limit=c,this.limitType=h,this.startAt=y,this.endAt=E,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function Eu(i){return new wu(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ms,R;(R=ms||(ms={}))[R.OK=0]="OK",R[R.CANCELLED=1]="CANCELLED",R[R.UNKNOWN=2]="UNKNOWN",R[R.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",R[R.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",R[R.NOT_FOUND=5]="NOT_FOUND",R[R.ALREADY_EXISTS=6]="ALREADY_EXISTS",R[R.PERMISSION_DENIED=7]="PERMISSION_DENIED",R[R.UNAUTHENTICATED=16]="UNAUTHENTICATED",R[R.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",R[R.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",R[R.ABORTED=10]="ABORTED",R[R.OUT_OF_RANGE=11]="OUT_OF_RANGE",R[R.UNIMPLEMENTED=12]="UNIMPLEMENTED",R[R.INTERNAL=13]="INTERNAL",R[R.UNAVAILABLE=14]="UNAVAILABLE",R[R.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Oi([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tu=1048576;function ci(){return typeof document<"u"?document:null}class Su{constructor(e,t,r=1e3,o=1.5,c=6e4){this.Ci=e,this.timerId=t,this.R_=r,this.A_=o,this.V_=c,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),o=Math.max(0,t-r);o>0&&ee("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,o,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e,t,r,o,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=o,this.removalCallback=c,this.deferred=new Lt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(h=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,o,c){const h=Date.now()+r,y=new Di(e,t,h,o,c);return y.start(r),y}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new k(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var _s,ys;(ys=_s||(_s={})).Ma="default",ys.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Au(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bu="ComponentProvider",Is=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vo="firestore.googleapis.com",ws=!0;class Es{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new k(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=vo,this.ssl=ws}else this.host=e.host,this.ssl=e.ssl??ws;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=vu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Tu)throw new k(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}fu("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Au(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new k(C.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new k(C.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new k(C.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,o){return r.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class To{constructor(e,t,r,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Es({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new k(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new k(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Es(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new tu;switch(r.type){case"firstParty":return new su(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new k(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Is.get(t);r&&(ee(bu,"Removing Datastore"),Is.delete(t),r.terminate())}(this),Promise.resolve()}}function Pu(i,e,t,r={}){var v;i=mu(i,To);const o=Tn(e),c=i._getSettings(),h={...c,emulatorOptions:i._getEmulatorOptions()},y=`${e}:${t}`;o&&Ds(`https://${y}`),c.host!==vo&&c.host!==y&&eu("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const E={...c,host:y,ssl:o,emulatorOptions:r};if(!qe(E,h)&&(i._setSettings(E),r.mockUserToken)){let b,S;if(typeof r.mockUserToken=="string")b=r.mockUserToken,S=z.MOCK_USER;else{b=_a(r.mockUserToken,(v=i._app)==null?void 0:v.options.projectId);const D=r.mockUserToken.sub||r.mockUserToken.user_id;if(!D)throw new k(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new z(D)}i._authCredentials=new nu(new Eo(b,S))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Li(this.firestore,e,this._query)}}class ce{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ce(this.firestore,e,this._key)}toJSON(){return{type:ce._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(zt(t,ce._jsonSchema))return new ce(e,r||null,new We(Y.fromString(t.referencePath)))}}ce._jsonSchemaVersion="firestore/documentReference/1.0",ce._jsonSchema={type:F("string",ce._jsonSchemaVersion),referencePath:F("string")};class Mi extends Li{constructor(e,t,r){super(e,t,Eu(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ce(this.firestore,null,new We(e))}withConverter(e){return new Mi(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vs="AsyncQueue";class Ts{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Su(this,"async_queue_retry"),this._c=()=>{const r=ci();r&&ee(vs,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=ci();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=ci();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Lt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Yu.push(e),this.lc()))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!_u(e))throw e;ee(vs,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,Io("INTERNAL UNHANDLED ERROR: ",Ss(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const o=Di.createAndSchedule(this,e,t,r,c=>this.hc(c));return this.tc.push(o),o}uc(){this.nc&&Vt(47125,{Pc:Ss(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ic(e){return this.Tc().then(()=>{this.tc.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Ss(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}class Ru extends To{constructor(e,t,r,o){super(e,t,r,o),this.type="firestore",this._queue=new Ts,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ts(e),this._firestoreClient=void 0,await e}}}function Fu(i,e){const t=typeof i=="object"?i:Us(),r=typeof i=="string"?i:_i,o=vi(t,"firestore").getImmediate({identifier:r});if(!o._initialized){const c=ga("firestore");c&&Pu(o,...c)}return o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ue(Xe.fromBase64String(e))}catch(t){throw new k(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ue(Xe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ue._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(zt(e,ue._jsonSchema))return ue.fromBase64String(e.bytes)}}ue._jsonSchemaVersion="firestore/bytes/1.0",ue._jsonSchema={type:F("string",ue._jsonSchemaVersion),bytes:F("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new k(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new $e(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new k(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new k(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Me(this._lat,e._lat)||Me(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ge._jsonSchemaVersion}}static fromJSON(e){if(zt(e,Ge._jsonSchema))return new Ge(e.latitude,e.longitude)}}Ge._jsonSchemaVersion="firestore/geoPoint/1.0",Ge._jsonSchema={type:F("string",Ge._jsonSchemaVersion),latitude:F("number"),longitude:F("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,o){if(r.length!==o.length)return!1;for(let c=0;c<r.length;++c)if(r[c]!==o[c])return!1;return!0}(this._values,e._values)}toJSON(){return{type:ze._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(zt(e,ze._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new ze(e.vectorValues);throw new k(C.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ze._jsonSchemaVersion="firestore/vectorValue/1.0",ze._jsonSchema={type:F("string",ze._jsonSchemaVersion),vectorValues:F("object")};function Ao(i,e,t){if((e=ne(e))instanceof So)return e._internalPath;if(typeof e=="string")return ku(i,e);throw yi("Field path arguments must be of type string or ",i)}const Cu=new RegExp("[~\\*/\\[\\]]");function ku(i,e,t){if(e.search(Cu)>=0)throw yi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new So(...e.split("."))._internalPath}catch{throw yi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function yi(i,e,t,r,o){let c=`Function ${e}() called with invalid data`;c+=". ";let h="";return new k(C.INVALID_ARGUMENT,c+i+h)}const As="@firebase/firestore",bs="4.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e,t,r,o,c){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=o,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new ce(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Ou(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Ao("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Ou extends bo{data(){return super.data()}}class cn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class at extends bo{constructor(e,t,r,o,c,h){super(e,t,r,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new fn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ao("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new k(C.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=at._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}at._jsonSchemaVersion="firestore/documentSnapshot/1.0",at._jsonSchema={type:F("string",at._jsonSchemaVersion),bundleSource:F("string","DocumentSnapshot"),bundleName:F("string"),bundle:F("string")};class fn extends at{data(e={}){return super.data(e)}}class Mt{constructor(e,t,r,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new cn(o.hasPendingWrites,o.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new fn(this._firestore,this._userDataWriter,r.key,r,new cn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new k(C.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(o,c){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map(y=>{const E=new fn(o._firestore,o._userDataWriter,y.doc.key,y.doc,new cn(o._snapshot.mutatedKeys.has(y.doc.key),o._snapshot.fromCache),o.query.converter);return y.doc,{type:"added",doc:E,oldIndex:-1,newIndex:h++}})}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter(y=>c||y.type!==3).map(y=>{const E=new fn(o._firestore,o._userDataWriter,y.doc.key,y.doc,new cn(o._snapshot.mutatedKeys.has(y.doc.key),o._snapshot.fromCache),o.query.converter);let v=-1,b=-1;return y.type!==0&&(v=h.indexOf(y.doc.key),h=h.delete(y.doc.key)),y.type!==1&&(h=h.add(y.doc),b=h.indexOf(y.doc.key)),{type:Nu(y.type),doc:E,oldIndex:v,newIndex:b}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new k(C.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Mt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=cu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],o=[];return this.docs.forEach(c=>{c._document!==null&&(t.push(c._document),r.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),o.push(c.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Nu(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Vt(61501,{type:i})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Mt._jsonSchemaVersion="firestore/querySnapshot/1.0",Mt._jsonSchema={type:F("string",Mt._jsonSchemaVersion),bundleSource:F("string","QuerySnapshot"),bundleName:F("string"),bundle:F("string")};(function(e,t=!0){Zl(ut),ct(new Ke("firestore",(r,{instanceIdentifier:o,options:c})=>{const h=r.getProvider("app").getImmediate(),y=new Ru(new iu(r.getProvider("auth-internal")),new ou(h,r.getProvider("app-check-internal")),Iu(h,o),h);return c={useFetchStreams:t,...c},y._setSettings(c),y},"PUBLIC").setMultipleInstances(!0)),De(As,bs,e),De(As,bs,"esm2020")})();export{Du as a,uo as b,Uu as c,Fu as d,xu as g,kc as i,Mu as o,Lu as s};
