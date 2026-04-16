import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings, Listing } from '../context/ListingsContext';
import {
  Plus, Pencil, Trash2, LogOut, Home, X, Check,
  Bed, Bath, Square, ImagePlus, ChevronDown
} from 'lucide-react';

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Penthouse', 'House', 'Townhouse', 'Studio'];

const emptyForm = {
  title: '',
  type: 'Apartment',
  location: 'Dubai, UAE',
  price: '',
  beds: '',
  baths: '',
  area: '',
  description: '',
  images: [''],
  featured: false,
};

type FormData = typeof emptyForm;

function ListingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Listing>;
  onSave: (data: Omit<Listing, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    title: initial?.title || '',
    type: initial?.type || 'Apartment',
    location: initial?.location || 'Dubai, UAE',
    price: initial?.price?.toString() || '',
    beds: initial?.beds?.toString() || '',
    baths: initial?.baths?.toString() || '',
    area: initial?.area?.toString() || '',
    description: initial?.description || '',
    images: initial?.images?.length ? initial.images : [''],
    featured: initial?.featured || false,
  });

  const set = (field: keyof FormData, value: any) =>
    setForm(f => ({ ...f, [field]: value }));

  const setImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    set('images', imgs);
  };

  const addImage = () => set('images', [...form.images, '']);
  const removeImage = (i: number) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: form.title,
      type: form.type,
      location: form.location,
      price: parseInt(form.price),
      beds: parseInt(form.beds),
      baths: parseInt(form.baths),
      area: parseInt(form.area),
      description: form.description,
      images: form.images.filter(Boolean),
      featured: form.featured,
    });
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Property Title</label>
          <input className={inputClass} placeholder="e.g. Luxury Villa in Palm Jumeirah" required
            value={form.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
          <div className="relative">
            <select className={inputClass + ' appearance-none pr-8 cursor-pointer'}
              value={form.type} onChange={e => set('type', e.target.value)}>
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
          <input className={inputClass} placeholder="Dubai, UAE"
            value={form.location} onChange={e => set('location', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (AED)</label>
          <input className={inputClass} type="number" placeholder="5000000" required
            value={form.price} onChange={e => set('price', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Area (sqft)</label>
          <input className={inputClass} type="number" placeholder="3000" required
            value={form.area} onChange={e => set('area', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
          <input className={inputClass} type="number" placeholder="3" min="0" required
            value={form.beds} onChange={e => set('beds', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bathrooms</label>
          <input className={inputClass} type="number" placeholder="2" min="0" required
            value={form.baths} onChange={e => set('baths', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
        <textarea className={inputClass + ' resize-none'} rows={3}
          placeholder="Describe the property..."
          value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URLs</label>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputClass} placeholder="https://images.unsplash.com/..."
                value={img} onChange={e => setImage(i, e.target.value)} />
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImage}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition font-medium mt-1">
            <ImagePlus className="w-4 h-4" /> Add another image
          </button>
        </div>
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className={`w-10 h-6 rounded-full transition-colors ${form.featured ? 'bg-black' : 'bg-gray-200'}`}
          onClick={() => set('featured', !form.featured)}>
          <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${form.featured ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit"
          className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> Save Property
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { listings, addListing, updateListing, deleteListing } = useListings();
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdd = (data: Omit<Listing, 'id'>) => {
    addListing(data);
    setView('list');
    showToast('✅ Property added successfully!');
  };

  const handleEdit = (data: Omit<Listing, 'id'>) => {
    if (!editTarget) return;
    updateListing(editTarget.id, data);
    setView('list');
    setEditTarget(null);
    showToast('✅ Property updated successfully!');
  };

  const handleDelete = (id: number) => {
    deleteListing(id);
    setDeleteConfirm(null);
    showToast('🗑️ Property deleted.');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="https://i.ibb.co/60PJ8PVw/aass.png" alt="MoveSmart" className="h-8 w-auto brightness-0" referrerPolicy="no-referrer" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-3">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition font-medium">
            <Home className="w-4 h-4" /> View Site
          </a>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition font-medium bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Properties</h1>
            <p className="text-gray-500 text-sm mt-1">{listings.length} listings total</p>
          </div>
          {view === 'list' && (
            <button onClick={() => setView('add')}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition">
              <Plus className="w-4 h-4" /> Add Property
            </button>
          )}
          {view !== 'list' && (
            <button onClick={() => { setView('list'); setEditTarget(null); }}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        {(view === 'add' || view === 'edit') && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">{view === 'add' ? 'Add New Property' : 'Edit Property'}</h2>
            <ListingForm
              initial={editTarget || undefined}
              onSave={view === 'add' ? handleAdd : handleEdit}
              onCancel={() => { setView('list'); setEditTarget(null); }}
            />
          </div>
        )}

        {/* Listings table */}
        {view === 'list' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {listings.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <p className="text-lg font-medium">No properties yet.</p>
                <p className="text-sm mt-1">Click "Add Property" to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {/* Table header */}
                <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                  <div className="col-span-1">Photo</div>
                  <div className="col-span-4">Property</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Details</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {listings.map(listing => (
                  <div key={listing.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition group">
                    <div className="col-span-1">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="col-span-4 pr-4">
                      <p className="font-semibold text-sm text-gray-900 truncate">{listing.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{listing.location}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {listing.type}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm font-bold text-gray-900">
                      AED {listing.price.toLocaleString()}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{listing.beds}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{listing.baths}</span>
                        <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" />{listing.area.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditTarget(listing); setView('edit'); }}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === listing.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(listing.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Confirm delete">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(listing.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full shadow-xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
