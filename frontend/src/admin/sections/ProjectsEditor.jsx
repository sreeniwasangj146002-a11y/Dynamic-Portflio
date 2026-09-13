import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import api, { fileUrl } from '../../api/api';
import { StatusBanner } from './shared';

function ProjectCard({ project, onSaved, onDeleted }) {
  const [draft, setDraft] = useState({ features: [], challenges: [], ...project });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const field = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });
  const listField = (key) => (e) => setDraft({ ...draft, [key]: e.target.value.split('\n').map(v=>v.trim()).filter(Boolean) });

  const addTech = () => { const val=techInput.trim(); if(!val)return; setDraft({...draft,tech:[...(draft.tech||[]),val]}); setTechInput(''); };
  const removeTech = (i) => setDraft({ ...draft, tech: draft.tech.filter((_, idx) => idx !== i) });
  const save = async () => { setSaving(true); setStatus(null); try { const res=await api.put(`/api/projects/${draft.id}`,draft); setDraft(res.data); onSaved(res.data); setStatus({type:'success',text:'Saved.'}); } catch(err){setStatus({type:'error',text:err.response?.data?.message||'Could not save.'});} finally{setSaving(false);} };
  const remove = async () => { if(!window.confirm(`Delete "${draft.title}"? This can't be undone.`))return; setDeleting(true); try{await api.delete(`/api/projects/${draft.id}`);onDeleted(draft.id);}catch(err){setStatus({type:'error',text:err.response?.data?.message||'Could not delete.'});setDeleting(false);} };
  const uploadImage = async () => { if(!file)return;setUploading(true);try{const fd=new FormData();fd.append('image',file);const res=await api.post(`/api/projects/${draft.id}/image`,fd);setDraft(res.data);onSaved(res.data);setFile(null);setStatus({type:'success',text:'Image uploaded.'});}catch(err){setStatus({type:'error',text:err.response?.data?.message||'Upload failed.'});}finally{setUploading(false);} };

  return <div className="admin-card panel-card">
    <div className="admin-card-head"><input className="admin-card-title-input" value={draft.title} placeholder="Project title" onChange={field('title')}/><button type="button" className="admin-icon-btn" onClick={remove} disabled={deleting}><FiTrash2 size={15}/></button></div>
    <StatusBanner status={status}/>
    <div className="admin-grid-2">
      <label className="admin-field"><span>Role</span><input value={draft.role||''} onChange={field('role')} placeholder="Full-Stack Developer"/></label>
      <label className="admin-field"><span>Company / Client</span><input value={draft.company||''} onChange={field('company')} placeholder="Company or client name"/></label>
      <label className="admin-field"><span>Duration</span><input value={draft.duration||''} onChange={field('duration')} placeholder="e.g. 8 months"/></label>
      <label className="admin-field"><span>Team size</span><input value={draft.teamSize||''} onChange={field('teamSize')} placeholder="e.g. 4 members / Solo"/></label>
      <label className="admin-field"><span>Live / GitHub link</span><input value={draft.link||''} onChange={field('link')} placeholder="https://…"/></label>
    </div>
    <label className="admin-field"><span>Short card description</span><textarea rows={3} value={draft.description||''} onChange={field('description')}/></label>
    <div className="admin-case-study-box"><h4>Project case study / Read More page</h4>
      <label className="admin-field"><span>Problem</span><textarea rows={3} value={draft.problem||''} onChange={field('problem')} placeholder="What problem did this project solve?"/></label>
      <label className="admin-field"><span>Solution / your approach</span><textarea rows={3} value={draft.solution||''} onChange={field('solution')} placeholder="How did you solve it?"/></label>
      <label className="admin-field"><span>Key features — one per line</span><textarea rows={5} value={(draft.features||[]).join('\n')} onChange={listField('features')}/></label>
      <label className="admin-field"><span>Challenges / engineering decisions — one per line</span><textarea rows={5} value={(draft.challenges||[]).join('\n')} onChange={listField('challenges')}/></label>
      <label className="admin-field"><span>Result / impact</span><textarea rows={3} value={draft.outcome||''} onChange={field('outcome')}/></label>
    </div>
    <div className="admin-field-group"><span className="admin-field-label">Tech stack</span><div className="admin-tag-row">{(draft.tech||[]).map((t,i)=><span className="pill admin-tag-pill" key={i}>{t}<button type="button" onClick={()=>removeTech(i)}><FiX size={12}/></button></span>)}</div><div className="admin-tag-add"><input placeholder="Add technology" value={techInput} onChange={e=>setTechInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTech();}}}/><button type="button" className="btn" onClick={addTech}><FiPlus size={14}/> Add</button></div></div>
    <div className="admin-upload-row"><div className="admin-upload-preview admin-upload-preview-sm panel-card">{draft.image?<img src={fileUrl(draft.image)} alt={draft.title}/>:<span className="admin-upload-placeholder">No image</span>}</div><div className="admin-upload-controls"><input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/><button type="button" className="btn" disabled={!file||uploading} onClick={uploadImage}><FiUploadCloud size={14}/> {uploading?'Uploading…':'Upload cover image'}</button></div></div>
    <label className="admin-checkbox"><input type="checkbox" checked={!!draft.featured} onChange={e=>setDraft({...draft,featured:e.target.checked})}/> Feature this project</label>
    <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>{saving?'Saving…':'Save project & case study'}</button>
  </div>;
}

export default function ProjectsEditor({ category, heading, subheading }) {
  const [projects,setProjects]=useState([]),[loading,setLoading]=useState(true),[creating,setCreating]=useState(false);
  const load=()=>api.get('/api/projects').then(res=>setProjects(res.data.filter(p=>(p.category||'personal')===category)));
  useEffect(()=>{setLoading(true);load().then(()=>setLoading(false));},[category]);
  const createProject=async()=>{setCreating(true);try{const res=await api.post('/api/projects',{title:'New project',category});setProjects([...projects,res.data]);}finally{setCreating(false);}};
  if(loading)return <p className="admin-loading">Loading…</p>;
  return <div className="admin-panel"><h2>{heading}</h2><p className="admin-panel-sub">{subheading} Each project can now have a full Read More case-study page.</p><button type="button" className="btn btn-primary" onClick={createProject} disabled={creating} style={{marginBottom:24}}><FiPlus size={14}/> {creating?'Adding…':'Add project'}</button>{projects.length===0&&<p className="admin-empty-hint">No projects yet.</p>}<div className="admin-card-stack">{projects.map(p=><ProjectCard key={p.id} project={p} onSaved={u=>setProjects(prev=>prev.map(x=>x.id===u.id?u:x))} onDeleted={id=>setProjects(prev=>prev.filter(x=>x.id!==id))}/>)}</div></div>;
}
