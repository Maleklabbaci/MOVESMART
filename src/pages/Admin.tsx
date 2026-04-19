import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Upload, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMPTY_FORM = { title: '', type: 'Apartment', location: '', price: '', beds: '', baths: '', area: '', description: '' };
const TYPES = ['Apartment', 'Villa', 'Penthouse', 'House', 'Townhouse', 'Studio', 'Office', 'Land'];

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email ou mot de passe incorrect.');
    setLoginLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const openAdd = () => { setForm(EMPTY_FORM); setImages([]); setEditingId(null); setShowForm(true); };

  const openEdit = (l) => {
    setForm({ title: l.title || '', type: l.type || 'Apartment', location: l.location || '', price: l.price?.toString() || '', beds: l.beds?.toString() || '', baths: l.baths?.toString() || '', area: l.area?.toString() || '', description: l.description || '' });
    setImages(Array.isArray(l.images) ? l.images : []);
    setEditingId(l.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce bien ?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter((l: any) => l.id !== id));
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImages(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from('photos').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setImages(prev => [...prev, ...uploaded]);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    const payload = {
      title: form.title, type: form.type, location: form.location,
      price: parseInt(form.price), beds: parseInt(form.beds),
      baths: parseInt(form.baths), area: parseInt(form.area),
      description: form.description, images,
    };
    let error;
    if (editingId) ({ error } = await supabase.from('listings').update(payload).eq('id', editingId));
    else ({ error } = await supabase.from('listings').insert(payload));
    setSaveLoading(false);
    if (!error) {
      setSuccessMsg(editingId ? 'Bien modifié ✓' : 'Bien ajouté ✓');
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowForm(false);
      fetchListings();
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // LOGIN
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Connectez-vous pour gérer vos biens</p>
          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition"
                placeholder="votre@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition pr-10"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50">
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition font-semibold text-sm">
              <Plus className="w-4 h-4" /> Ajouter un bien
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        {successMsg && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">{successMsg}</div>}

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400">Aucun bien. Cliquez sur "Ajouter un bien".</td></tr>
              ) : listings.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {l.images?.[0]
                      ? <img src={l.images[0]} alt={l.title} className="w-14 h-14 object-cover rounded-lg" />
                      : <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
                    }
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{l.title}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">{l.type}</span></td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {l.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(l)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button onClick={() => handleDelete(l.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Modifier le bien' : 'Ajouter un bien'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ex: Luxury Villa Downtown" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ex: Dubai Marina" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (AED) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="2500000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surface (sqft) *</label>
                  <input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="1500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chambres *</label>
                  <input type="number" value={form.beds} onChange={e => setForm({ ...form, beds: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="3" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain *</label>
                  <input type="number" value={form.baths} onChange={e => setForm({ ...form, baths: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" rows={3} placeholder="Description du bien..." />
              </div>

              {/* UPLOAD PHOTOS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Clique pour uploader des photos</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — plusieurs fichiers acceptés</p>
                  {uploadingImages && <p className="text-xs text-amber-600 mt-2 font-medium">Upload en cours...</p>}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUploadPhotos} className="hidden" />

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                  Annuler
                </button>
                <button type="submit" disabled={saveLoading || uploadingImages}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition font-semibold text-sm disabled:opacity-50">
                  <Save className="w-4 h-4" />
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
