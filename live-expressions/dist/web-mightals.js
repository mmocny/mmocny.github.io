(()=>{var br=function(r,e){return br=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])},br(r,e)};function _(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");br(r,e);function t(){this.constructor=r}r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}function Lr(r,e,t,o){function n(i){return i instanceof t?i:new t(function(f){f(i)})}return new(t||(t=Promise))(function(i,f){function u(s){try{a(o.next(s))}catch(d){f(d)}}function c(s){try{a(o.throw(s))}catch(d){f(d)}}function a(s){s.done?i(s.value):n(s.value).then(u,c)}a((o=o.apply(r,e||[])).next())})}function J(r,e){var t={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},o,n,i,f;return f={next:u(0),throw:u(1),return:u(2)},typeof Symbol=="function"&&(f[Symbol.iterator]=function(){return this}),f;function u(a){return function(s){return c([a,s])}}function c(a){if(o)throw new TypeError("Generator is already executing.");for(;f&&(f=0,a[0]&&(t=0)),t;)try{if(o=1,n&&(i=a[0]&2?n.return:a[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,a[1])).done)return i;switch(n=0,i&&(a=[a[0]&2,i.value]),a[0]){case 0:case 1:i=a;break;case 4:return t.label++,{value:a[1],done:!1};case 5:t.label++,n=a[1],a=[0];continue;case 7:a=t.ops.pop(),t.trys.pop();continue;default:if(i=t.trys,!(i=i.length>0&&i[i.length-1])&&(a[0]===6||a[0]===2)){t=0;continue}if(a[0]===3&&(!i||a[1]>i[0]&&a[1]<i[3])){t.label=a[1];break}if(a[0]===6&&t.label<i[1]){t.label=i[1],i=a;break}if(i&&t.label<i[2]){t.label=i[2],t.ops.push(a);break}i[2]&&t.ops.pop(),t.trys.pop();continue}a=e.call(r,t)}catch(s){a=[6,s],n=0}finally{o=i=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}}function j(r){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&r[e],o=0;if(t)return t.call(r);if(r&&typeof r.length=="number")return{next:function(){return r&&o>=r.length&&(r=void 0),{value:r&&r[o++],done:!r}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function I(r,e){var t=typeof Symbol=="function"&&r[Symbol.iterator];if(!t)return r;var o=t.call(r),n,i=[],f;try{for(;(e===void 0||e-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(u){f={error:u}}finally{try{n&&!n.done&&(t=o.return)&&t.call(o)}finally{if(f)throw f.error}}return i}function P(r,e,t){if(t||arguments.length===2)for(var o=0,n=e.length,i;o<n;o++)(i||!(o in e))&&(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return r.concat(i||Array.prototype.slice.call(e))}function k(r){return this instanceof k?(this.v=r,this):new k(r)}function Wr(r,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=t.apply(r,e||[]),n,i=[];return n={},f("next"),f("throw"),f("return"),n[Symbol.asyncIterator]=function(){return this},n;function f(p){o[p]&&(n[p]=function(v){return new Promise(function(h,m){i.push([p,v,h,m])>1||u(p,v)})})}function u(p,v){try{c(o[p](v))}catch(h){d(i[0][3],h)}}function c(p){p.value instanceof k?Promise.resolve(p.value.v).then(a,s):d(i[0][2],p)}function a(p){u("next",p)}function s(p){u("throw",p)}function d(p,v){p(v),i.shift(),i.length&&u(i[0][0],i[0][1])}}function Dr(r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=r[Symbol.asyncIterator],t;return e?e.call(r):(r=typeof j=="function"?j(r):r[Symbol.iterator](),t={},o("next"),o("throw"),o("return"),t[Symbol.asyncIterator]=function(){return this},t);function o(i){t[i]=r[i]&&function(f){return new Promise(function(u,c){f=r[i](f),n(u,c,f.done,f.value)})}}function n(i,f,u,c){Promise.resolve(c).then(function(a){i({value:a,done:u})},f)}}function l(r){return typeof r=="function"}function Z(r){var e=function(o){Error.call(o),o.stack=new Error().stack},t=r(e);return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}var Q=Z(function(r){return function(t){r(this),this.message=t?t.length+` errors occurred during unsubscription:
`+t.map(function(o,n){return n+1+") "+o.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=t}});function U(r,e){if(r){var t=r.indexOf(e);0<=t&&r.splice(t,1)}}var C=function(){function r(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return r.prototype.unsubscribe=function(){var e,t,o,n,i;if(!this.closed){this.closed=!0;var f=this._parentage;if(f)if(this._parentage=null,Array.isArray(f))try{for(var u=j(f),c=u.next();!c.done;c=u.next()){var a=c.value;a.remove(this)}}catch(m){e={error:m}}finally{try{c&&!c.done&&(t=u.return)&&t.call(u)}finally{if(e)throw e.error}}else f.remove(this);var s=this.initialTeardown;if(l(s))try{s()}catch(m){i=m instanceof Q?m.errors:[m]}var d=this._finalizers;if(d){this._finalizers=null;try{for(var p=j(d),v=p.next();!v.done;v=p.next()){var h=v.value;try{Vr(h)}catch(m){i=i??[],m instanceof Q?i=P(P([],I(i)),I(m.errors)):i.push(m)}}}catch(m){o={error:m}}finally{try{v&&!v.done&&(n=p.return)&&n.call(p)}finally{if(o)throw o.error}}}if(i)throw new Q(i)}},r.prototype.add=function(e){var t;if(e&&e!==this)if(this.closed)Vr(e);else{if(e instanceof r){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(t=this._finalizers)!==null&&t!==void 0?t:[]).push(e)}},r.prototype._hasParent=function(e){var t=this._parentage;return t===e||Array.isArray(t)&&t.includes(e)},r.prototype._addParent=function(e){var t=this._parentage;this._parentage=Array.isArray(t)?(t.push(e),t):t?[t,e]:e},r.prototype._removeParent=function(e){var t=this._parentage;t===e?this._parentage=null:Array.isArray(t)&&U(t,e)},r.prototype.remove=function(e){var t=this._finalizers;t&&U(t,e),e instanceof r&&e._removeParent(this)},r.EMPTY=function(){var e=new r;return e.closed=!0,e}(),r}();var yr=C.EMPTY;function X(r){return r instanceof C||r&&"closed"in r&&l(r.remove)&&l(r.add)&&l(r.unsubscribe)}function Vr(r){l(r)?r():r.unsubscribe()}var T={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var D={setTimeout:function(r,e){for(var t=[],o=2;o<arguments.length;o++)t[o-2]=arguments[o];var n=D.delegate;return n?.setTimeout?n.setTimeout.apply(n,P([r,e],I(t))):setTimeout.apply(void 0,P([r,e],I(t)))},clearTimeout:function(r){var e=D.delegate;return(e?.clearTimeout||clearTimeout)(r)},delegate:void 0};function rr(r){D.setTimeout(function(){var e=T.onUnhandledError;if(e)e(r);else throw r})}function xr(){}var Nr=function(){return gr("C",void 0,void 0)}();function Gr(r){return gr("E",void 0,r)}function qr(r){return gr("N",r,void 0)}function gr(r,e,t){return{kind:r,value:e,error:t}}var L=null;function V(r){if(T.useDeprecatedSynchronousErrorHandling){var e=!L;if(e&&(L={errorThrown:!1,error:null}),r(),e){var t=L,o=t.errorThrown,n=t.error;if(L=null,o)throw n}}else r()}function Br(r){T.useDeprecatedSynchronousErrorHandling&&L&&(L.errorThrown=!0,L.error=r)}var q=function(r){_(e,r);function e(t){var o=r.call(this)||this;return o.isStopped=!1,t?(o.destination=t,X(t)&&t.add(o)):o.destination=Ee,o}return e.create=function(t,o,n){return new W(t,o,n)},e.prototype.next=function(t){this.isStopped?Sr(qr(t),this):this._next(t)},e.prototype.error=function(t){this.isStopped?Sr(Gr(t),this):(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped?Sr(Nr,this):(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,r.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){try{this.destination.error(t)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e}(C);var Se=Function.prototype.bind;function wr(r,e){return Se.call(r,e)}var _e=function(){function r(e){this.partialObserver=e}return r.prototype.next=function(e){var t=this.partialObserver;if(t.next)try{t.next(e)}catch(o){er(o)}},r.prototype.error=function(e){var t=this.partialObserver;if(t.error)try{t.error(e)}catch(o){er(o)}else er(e)},r.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(t){er(t)}},r}(),W=function(r){_(e,r);function e(t,o,n){var i=r.call(this)||this,f;if(l(t)||!t)f={next:t??void 0,error:o??void 0,complete:n??void 0};else{var u;i&&T.useDeprecatedNextContext?(u=Object.create(t),u.unsubscribe=function(){return i.unsubscribe()},f={next:t.next&&wr(t.next,u),error:t.error&&wr(t.error,u),complete:t.complete&&wr(t.complete,u)}):f=t}return i.destination=new _e(f),i}return e}(q);function er(r){T.useDeprecatedSynchronousErrorHandling?Br(r):rr(r)}function Oe(r){throw r}function Sr(r,e){var t=T.onStoppedNotification;t&&D.setTimeout(function(){return t(r,e)})}var Ee={closed:!0,next:xr,error:Oe,complete:xr};var N=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}();function F(r){return r}function Yr(r){return r.length===0?F:r.length===1?r[0]:function(t){return r.reduce(function(o,n){return n(o)},t)}}var b=function(){function r(e){e&&(this._subscribe=e)}return r.prototype.lift=function(e){var t=new r;return t.source=this,t.operator=e,t},r.prototype.subscribe=function(e,t,o){var n=this,i=Ie(e)?e:new W(e,t,o);return V(function(){var f=n,u=f.operator,c=f.source;i.add(u?u.call(i,c):c?n._subscribe(i):n._trySubscribe(i))}),i},r.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(t){e.error(t)}},r.prototype.forEach=function(e,t){var o=this;return t=Kr(t),new t(function(n,i){var f=new W({next:function(u){try{e(u)}catch(c){i(c),f.unsubscribe()}},error:i,complete:n});o.subscribe(f)})},r.prototype._subscribe=function(e){var t;return(t=this.source)===null||t===void 0?void 0:t.subscribe(e)},r.prototype[N]=function(){return this},r.prototype.pipe=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return Yr(e)(this)},r.prototype.toPromise=function(e){var t=this;return e=Kr(e),new e(function(o,n){var i;t.subscribe(function(f){return i=f},function(f){return n(f)},function(){return o(i)})})},r.create=function(e){return new r(e)},r}();function Kr(r){var e;return(e=r??T.Promise)!==null&&e!==void 0?e:Promise}function Ae(r){return r&&l(r.next)&&l(r.error)&&l(r.complete)}function Ie(r){return r&&r instanceof q||Ae(r)&&X(r)}function Pe(r){return l(r?.lift)}function y(r){return function(e){if(Pe(e))return e.lift(function(t){try{return r(t,this)}catch(o){this.error(o)}});throw new TypeError("Unable to lift unknown Observable type")}}function g(r,e,t,o,n){return new _r(r,e,t,o,n)}var _r=function(r){_(e,r);function e(t,o,n,i,f,u){var c=r.call(this,t)||this;return c.onFinalize=f,c.shouldUnsubscribe=u,c._next=o?function(a){try{o(a)}catch(s){t.error(s)}}:r.prototype._next,c._error=i?function(a){try{i(a)}catch(s){t.error(s)}finally{this.unsubscribe()}}:r.prototype._error,c._complete=n?function(){try{n()}catch(a){t.error(a)}finally{this.unsubscribe()}}:r.prototype._complete,c}return e.prototype.unsubscribe=function(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var o=this.closed;r.prototype.unsubscribe.call(this),!o&&((t=this.onFinalize)===null||t===void 0||t.call(this))}},e}(q);var zr=Z(function(r){return function(){r(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}});var B=function(r){_(e,r);function e(){var t=r.call(this)||this;return t.closed=!1,t.currentObservers=null,t.observers=[],t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return e.prototype.lift=function(t){var o=new Hr(this,this);return o.operator=t,o},e.prototype._throwIfClosed=function(){if(this.closed)throw new zr},e.prototype.next=function(t){var o=this;V(function(){var n,i;if(o._throwIfClosed(),!o.isStopped){o.currentObservers||(o.currentObservers=Array.from(o.observers));try{for(var f=j(o.currentObservers),u=f.next();!u.done;u=f.next()){var c=u.value;c.next(t)}}catch(a){n={error:a}}finally{try{u&&!u.done&&(i=f.return)&&i.call(f)}finally{if(n)throw n.error}}}})},e.prototype.error=function(t){var o=this;V(function(){if(o._throwIfClosed(),!o.isStopped){o.hasError=o.isStopped=!0,o.thrownError=t;for(var n=o.observers;n.length;)n.shift().error(t)}})},e.prototype.complete=function(){var t=this;V(function(){if(t._throwIfClosed(),!t.isStopped){t.isStopped=!0;for(var o=t.observers;o.length;)o.shift().complete()}})},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var t;return((t=this.observers)===null||t===void 0?void 0:t.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(t){return this._throwIfClosed(),r.prototype._trySubscribe.call(this,t)},e.prototype._subscribe=function(t){return this._throwIfClosed(),this._checkFinalizedStatuses(t),this._innerSubscribe(t)},e.prototype._innerSubscribe=function(t){var o=this,n=this,i=n.hasError,f=n.isStopped,u=n.observers;return i||f?yr:(this.currentObservers=null,u.push(t),new C(function(){o.currentObservers=null,U(u,t)}))},e.prototype._checkFinalizedStatuses=function(t){var o=this,n=o.hasError,i=o.thrownError,f=o.isStopped;n?t.error(i):f&&t.complete()},e.prototype.asObservable=function(){var t=new b;return t.source=this,t},e.create=function(t,o){return new Hr(t,o)},e}(b);var Hr=function(r){_(e,r);function e(t,o){var n=r.call(this)||this;return n.destination=t,n.source=o,n}return e.prototype.next=function(t){var o,n;(n=(o=this.destination)===null||o===void 0?void 0:o.next)===null||n===void 0||n.call(o,t)},e.prototype.error=function(t){var o,n;(n=(o=this.destination)===null||o===void 0?void 0:o.error)===null||n===void 0||n.call(o,t)},e.prototype.complete=function(){var t,o;(o=(t=this.destination)===null||t===void 0?void 0:t.complete)===null||o===void 0||o.call(t)},e.prototype._subscribe=function(t){var o,n;return(n=(o=this.source)===null||o===void 0?void 0:o.subscribe(t))!==null&&n!==void 0?n:yr},e}(B);var Or={now:function(){return(Or.delegate||Date).now()},delegate:void 0};var $r=function(r){_(e,r);function e(t,o){return r.call(this)||this}return e.prototype.schedule=function(t,o){return o===void 0&&(o=0),this},e}(C);var Y={setInterval:function(r,e){for(var t=[],o=2;o<arguments.length;o++)t[o-2]=arguments[o];var n=Y.delegate;return n?.setInterval?n.setInterval.apply(n,P([r,e],I(t))):setInterval.apply(void 0,P([r,e],I(t)))},clearInterval:function(r){var e=Y.delegate;return(e?.clearInterval||clearInterval)(r)},delegate:void 0};var Jr=function(r){_(e,r);function e(t,o){var n=r.call(this,t,o)||this;return n.scheduler=t,n.work=o,n.pending=!1,n}return e.prototype.schedule=function(t,o){var n;if(o===void 0&&(o=0),this.closed)return this;this.state=t;var i=this.id,f=this.scheduler;return i!=null&&(this.id=this.recycleAsyncId(f,i,o)),this.pending=!0,this.delay=o,this.id=(n=this.id)!==null&&n!==void 0?n:this.requestAsyncId(f,this.id,o),this},e.prototype.requestAsyncId=function(t,o,n){return n===void 0&&(n=0),Y.setInterval(t.flush.bind(t,this),n)},e.prototype.recycleAsyncId=function(t,o,n){if(n===void 0&&(n=0),n!=null&&this.delay===n&&this.pending===!1)return o;o!=null&&Y.clearInterval(o)},e.prototype.execute=function(t,o){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var n=this._execute(t,o);if(n)return n;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},e.prototype._execute=function(t,o){var n=!1,i;try{this.work(t)}catch(f){n=!0,i=f||new Error("Scheduled action threw falsy error")}if(n)return this.unsubscribe(),i},e.prototype.unsubscribe=function(){if(!this.closed){var t=this,o=t.id,n=t.scheduler,i=n.actions;this.work=this.state=this.scheduler=null,this.pending=!1,U(i,this),o!=null&&(this.id=this.recycleAsyncId(n,o,null)),this.delay=null,r.prototype.unsubscribe.call(this)}},e}($r);var Er=function(){function r(e,t){t===void 0&&(t=r.now),this.schedulerActionCtor=e,this.now=t}return r.prototype.schedule=function(e,t,o){return t===void 0&&(t=0),new this.schedulerActionCtor(this,e).schedule(o,t)},r.now=Or.now,r}();var Zr=function(r){_(e,r);function e(t,o){o===void 0&&(o=Er.now);var n=r.call(this,t,o)||this;return n.actions=[],n._active=!1,n}return e.prototype.flush=function(t){var o=this.actions;if(this._active){o.push(t);return}var n;this._active=!0;do if(n=t.execute(t.state,t.delay))break;while(t=o.shift());if(this._active=!1,n){for(;t=o.shift();)t.unsubscribe();throw n}},e}(Er);var Qr=new Zr(Jr);function Xr(r){return r&&l(r.schedule)}function re(r){return r[r.length-1]}function ee(r){return l(re(r))?r.pop():void 0}function G(r){return Xr(re(r))?r.pop():void 0}var tr=function(r){return r&&typeof r.length=="number"&&typeof r!="function"};function or(r){return l(r?.then)}function nr(r){return l(r[N])}function ir(r){return Symbol.asyncIterator&&l(r?.[Symbol.asyncIterator])}function fr(r){return new TypeError("You provided "+(r!==null&&typeof r=="object"?"an invalid object":"'"+r+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}function Te(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var ur=Te();function ar(r){return l(r?.[ur])}function cr(r){return Wr(this,arguments,function(){var t,o,n,i;return J(this,function(f){switch(f.label){case 0:t=r.getReader(),f.label=1;case 1:f.trys.push([1,,9,10]),f.label=2;case 2:return[4,k(t.read())];case 3:return o=f.sent(),n=o.value,i=o.done,i?[4,k(void 0)]:[3,5];case 4:return[2,f.sent()];case 5:return[4,k(n)];case 6:return[4,f.sent()];case 7:return f.sent(),[3,2];case 8:return[3,10];case 9:return t.releaseLock(),[7];case 10:return[2]}})})}function sr(r){return l(r?.getReader)}function w(r){if(r instanceof b)return r;if(r!=null){if(nr(r))return je(r);if(tr(r))return Fe(r);if(or(r))return Ce(r);if(ir(r))return te(r);if(ar(r))return Re(r);if(sr(r))return Me(r)}throw fr(r)}function je(r){return new b(function(e){var t=r[N]();if(l(t.subscribe))return t.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function Fe(r){return new b(function(e){for(var t=0;t<r.length&&!e.closed;t++)e.next(r[t]);e.complete()})}function Ce(r){return new b(function(e){r.then(function(t){e.closed||(e.next(t),e.complete())},function(t){return e.error(t)}).then(null,rr)})}function Re(r){return new b(function(e){var t,o;try{for(var n=j(r),i=n.next();!i.done;i=n.next()){var f=i.value;if(e.next(f),e.closed)return}}catch(u){t={error:u}}finally{try{i&&!i.done&&(o=n.return)&&o.call(n)}finally{if(t)throw t.error}}e.complete()})}function te(r){return new b(function(e){ke(r,e).catch(function(t){return e.error(t)})})}function Me(r){return te(cr(r))}function ke(r,e){var t,o,n,i;return Lr(this,void 0,void 0,function(){var f,u;return J(this,function(c){switch(c.label){case 0:c.trys.push([0,5,6,11]),t=Dr(r),c.label=1;case 1:return[4,t.next()];case 2:if(o=c.sent(),!!o.done)return[3,4];if(f=o.value,e.next(f),e.closed)return[2];c.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return u=c.sent(),n={error:u},[3,11];case 6:return c.trys.push([6,,9,10]),o&&!o.done&&(i=t.return)?[4,i.call(t)]:[3,8];case 7:c.sent(),c.label=8;case 8:return[3,10];case 9:if(n)throw n.error;return[7];case 10:return[7];case 11:return e.complete(),[2]}})})}function O(r,e,t,o,n){o===void 0&&(o=0),n===void 0&&(n=!1);var i=e.schedule(function(){t(),n?r.add(this.schedule(null,o)):this.unsubscribe()},o);if(r.add(i),!n)return i}function pr(r,e){return e===void 0&&(e=0),y(function(t,o){t.subscribe(g(o,function(n){return O(o,r,function(){return o.next(n)},e)},function(){return O(o,r,function(){return o.complete()},e)},function(n){return O(o,r,function(){return o.error(n)},e)}))})}function lr(r,e){return e===void 0&&(e=0),y(function(t,o){o.add(r.schedule(function(){return t.subscribe(o)},e))})}function oe(r,e){return w(r).pipe(lr(e),pr(e))}function ne(r,e){return w(r).pipe(lr(e),pr(e))}function ie(r,e){return new b(function(t){var o=0;return e.schedule(function(){o===r.length?t.complete():(t.next(r[o++]),t.closed||this.schedule())})})}function fe(r,e){return new b(function(t){var o;return O(t,e,function(){o=r[ur](),O(t,e,function(){var n,i,f;try{n=o.next(),i=n.value,f=n.done}catch(u){t.error(u);return}f?t.complete():t.next(i)},0,!0)}),function(){return l(o?.return)&&o.return()}})}function mr(r,e){if(!r)throw new Error("Iterable cannot be null");return new b(function(t){O(t,e,function(){var o=r[Symbol.asyncIterator]();O(t,e,function(){o.next().then(function(n){n.done?t.complete():t.next(n.value)})},0,!0)})})}function ue(r,e){return mr(cr(r),e)}function ae(r,e){if(r!=null){if(nr(r))return oe(r,e);if(tr(r))return ie(r,e);if(or(r))return ne(r,e);if(ir(r))return mr(r,e);if(ar(r))return fe(r,e);if(sr(r))return ue(r,e)}throw fr(r)}function K(r,e){return e?ae(r,e):w(r)}function dr(r,e){return y(function(t,o){var n=0;t.subscribe(g(o,function(i){o.next(r.call(e,i,n++))}))})}var Ue=Array.isArray;function Le(r,e){return Ue(e)?r.apply(void 0,P([],I(e))):r(e)}function hr(r){return dr(function(e){return Le(r,e)})}var We=Array.isArray,De=Object.getPrototypeOf,Ve=Object.prototype,Ne=Object.keys;function ce(r){if(r.length===1){var e=r[0];if(We(e))return{args:e,keys:null};if(Ge(e)){var t=Ne(e);return{args:t.map(function(o){return e[o]}),keys:t}}}return{args:r,keys:null}}function Ge(r){return r&&typeof r=="object"&&De(r)===Ve}function se(r,e){return r.reduce(function(t,o,n){return t[o]=e[n],t},{})}function Ar(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var t=G(r),o=ee(r),n=ce(r),i=n.args,f=n.keys;if(i.length===0)return K([],t);var u=new b(qe(i,t,f?function(c){return se(f,c)}:F));return o?u.pipe(hr(o)):u}function qe(r,e,t){return t===void 0&&(t=F),function(o){pe(e,function(){for(var n=r.length,i=new Array(n),f=n,u=n,c=function(s){pe(e,function(){var d=K(r[s],e),p=!1;d.subscribe(g(o,function(v){i[s]=v,p||(p=!0,u--),u||o.next(t(i.slice()))},function(){--f||o.complete()}))},o)},a=0;a<n;a++)c(a)},o)}}function pe(r,e,t){r?O(t,r,e):e()}function le(r,e,t,o,n,i,f,u){var c=[],a=0,s=0,d=!1,p=function(){d&&!c.length&&!a&&e.complete()},v=function(m){return a<o?h(m):c.push(m)},h=function(m){i&&e.next(m),a++;var x=!1;w(t(m,s++)).subscribe(g(e,function(S){n?.(S),i?v(S):e.next(S)},function(){x=!0},void 0,function(){if(x)try{a--;for(var S=function(){var A=c.shift();f?O(e,f,function(){return h(A)}):h(A)};c.length&&a<o;)S();p()}catch(A){e.error(A)}}))};return r.subscribe(g(e,v,function(){d=!0,p()})),function(){u?.()}}function E(r,e,t){return t===void 0&&(t=1/0),l(e)?E(function(o,n){return dr(function(i,f){return e(o,i,n,f)})(w(r(o,n)))},t):(typeof e=="number"&&(t=e),y(function(o,n){return le(o,n,r,t)}))}function me(r){return r===void 0&&(r=1/0),E(F,r)}function de(){return me(1)}function Ir(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return de()(K(r,G(r)))}function vr(r,e,t){return t?vr(r,e).pipe(hr(t)):new b(function(o){var n=function(){for(var f=[],u=0;u<arguments.length;u++)f[u]=arguments[u];return o.next(f.length===1?f[0]:f)},i=r(n);return l(e)?function(){return e(n,i)}:void 0})}function he(r,e,t,o,n){return function(i,f){var u=t,c=e,a=0;i.subscribe(g(f,function(s){var d=a++;c=u?r(c,s,d):(u=!0,s),o&&f.next(c)},n&&function(){u&&f.next(c),f.complete()}))}}function Pr(r,e){return e===void 0&&(e=Qr),y(function(t,o){var n=null,i=null,f=null,u=function(){if(n){n.unsubscribe(),n=null;var a=i;i=null,o.next(a)}};function c(){var a=f+r,s=e.now();if(s<a){n=this.schedule(void 0,a-s),o.add(n);return}u()}t.subscribe(g(o,function(a){i=a,f=e.now(),n||(n=e.schedule(c,r),o.add(n))},function(){u(),o.complete()},void 0,function(){i=n=null}))})}function Tr(r,e){return e===void 0&&(e=F),r=r??Be,y(function(t,o){var n,i=!0;t.subscribe(g(o,function(f){var u=e(f);(i||!r(n,u))&&(i=!1,n=u,o.next(f))}))})}function Be(r,e){return r===e}function jr(r,e,t,o){return y(function(n,i){var f;!e||typeof e=="function"?f=e:(t=e.duration,f=e.element,o=e.connector);var u=new Map,c=function(h){u.forEach(h),h(i)},a=function(h){return c(function(m){return m.error(h)})},s=0,d=!1,p=new _r(i,function(h){try{var m=r(h),x=u.get(m);if(!x){u.set(m,x=o?o():new B);var S=v(m,x);if(i.next(S),t){var A=g(x,function(){x.complete(),A?.unsubscribe()},void 0,void 0,function(){return u.delete(m)});p.add(w(t(S)).subscribe(A))}}x.next(f?f(h):h)}catch(M){a(M)}},function(){return c(function(h){return h.complete()})},a,function(){return u.clear()},function(){return d=!0,s===0});n.subscribe(p);function v(h,m){var x=new b(function(S){s++;var A=m.subscribe(S);return function(){A.unsubscribe(),--s===0&&d&&p.unsubscribe()}});return x.key=h,x}})}function z(r,e){return y(he(r,e,arguments.length>=2,!0))}function Cr(r){r===void 0&&(r={});var e=r.connector,t=e===void 0?function(){return new B}:e,o=r.resetOnError,n=o===void 0?!0:o,i=r.resetOnComplete,f=i===void 0?!0:i,u=r.resetOnRefCountZero,c=u===void 0?!0:u;return function(a){var s,d,p,v=0,h=!1,m=!1,x=function(){d?.unsubscribe(),d=void 0},S=function(){x(),s=p=void 0,h=m=!1},A=function(){var M=s;S(),M?.unsubscribe()};return y(function(M,Ur){v++,!m&&!h&&x();var H=p=p??t();Ur.add(function(){v--,v===0&&!m&&!h&&(d=Fr(A,c))}),H.subscribe(Ur),!s&&v>0&&(s=new W({next:function($){return H.next($)},error:function($){m=!0,x(),d=Fr(S,n,$),H.error($)},complete:function(){h=!0,x(),d=Fr(S,f),H.complete()}}),w(M).subscribe(s))})(a)}}function Fr(r,e){for(var t=[],o=2;o<arguments.length;o++)t[o-2]=arguments[o];if(e===!0){r();return}if(e!==!1){var n=new W({next:function(){n.unsubscribe(),r()}});return w(e.apply(void 0,P([],I(t)))).subscribe(n)}}function Rr(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var t=G(r);return y(function(o,n){(t?Ir(r,o,t):Ir(r,o)).subscribe(n)})}function Ye(r){return vr(e=>{let t=new PerformanceObserver(o=>e(o));return t.observe(r),t},(e,t)=>{console.log("disconnecting",t),t.disconnect()})}var R=Ye;function Ke(){return R({type:"event",buffered:!0,durationThreshold:0}).pipe(E(r=>r.getEntries().filter(e=>e.interactionId!=0).map(e=>({score:e.duration,entries:[e]}))))}var ve=Ke;function ze(){return ve().pipe(jr(r=>r.entries[0].interactionId),E(r=>r.pipe(z((e,t)=>({score:Math.max(e.score,t.score),entries:e.entries.concat(t.entries)}),{score:0,entries:[]}))),Tr((r,e)=>e.score<=r.score))}var be=ze;function He(){return R({type:"layout-shift",buffered:!0}).pipe(E(r=>r.getEntries().filter(e=>!e.hadRecentInput).map(e=>({score:e.value,entries:[e]}))),z((r,e)=>({score:r.score+e.score,entries:r.entries.concat(e.entries)}),{score:0,entries:[]}))}var ye=He;function $e(){return R({type:"largest-contentful-paint",buffered:!0}).pipe(E(r=>r.getEntries().map(e=>({score:e.startTime,entries:[e]}))))}var xe=$e;function Je(){return R({type:"long-animation-frame",buffered:!0}).pipe(E(r=>r.getEntries().map(e=>({score:e.duration,entries:[e]}))))}var ge=Je;function Ze(r,e){return Object.fromEntries(Object.entries(r).map(([t,o])=>[t,o.pipe(Rr(e))]))}function Qe(r){return Ar(Ze(r,{score:0,entries:[]})).pipe(Pr(0),Cr())}var we=Qe({inp:be(),cls:ye(),lcp:xe(),loafs:ge()});async function Mr(r){let e=await crypto.subtle.digest("SHA-256",new TextEncoder("utf-8").encode(r));return Array.prototype.map.call(new Uint8Array(e),t=>("00"+t.toString(16)).slice(-2)).join("")}function kr(r){let t=`__init_${Mr(r.toString())}`;window[t]||(window[t]=!0,r())}function Xe(){window.vitals={},we.subscribe(r=>{for(let[e,t]of Object.entries(r))window.vitals[e]=+t.score.toFixed(5)})}kr(Xe);})();