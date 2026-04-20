import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Upload, ImageIcon, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMPTY_FORM = { title: '', type: 'Apartment', location: '', price: '', beds: '', baths: '', area: '', description: '' };
const TYPES = ['Apartment', 'Villa', 'Penthouse', 'House', 'Townhouse', 'Studio', 'Office', 'Land'];

const inputClass = "w-full px-4 py-2.5 bg-[#111] border border-white/10 focus:border-amber-400 outline-none text-white text-sm placeholder-gray-600 transition-colors duration-200 rounded-lg";
const labelClass = "block text-xs font-sans text-gray-500 tracking-[0.2em] uppercase mb-2";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) fetchListings();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchListings();
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchListings = async () => {
    const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    setListings(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email ou mot de passe incorrect.');
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setImages([]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (l: any) => {
    setForm({
      title: l.title || '', type: l.type || 'Apartment',
      location: l.location || '', price: l.price?.toString() || '',
      beds: l.beds?.toString() || '', baths: l.baths?.toString() || '',
      area: l.area?.toString() || '', description: l.description || '',
    });
    setImages(Array.isArray(l.images) ? l.images : []);
    setEditingId(l.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce bien ?')) return;
    setDeleteLoading(id);
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
    setDeleteLoading(null);
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImages(true);
    const uploaded: string[] = [];
    for (const file of files) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} est trop lourd (max 5MB)`);
        continue;
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        alert(`Erreur upload: ${uploadError.message}\n\nVérifiez que le bucket "photos" existe et est public sur Supabase.`);
        continue;
      }
      const { data } = supabase.storage.from('photos').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setImages(prev => [...prev, ...uploaded]);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    const payload = {
      title: form.title, type: form.type, location: form.location,
      price: parseInt(form.price), beds: parseInt(form.beds),
      baths: parseInt(form.baths), area: parseInt(form.area),
      description: form.description, images,
    };
    let err;
    if (editingId) ({ error: err } = await supabase.from('listings').update(payload).eq('id', editingId));
    else ({ error: err } = await supabase.from('listings').insert(payload));
    setSaveLoading(false);
    if (!err) {
      setSuccessMsg(editingId ? 'Bien modifié ✓' : 'Bien ajouté ✓');
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowForm(false);
      fetchListings();
    }
  };

  // ── LOADING ──
  if (authLoading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── LOGIN ──
  if (!user) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4"
      style={{ fontFamily: 'sans-serif' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="https://i.ibb.co/60PJ8PVw/aass.png" alt="MoveSmart"
            className="h-10 w-auto brightness-0 invert mx-auto mb-4" referrerPolicy="no-referrer" />
          <h1 className="text-2xl font-light text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-xs tracking-[0.2em] uppercase mt-2">MoveSmart Invest</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d0d] border border-white/[0.06] p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className={inputClass} placeholder="votre@email.com" required />
            </div>

            <div>
              <label className={labelClass}>Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-400 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loginLoading}
              className="w-full bg-amber-400 text-black py-3 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300 disabled:opacity-50">
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 font-sans mt-6 tracking-widest uppercase">
          Accès restreint · MoveSmart
        </p>
      </div>
    </div>
  );

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'sans-serif' }}>

      {/* TOP BAR */}
      <div className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/60PJ8PVw/aass.png" alt="MoveSmart"
              className="h-6 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <span className="hidden sm:block text-xs text-gray-500 tracking-[0.2em] uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-600 font-sans">{user.email}</span>
            <button onClick={openAdd}
              className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase hover:bg-amber-300 transition-all duration-200">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 border border-white/10 text-gray-400 px-4 py-2 text-xs tracking-[0.15em] uppercase hover:border-red-500/40 hover:text-red-400 transition-all duration-200">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Mes propriétés
          </h1>
          <p className="text-xs text-gray-600 tracking-[0.2em] uppercase">
            {listings.length} bien{listings.length > 1 ? 's' : ''} enregistré{listings.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-sans">
            <CheckCircle className="w-4 h-4 flex-shrink-0" /> {successMsg}
          </div>
        )}

        {/* TABLE */}
        <div className="border border-white/[0.06] overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-white/[0.06] bg-[#0d0d0d]">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 tracking-[0.2em] uppercase w-20">Photo</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 tracking-[0.2em] uppercase">Titre</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 tracking-[0.2em] uppercase hidden md:table-cell">Type</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 tracking-[0.2em] uppercase">Prix</th>
                <th className="px-6 py-4 text-right text-xs text-gray-600 tracking-[0.2em] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-600 text-sm font-sans">
                    Aucun bien. Cliquez sur <span className="text-amber-400">"Ajouter"</span> pour commencer.
                  </td>
                </tr>
              ) : listings.map((l: any) => (
                <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    {l.images?.[0]
                      ? <img src={l.images[0]} alt={l.title} className="w-14 h-14 object-cover" />
                      : <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-700" />
                        </div>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{l.location}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-amber-400 border border-amber-400/20 px-2 py-1 tracking-widest uppercase">{l.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-sans text-white">AED {l.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(l)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-amber-400 border border-white/[0.06] hover:border-amber-400/30 transition-all duration-200">
                        <Edit2 className="w-3.5 h-3.5" /> Modifier
                      </button>
                      <button onClick={() => handleDelete(l.id)} disabled={deleteLoading === l.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all duration-200 disabled:opacity-40">
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleteLoading === l.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-[#0d0d0d] border border-white/[0.06] w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d0d] z-10">
              <h2 className="text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {editingId ? 'Modifier le bien' : 'Ajouter un bien'}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="text-gray-600 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">

              {/* Titre */}
              <div>
                <label className={labelClass}>Titre *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className={inputClass} placeholder="Ex: Luxury Villa Downtown" required />
              </div>

              {/* Type + Localisation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className={`${inputClass} cursor-pointer`} style={{ background: '#111' }}>
                    {TYPES.map(t => <option key={t} className="bg-[#111]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Localisation *</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className={inputClass} placeholder="Ex: Dubai Marina" required />
                </div>
              </div>

              {/* Prix + Surface */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix (AED) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className={inputClass} placeholder="2500000" required />
                </div>
                <div>
                  <label className={labelClass}>Surface (sqft) *</label>
                  <input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
                    className={inputClass} placeholder="1500" required />
                </div>
              </div>

              {/* Chambres + SDB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Chambres *</label>
                  <input type="number" value={form.beds} onChange={e => setForm({ ...form, beds: e.target.value })}
                    className={inputClass} placeholder="3" required />
                </div>
                <div>
                  <label className={labelClass}>Salles de bain *</label>
                  <input type="number" value={form.baths} onChange={e => setForm({ ...form, baths: e.target.value })}
                    className={inputClass} placeholder="2" required />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`} rows={3} placeholder="Description du bien..." />
              </div>

              {/* Upload photos */}
              <div>
                <label className={labelClass}>Photos</label>
                <div onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/10 hover:border-amber-400/40 p-8 text-center cursor-pointer transition-colors duration-200 group">
                  <Upload className="w-6 h-6 text-gray-600 group-hover:text-amber-400 mx-auto mb-3 transition-colors" />
                  <p className="text-sm text-gray-500 font-sans">
                    {uploadingImages ? (
                      <span className="text-amber-400">Upload en cours...</span>
                    ) : (
                      <>Cliquer pour ajouter des photos<br /><span className="text-xs text-gray-700">JPG, PNG, WEBP · Plusieurs fichiers acceptés</span></>
                    )}
                  </p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUploadPhotos} className="hidden" />

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <X className="w-4 h-4 text-white" />
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-amber-400 text-black text-[9px] text-center py-0.5 font-sans font-bold tracking-widest uppercase">
                            Principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-white/10 text-gray-400 text-xs tracking-[0.2em] uppercase hover:border-white/20 hover:text-white transition-all duration-200">
                  Annuler
                </button>
                <button type="submit" disabled={saveLoading || uploadingImages}
                  style={{ backgroundColor: '#FBBF24', color: '#000000' }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40">
                  <Save className="w-3.5 h-3.5" />
                  {saveLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
