import React, { useEffect, useState } from 'react';
import { addressApi } from '../services/serviceApi';

const emptyForm = { fullName: '', phone: '', houseNo: '', street: '', city: '', state: '', pincode: '', landmark: '', isDefault: false };

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const response = await addressApi.list();
      setAddresses(response.data.data.addresses || []);
      setError('');
    } catch (err) { setError(err.response?.data?.message || 'Failed to load addresses.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startCreate = () => { setForm(emptyForm); setEditingId(null); setOpen(true); };
  const startEdit = (address) => { setForm({ ...emptyForm, ...address }); setEditingId(address._id); setOpen(true); };
  const save = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); setError('');
      if (editingId) await addressApi.update(editingId, form); else await addressApi.create(form);
      setOpen(false); await load();
    } catch (err) { setError(err.response?.data?.message || 'Could not save address.'); }
    finally { setSaving(false); }
  };
  const remove = async (id) => { if (!window.confirm('Delete this address?')) return; await addressApi.delete(id); await load(); };
  const makeDefault = async (id) => { await addressApi.setDefault(id); await load(); };

  return <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-5 md:p-10 text-slate-900 dark:text-white">
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center gap-4 mb-8"><div><h1 className="text-3xl font-black">Address Book</h1><p className="text-slate-500">Saved service locations</p></div><button onClick={startCreate} className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined">add</span>Add address</button></div>
      {error && <div className="mb-5 p-4 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}
      {loading ? <p className="text-slate-500">Loading addresses...</p> : <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => <article key={address._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
          <div className="flex justify-between"><div><h2 className="font-black">{address.fullName}</h2><p className="text-sm text-slate-500">{address.phone}</p></div>{address.isDefault && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 h-fit px-2 py-1 rounded">Default</span>}</div>
          <p className="text-sm mt-4 leading-6">{address.houseNo}, {address.street}{address.landmark ? `, ${address.landmark}` : ''}<br />{address.city}, {address.state} - {address.pincode}</p>
          <div className="flex gap-2 mt-5"><button onClick={() => startEdit(address)} className="p-2 rounded hover:bg-slate-100" title="Edit address"><span className="material-symbols-outlined">edit</span></button><button onClick={() => remove(address._id)} className="p-2 rounded text-rose-600 hover:bg-rose-50" title="Delete address"><span className="material-symbols-outlined">delete</span></button>{!address.isDefault && <button onClick={() => makeDefault(address._id)} className="ml-auto text-sm font-bold text-indigo-600">Set default</button>}</div>
        </article>)}
        {!addresses.length && <div className="md:col-span-2 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500">No saved addresses.</div>}
      </div>}
    </div>
    {open && <div className="fixed inset-0 z-[100] bg-black/40 grid place-items-center p-4" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}><form onSubmit={save} className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6"><div className="flex justify-between mb-5"><h2 className="text-xl font-black">{editingId ? 'Edit address' : 'Add address'}</h2><button type="button" onClick={() => setOpen(false)}><span className="material-symbols-outlined">close</span></button></div><div className="grid sm:grid-cols-2 gap-4">
      {['fullName','phone','houseNo','street','city','state','pincode','landmark'].map((field) => <label key={field} className={field === 'street' ? 'sm:col-span-2' : ''}><span className="text-xs font-bold capitalize">{field.replace(/([A-Z])/g, ' $1')}</span><input required={field !== 'landmark'} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full h-11 px-3 rounded border border-slate-300 dark:border-slate-600 bg-transparent" /></label>)}
    </div><label className="flex items-center gap-2 mt-4 text-sm font-bold"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />Set as default</label><button disabled={saving} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold disabled:opacity-50">{saving ? 'Saving...' : 'Save address'}</button></form></div>}
  </main>;
}
