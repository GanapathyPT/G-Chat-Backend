(this["webpackJsonpg-chat"]=this["webpackJsonpg-chat"]||[]).push([[0],{101:function(e,t,n){e.exports={sideBarContainer:"SideBar_sideBarContainer__R9HZo",headerContainer:"SideBar_headerContainer__3ydQ7",headerLogo:"SideBar_headerLogo__2HuW0",hidden:"SideBar_hidden__1aeSv"}},133:function(e,t,n){e.exports={authContainer:"AuthLayout_authContainer__lyNfd",authHeading:"AuthLayout_authHeading__1_lfe",authCard:"AuthLayout_authCard__c-7Cw"}},152:function(e,t,n){e.exports={alertContainer:"Login_alertContainer__2EguZ"}},201:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(43),s=n.n(c),o=n(36),u=(n(175),n(82)),i=n(14),l=n(6),d=n.n(l),j=n(16),f=n(8),b=n(218),p=n(99),h=n(45),m=n(202),O=n(152),v=n.n(O),x=n(2);function g(e){var t=e.ctrlRef,n=e.onSubmit,a=Object(r.useState)(""),c=Object(f.a)(a,2),s=c[0],o=c[1],u=Object(r.useState)(""),i=Object(f.a)(u,2),l=i[0],O=i[1],g=Object(r.useState)({}),_=Object(f.a)(g,2),C=_[0],w=_[1],k=Object(r.useState)(!1),y=Object(f.a)(k,2),R=y[0],S=y[1],L=function(){var e=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return O(""),e.next=3,n(s,l);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(r.useImperativeHandle)(t,(function(){return{setError:w,setLoading:S}}),[]),Object(x.jsxs)(b.a,{onSubmit:L,children:[C.general?Object(x.jsx)("div",{className:v.a.alertContainer,children:Object(x.jsxs)(p.a,{prompt:!0,color:"red",children:[Object(x.jsx)(h.a,{name:"exclamation circle"}),C.general]})}):null,Object(x.jsx)(b.a.Input,{required:!0,label:"Email",type:"email",inputmode:"email",placeholder:"email",icon:"mail",iconPosition:"left",value:s,onChange:function(e){return o(e.target.value)}}),Object(x.jsx)(b.a.Input,{required:!0,label:"Password",placeholder:"password",type:"password",icon:"key",iconPosition:"left",value:l,onChange:function(e){return O(e.target.value)}}),Object(x.jsx)(m.a,{type:"submit",primary:!0,loading:R,disabled:R,children:"Sign In"})]})}var _=n(220),C=n(133),w=n.n(C);function k(e){var t=e.heading,n=e.cardContent,r=e.extra;return Object(x.jsxs)("div",{className:w.a.authContainer,children:[Object(x.jsx)(_.a,{color:"blue",raised:!0,children:Object(x.jsxs)("div",{className:w.a.authCard,children:[Object(x.jsx)("h2",{className:w.a.authHeading,children:t}),n]})}),Object(x.jsx)("small",{children:r})]})}var y,R=n(10),S=n(125),L=n.n(S),A="/api/",N="",I=function(e){N=e},E=function(){return L.a.create({baseURL:A,timeout:5e3,headers:N?{Authorization:"Bearer ".concat(N)}:{}})};!function(e){e.AcessToken="ACCESS_TOKEN",e.RefreshToken="REFRESH_TOKEN"}(y||(y={}));var T=function(e,t){localStorage.setItem(e,t)},P=function(e){localStorage.removeItem(e)},B=function(e){return localStorage.getItem(e)},H=n(61);function M(e){return"https://avatars.dicebear.com/api/avataaars/".concat(e||(Math.random()+1).toString(36).substring(t||7),".svg");var t}function U(e){return JSON.parse(JSON.stringify(e))}function F(e,t){return null!==e.title?e.title:e.users[0].id===t?e.users[1].username:e.users[0].username}function D(e){var t=q(e);return void 0===t?"Tap to start the conversation":t.content}function q(e){if(0!==e.messages.length)return e.messages[e.messages.length-1]}function J(e,t,n){return e.map((function(e){return e.id===t?Object(R.a)(Object(R.a)({},e),n(U(e))):e}))}function V(e){if(0===e.messages.length)return 0;var t=e.messages.findIndex((function(t){return t.id===e.last_read_message}));return e.messages.length-t-1}function z(e){return U(e).map((function(e){return Object(R.a)(Object(R.a)({},e),{},{unreadCount:V(e)})})).sort((function(e,t){return t.unreadCount-e.unreadCount}))}function K(e){return W.apply(this,arguments)}function W(){return(W=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("chat/add_room/",{users:t});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Z(){return G.apply(this,arguments)}function G(){return(G=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().get("chat/rooms/");case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Q(e,t){return X.apply(this,arguments)}function X(){return(X=Object(j.a)(d.a.mark((function e(t,n){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("chat/new_message/",{content:t,room:n});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Y(e){return $.apply(this,arguments)}function $(){return($=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("chat/get_new_messages/",{room_list:t});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ee(e,t){return te.apply(this,arguments)}function te(){return(te=Object(j.a)(d.a.mark((function e(t,n){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("chat/mark_as_read/",{room_id:t,last_read_message:n});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ne,re=!1,ae=Object(o.b)({default:[],key:"rooms"}),ce=Object(o.b)({default:void 0,key:"selectedRoom"}),se=Object(o.b)({default:[],key:"roomList"});function oe(){var e=Object(o.c)(ae),t=Object(f.a)(e,2),n=t[0],a=t[1],c=Object(o.e)(se),s=Object(o.c)(ce),u=Object(f.a)(s,2),i=u[0],l=u[1];Object(r.useEffect)((function(){Object(j.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!re){e.next=2;break}return e.abrupt("return");case 2:return re=!0,e.next=5,Z();case 5:t=e.sent,a(t);case 7:case"end":return e.stop()}}),e)})))()}),[]),Object(r.useEffect)((function(){var e=n.map((function(e){var t=q(e);return{room_id:e.id,last_message:void 0!==t?t.id:-1}}));c(e)}),[n]);var b=Object(r.useCallback)(function(){var e=Object(j.a)(d.a.mark((function e(t){var r,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(l(t),r=J(n,t,(function(e){var t=q(e);return Object(R.a)(Object(R.a)({},e),{},{last_read_message:void 0!==t?t.id:-1})})),a(r),void 0!==(c=r.find((function(e){return e.id===t})))&&-1!==c.last_read_message){e.next=6;break}return e.abrupt("return");case 6:return e.next=8,ee(t,c.last_read_message);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[n,a,l]),p=Object(r.useCallback)((function(){l(void 0)}),[l]),h=Object(r.useCallback)(function(){var e=Object(j.a)(d.a.mark((function e(t){var n,r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==i){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Q(t,i);case 4:n=e.sent,r=n.id,a((function(e){return J(e,i,(function(e){return Object(R.a)(Object(R.a)({},e),{},{last_read_message:r})}))}));case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[a,i]),m=Object(r.useCallback)((function(e){a((function(t){return[].concat(Object(H.a)(t),[e])})),l(e.id)}),[a,l]),O=Object(r.useCallback)((function(e){return n.find((function(t){return 2===t.users.length&&t.users.some((function(t){return t.id===e}))}))}),[n]),v=Object(r.useCallback)((function(){re=!1,a([]),c([]),l(void 0)}),[l,c,a]);return{rooms:n,selectedRoom:n.find((function(e){return e.id===i})),selectRoom:b,addRoom:m,deSelectRoom:p,addMessage:h,resetStates:v,getRoomIfAlreadyThere:O}}function ue(e,t,n){return ie.apply(this,arguments)}function ie(){return(ie=Object(j.a)(d.a.mark((function e(t,n,r){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("auth/register/",{username:t,email:n,password:r,confirm_password:r});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function le(e,t){return de.apply(this,arguments)}function de(){return(de=Object(j.a)(d.a.mark((function e(t,n){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("auth/token/",{email:t,password:n});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function je(){return fe.apply(this,arguments)}function fe(){return(fe=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().get("auth/me/");case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function be(e){return pe.apply(this,arguments)}function pe(){return(pe=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().post("auth/refresh/",{refresh:t});case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function he(e){return me.apply(this,arguments)}function me(){return(me=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E().get("auth/search/?username=".concat(t));case 2:return e.abrupt("return",e.sent.data);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Oe,ve,xe=function(){var e=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return I(t.access),T(y.AcessToken,t.access),T(y.RefreshToken,t.refresh),e.next=5,je();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();!function(e){e.NotAuthenticated="NOT_AUTHENTICATED",e.Authenticated="AUTHENTICATED",e.AuthenticationLoading="AUTHENTICATION_LOADING"}(ve||(ve={}));var ge=Object(r.createContext)({}),_e=function(e){var t=e.children,n=Object(r.useState)({status:ve.AuthenticationLoading}),a=Object(f.a)(n,2),c=a[0],s=a[1],o=Object(R.a)(Object(R.a)({},c),function(e){return{login:function(){var t=Object(j.a)(d.a.mark((function t(n,r){var a,c;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,le(n,r);case 2:return a=t.sent,t.next=5,xe(a);case 5:c=t.sent,e(Object(R.a)(Object(R.a)({},c),{},{status:ve.Authenticated}));case 7:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),register:function(){var t=Object(j.a)(d.a.mark((function t(n,r,a){var c,s;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ue(n,r,a);case 2:return c=t.sent,t.next=5,xe(c);case 5:s=t.sent,e(Object(R.a)(Object(R.a)({},s),{},{status:ve.Authenticated}));case 7:case"end":return t.stop()}}),t)})));return function(e,n,r){return t.apply(this,arguments)}}(),authenticate:function(){var t=Object(j.a)(d.a.mark((function t(n){var r,a,c,s;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null!==n){t.next=3;break}return e((function(e){return Object(R.a)(Object(R.a)({},e),{},{status:ve.NotAuthenticated})})),t.abrupt("return");case 3:return t.prev=3,e((function(e){return Object(R.a)(Object(R.a)({},e),{},{status:ve.AuthenticationLoading})})),I(n),t.next=8,je();case 8:r=t.sent,e(Object(R.a)(Object(R.a)({},r),{},{status:ve.Authenticated})),t.next=33;break;case 12:if(t.prev=12,t.t0=t.catch(3),console.error(t.t0),t.prev=15,null!==(a=B(y.RefreshToken))){t.next=19;break}return t.abrupt("return");case 19:return t.next=21,be(a);case 21:return c=t.sent,I(c.access),t.next=25,je();case 25:s=t.sent,e(Object(R.a)(Object(R.a)({},s),{},{status:ve.Authenticated})),t.next=33;break;case 29:t.prev=29,t.t1=t.catch(15),console.error(t.t1),e((function(e){return Object(R.a)(Object(R.a)({},e),{},{status:ve.NotAuthenticated})}));case 33:case"end":return t.stop()}}),t,null,[[3,12],[15,29]])})));return function(e){return t.apply(this,arguments)}}(),logout:function(){I(""),P(y.AcessToken),P(y.RefreshToken),e({status:ve.NotAuthenticated})}}}(s));return Object(x.jsx)(ge.Provider,{value:o,children:t})},Ce=function(){return Object(r.useContext)(ge)};function we(){var e=Ce().login,t=Object(i.g)(),n=Object(r.useRef)(),a=function(){var r=Object(j.a)(d.a.mark((function r(a,c){var s,o,u,i;return d.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,null===(s=n.current)||void 0===s||s.setLoading(!0),null===(o=n.current)||void 0===o||o.setError({}),r.next=5,e(a,c);case 5:t("/"),r.next=12;break;case 8:r.prev=8,r.t0=r.catch(0),null===(u=n.current)||void 0===u||u.setError({general:"Invalid Credentials"}),console.error(r.t0);case 12:return r.prev=12,null===(i=n.current)||void 0===i||i.setLoading(!1),r.finish(12);case 15:case"end":return r.stop()}}),r,null,[[0,8,12,15]])})));return function(e,t){return r.apply(this,arguments)}}();return Object(x.jsx)(k,{heading:"Login",cardContent:Object(x.jsx)(g,{ctrlRef:n,onSubmit:a}),extra:Object(x.jsxs)(x.Fragment,{children:["Don't have an account? ",Object(x.jsx)(u.b,{to:"/register",children:"Register"})]})})}function ke(e){var t=e.ctrlRef,n=e.onSubmit,a=Object(r.useState)(""),c=Object(f.a)(a,2),s=c[0],o=c[1],u=Object(r.useState)(""),i=Object(f.a)(u,2),l=i[0],p=i[1],h=Object(r.useState)(""),O=Object(f.a)(h,2),v=O[0],g=O[1],_=Object(r.useState)({}),C=Object(f.a)(_,2),w=C[0],k=C[1],y=Object(r.useState)(!1),R=Object(f.a)(y,2),S=R[0],L=R[1],A=function(){var e=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return g(""),e.next=3,n(s,l,v);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(r.useImperativeHandle)(t,(function(){return{setError:k,setLoading:L}}),[]),Object(x.jsxs)(b.a,{onSubmit:A,children:[Object(x.jsx)(b.a.Input,{required:!0,label:"UserName",placeholder:"username",type:"text",icon:"user",iconPosition:"left",value:s,onChange:function(e){return o(e.target.value)},error:w.username}),Object(x.jsx)(b.a.Input,{required:!0,label:"Email",type:"email",inputmode:"email",placeholder:"email",icon:"mail",iconPosition:"left",value:l,onChange:function(e){return p(e.target.value)},error:w.email}),Object(x.jsx)(b.a.Input,{required:!0,label:"Password",placeholder:"password",type:"password",icon:"key",iconPosition:"left",value:v,onChange:function(e){return g(e.target.value)},error:w.password}),Object(x.jsx)(m.a,{type:"submit",primary:!0,loading:S,disabled:S,children:"Sign Up"})]})}function ye(){var e=Ce().register,t=Object(i.g)(),n=Object(r.useRef)(),a=function(){var r=Object(j.a)(d.a.mark((function r(a,c,s){var o,u,i,l;return d.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,null===(o=n.current)||void 0===o||o.setLoading(!0),null===(u=n.current)||void 0===u||u.setError({}),r.next=5,e(a,c,s);case 5:t("/"),r.next=12;break;case 8:r.prev=8,r.t0=r.catch(0),null===(i=n.current)||void 0===i||i.setError(r.t0.response.data),console.error(r.t0);case 12:return r.prev=12,null===(l=n.current)||void 0===l||l.setLoading(!1),r.finish(12);case 15:case"end":return r.stop()}}),r,null,[[0,8,12,15]])})));return function(e,t,n){return r.apply(this,arguments)}}();return Object(x.jsx)(k,{heading:"Register",cardContent:Object(x.jsx)(ke,{ctrlRef:n,onSubmit:a}),extra:Object(x.jsxs)(x.Fragment,{children:["Already have an account? ",Object(x.jsx)(u.b,{to:"/login",children:"Login"})]})})}var Re=n(221),Se=n(214);function Le(){return Object(x.jsx)(Re.a,{active:!0,inverted:!0,children:Object(x.jsx)(Se.a,{})})}function Ae(e){var t=e.element,n=e.loggedIn,r=Ce().status;return r===ve.Authenticated?!0===n?t:Object(x.jsx)(i.a,{replace:!0,to:"/"}):r===ve.NotAuthenticated&&!0!==n?t:Object(x.jsx)(i.a,{replace:!0,to:"/login"})}var Ne=n(215),Ie=n(156),Ee=n(223),Te=n(155),Pe=n(224),Be=n(213),He=n(73),Me=n.n(He),Ue=function(){return Object(x.jsx)("div",{className:Me.a.emptyChatRoomContainer,children:Object(x.jsxs)(Ee.a,{as:"h2",icon:!0,children:[Object(x.jsx)(h.a,{name:"user"}),"Select a Friend to Chat",Object(x.jsx)(Ee.a.Subheader,{children:"select the friend from the sidebar to chat"})]})})},Fe=Object(r.memo)((function(e){var t=e.messages,n=Ce().id;return Object(x.jsx)(x.Fragment,{children:t.map((function(e){return Object(x.jsx)("p",{className:"".concat(Me.a.chatMessage," ").concat(e.author===n?Me.a.ourMessage:""),children:Object(x.jsx)("span",{children:e.content})},e.id)}))})}),(function(e,t){var n=e.messages,r=t.messages;return n.length===r.length&&n[n.length-1]===r[r.length-1]}));function De(){var e=Object(r.useRef)(null),t=oe(),n=t.selectedRoom,a=t.deSelectRoom,c=t.addMessage,s=Object(r.useState)(""),o=Object(f.a)(s,2),u=o[0],i=o[1];return Object(r.useEffect)((function(){null!==e.current&&e.current.scrollIntoView()}),[n,null===n||void 0===n?void 0:n.messages]),void 0===n?Object(x.jsx)(Ue,{}):Object(x.jsx)(Te.a,{computer:12,mobile:16,children:Object(x.jsxs)(Pe.a,{className:Me.a.chatRoomContainer,children:[Object(x.jsx)(h.a,{className:Me.a.backButton,name:"arrow left",size:"big",onClick:a}),Object(x.jsxs)("div",{className:Me.a.messagesContainer,children:[Object(x.jsx)(Fe,{messages:n.messages}),Object(x.jsx)("div",{ref:e})]}),Object(x.jsx)(Be.a,{autoFocus:!0,value:u,onKeyPress:function(e){13===e.charCode&&(c(e.target.value),i(""))},onChange:function(e){return i(e.target.value)},label:Object(x.jsx)(m.a,{primary:!0,icon:!0,active:!0,onClick:function(){c(u),i("")},children:Object(x.jsx)(h.a,{name:"send"})}),labelPosition:"right",placeholder:"Type anything . . ."})]})})}var qe,Je=n(217),Ve=n(157),ze=n(216);var Ke=n(219),We=n(62),Ze=n.n(We),Ge=function(e){var t=e.username;return Object(x.jsx)("div",{className:Ze.a.emptyListContainer,children:Object(x.jsxs)(Ee.a,{as:"h2",icon:!0,children:[Object(x.jsx)(h.a,{name:"hand peace"}),"Hii ",t,Object(x.jsx)(Ee.a.Subheader,{children:"search for admin to chat with me"})]})})},Qe=function(e){var t=e.count;return e.hidden?null:Object(x.jsx)("div",{className:Ze.a.unreadCountContainer,children:Object(x.jsx)(p.a,{color:"red",floating:!0,circular:!0,children:t})})};function Xe(){var e=Ce(),t=e.id,n=e.username,r=oe(),a=r.rooms,c=r.selectedRoom,s=r.selectRoom;return 0===a.length&&void 0!==n?Object(x.jsx)(Ge,{username:n}):Object(x.jsx)(Ke.a,{animated:!0,celled:!0,size:"big",className:Ze.a.roomsList,children:z(a).map((function(e){return Object(x.jsx)(Ke.a.Item,{onClick:function(){return s(e.id)},style:{padding:0},children:Object(x.jsx)("div",{className:e.id===(null===c||void 0===c?void 0:c.id)?Ze.a.active:"",children:Object(x.jsxs)("div",{className:Ze.a.roomItem,children:[Object(x.jsx)("div",{className:Ze.a.profilePic,children:Object(x.jsx)(Ve.a,{avatar:!0,src:M("".concat(e.id,"_").concat(t))})}),Object(x.jsxs)(Ke.a.Content,{children:[Object(x.jsx)(Ke.a.Header,{children:F(e,t)}),Object(x.jsx)(Ke.a.Description,{children:Object(x.jsx)("p",{className:Ze.a.description,children:D(e)})}),Object(x.jsx)(Qe,{count:e.unreadCount,hidden:0===e.unreadCount||(null===c||void 0===c?void 0:c.id)===e.id})]})]})})},e.id)}))})}var Ye=n(101),$e=n.n(Ye),et=function(){var e=function(){var e=Object(r.useState)(!1),t=Object(f.a)(e,2),n=t[0],a=t[1];return Object(r.useEffect)((function(){var e=function(e){e.preventDefault(),qe=e,a(!0)};return window.addEventListener("beforeinstallprompt",e),function(){return window.removeEventListener("beforeinstallprompt",e)}}),[]),Object(r.useEffect)((function(){var e=function(e){a(!1),qe=void 0};return window.addEventListener("appinstalled",e),function(){return window.removeEventListener("appinstalled",e)}}),[]),{isPromptVisible:n,showPrompt:function(){var e=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==qe){e.next=2;break}return e.abrupt("return");case 2:return qe.prompt(),e.next=5,qe.userChoice;case 5:"accepted"===e.sent.outcome&&a(!1);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}}(),t=e.isPromptVisible,n=e.showPrompt;return t?Object(x.jsxs)(Je.a.Item,{onClick:n,children:[Object(x.jsx)(h.a,{name:"download"}),"Install"]}):null},tt=function(e){var t=e.logout;return Object(x.jsx)(Je.a,{simple:!0,direction:"left",icon:"ellipsis vertical",children:Object(x.jsxs)(Je.a.Menu,{children:[Object(x.jsxs)(Je.a.Item,{onClick:t,children:[Object(x.jsx)(h.a,{name:"power off"}),"Logout"]}),Object(x.jsx)(et,{})]})})};function nt(){var e=Ce(),t=e.username,n=e.logout,a=function(){var e=Ce().id,t=oe(),n=t.selectRoom,a=t.addRoom,c=t.getRoomIfAlreadyThere,s=Object(r.useState)(""),o=Object(f.a)(s,2),u=o[0],i=o[1],l=Object(r.useState)(!1),b=Object(f.a)(l,2),p=b[0],h=b[1],m=Object(r.useState)([]),O=Object(f.a)(m,2),v=O[0],x=O[1],g=function(){var t=Object(j.a)(d.a.mark((function t(n){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return void 0!==Oe&&Oe.cancel(),Oe=L.a.CancelToken.source(),t.next=4,he(n);case 4:return r=t.sent,t.abrupt("return",r.filter((function(t){return t.id!==e})).map((function(e){return{id:e.id,title:e.username,description:e.email}})));case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return{onSearchChange:function(){var e=Object(j.a)(d.a.mark((function e(t,n){var r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.value){e.next=10;break}return i(n.value),h(!0),e.next=5,g(n.value);case 5:r=e.sent,x(r),h(!1),e.next=11;break;case 10:i("");case 11:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),onResultSelect:function(){var e=Object(j.a)(d.a.mark((function e(t,r){var s,o,u;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s=r.result.id,void 0!==(o=c(s))){e.next=9;break}return e.next=5,K([s]);case 5:u=e.sent,a(u),e.next=10;break;case 9:n(o.id);case 10:x([]),i("");case 12:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),searchLoading:p,searchResult:v,searchText:u}}(),c=a.onResultSelect,s=a.onSearchChange,o=a.searchLoading,u=a.searchResult,i=a.searchText,l=oe().selectedRoom;return Object(x.jsx)(Te.a,{computer:4,mobile:16,children:Object(x.jsxs)("div",{className:"".concat($e.a.sideBarContainer," ").concat(l?$e.a.hidden:""),children:[Object(x.jsxs)("div",{className:$e.a.headerContainer,children:[Object(x.jsxs)(Ee.a,{as:"h1",children:[Object(x.jsx)(Ve.a,{circular:!0,src:"/logo.png",className:$e.a.headerLogo}),Object(x.jsxs)(Ee.a.Content,{children:["G Chat",Object(x.jsx)(Ee.a.Subheader,{children:t})]})]}),Object(x.jsx)(tt,{logout:n})]}),Object(x.jsx)(ze.a,{placeholder:"Search User . . .",loading:o,onResultSelect:c,onSearchChange:s,results:u,value:i}),Object(x.jsx)(Xe,{})]})})}function rt(){return Object(x.jsx)(Ne.a,{columns:"two",divided:!0,children:Object(x.jsxs)(Ie.a,{children:[Object(x.jsx)(nt,{}),Object(x.jsx)(De,{})]})})}function at(){!function(){var e=Ce().status,t=Object(o.e)(ae),n=Object(o.d)(se);Object(r.useEffect)((function(){if(e===ve.Authenticated&&n.length>0)return ne=setInterval(Object(j.a)(d.a.mark((function e(){var r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Y(n);case 2:if(r=e.sent,Object.values(r).some((function(e){return e.length>0}))){e.next=5;break}return e.abrupt("return");case 5:t((function(e){var t=U(e);return Object.keys(r).forEach((function(e){var n,a=parseInt(e);if(0!==r[a].length){var c=t.findIndex((function(e){return e.id===a}));(n=t[c].messages).push.apply(n,Object(H.a)(r[a]))}})),t}));case 6:case"end":return e.stop()}}),e)}))),1e3),function(){return clearInterval(ne)}}),[e,n])}(),function(){var e=Ce().status;Object(r.useEffect)((function(){if(e===ve.Authenticated&&"serviceWorker"in navigator){var t="".concat("","/service-worker.js");navigator.serviceWorker.register(t)}}),[e])}();var e=oe().resetStates;return Object(r.useEffect)((function(){return e}),[]),Object(x.jsx)(rt,{})}var ct=function(){var e=Ce(),t=e.authenticate,n=e.status;return Object(r.useEffect)((function(){var e=B(y.AcessToken);t(e)}),[]),n===ve.AuthenticationLoading?Object(x.jsx)(Le,{}):Object(x.jsx)(u.a,{children:Object(x.jsxs)(i.d,{children:[Object(x.jsx)(i.b,{path:"/login",element:Object(x.jsx)(Ae,{element:Object(x.jsx)(we,{})})}),Object(x.jsx)(i.b,{path:"/register",element:Object(x.jsx)(Ae,{element:Object(x.jsx)(ye,{})})}),Object(x.jsx)(i.b,{path:"/",element:Object(x.jsx)(Ae,{element:Object(x.jsx)(at,{}),loggedIn:!0})})]})})};s.a.render(Object(x.jsx)(a.a.StrictMode,{children:Object(x.jsx)(o.a,{children:Object(x.jsx)(_e,{children:Object(x.jsx)(ct,{})})})}),document.getElementById("root"))},62:function(e,t,n){e.exports={emptyListContainer:"RoomsList_emptyListContainer__33yxa",roomsList:"RoomsList_roomsList__31XFJ",roomItem:"RoomsList_roomItem__2X1gb",active:"RoomsList_active__2zITE",profilePic:"RoomsList_profilePic__bFvVP",description:"RoomsList_description__3Njkr",unreadCountContainer:"RoomsList_unreadCountContainer__2Um04"}},73:function(e,t,n){e.exports={emptyChatRoomContainer:"ChatRoom_emptyChatRoomContainer__1dP8s",chatRoomContainer:"ChatRoom_chatRoomContainer__ChMZ0",backButton:"ChatRoom_backButton__2eVk_",messagesContainer:"ChatRoom_messagesContainer__1A1r9",chatMessage:"ChatRoom_chatMessage__237QU",ourMessage:"ChatRoom_ourMessage__383Bd"}}},[[201,1,2]]]);
//# sourceMappingURL=main.5a970c9d.chunk.js.map