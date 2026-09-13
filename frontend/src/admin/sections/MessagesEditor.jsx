import { useEffect, useState } from 'react';
import { FiMail, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/api';
export default function MessagesEditor(){
 const[messages,setMessages]=useState([]),[loading,setLoading]=useState(true);
 const load=()=>api.get('/api/contact').then(r=>setMessages(r.data)).finally(()=>setLoading(false)); useEffect(()=>{load();},[]);
 const mark=async(m,status)=>{const r=await api.put(`/api/contact/${m.id}`,{status});setMessages(v=>v.map(x=>x.id===m.id?r.data:x));};
 const remove=async(m)=>{if(!window.confirm('Delete this message?'))return;await api.delete(`/api/contact/${m.id}`);setMessages(v=>v.filter(x=>x.id!==m.id));};
 if(loading)return <p className="admin-loading">Loading messages…</p>;
 return <div className="admin-panel"><h2>Contact Inbox</h2><p className="admin-panel-sub">Messages submitted from the portfolio are saved here even when email delivery is not configured.</p><div className="admin-card-stack">{!messages.length&&<p className="admin-empty-hint">No messages yet.</p>}{messages.map(m=><div className={`admin-card message-card message-${m.status}`} key={m.id}><div className="message-head"><div><strong><FiMail/> {m.name}</strong><a href={`mailto:${m.email}`}>{m.email}</a></div><span>{new Date(m.createdAt).toLocaleString()}</span></div><p>{m.message}</p><div className="message-actions"><button className="btn" onClick={()=>mark(m,m.status==='read'?'new':'read')}><FiCheckCircle/> {m.status==='read'?'Mark new':'Mark read'}</button><button className="btn admin-danger-btn" onClick={()=>remove(m)}><FiTrash2/> Delete</button></div></div>)}</div></div>;
}
