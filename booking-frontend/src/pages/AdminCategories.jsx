import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminCategories() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/categories?includeInactive=true');
      if (res.data.success) {
        setCategories(res.data.data.categories || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const name = window.prompt("Enter new category name:");
    if (!name || !name.trim()) return;

    try {
      setLoading(true);
      const res = await apiClient.post('/categories/create', {
        name: name.trim(),
        icon: 'design_services', // default icon
        description: `${name.trim()} services`,
        isActive: true
      });
      if (res.data.success) {
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || 'Failed to create category');
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoading(true);
      const res = await apiClient.delete(`/categories/${id}`);
      if (res.data.success) {
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete category');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900 font-body">
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">category</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Service Square</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </Link>
          <Link to="/admin-categories" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">category</span> Manage Categories
          </Link>
          <Link to="/admin-verification-queue" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">verified_user</span> Verification Queue
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Service Categories</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Create, disable, and group available service hierarchies</p>
          </div>
          <button onClick={handleAddCategory} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Category
          </button>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
            </div>
          )}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Visual Meta</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Category Name</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Providers Linked</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Visibility</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="p-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <span className="material-symbols-outlined text-2xl">{cat.icon || 'category'}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <h4 className="text-slate-900 dark:text-white font-bold text-base capitalize">{cat.name}</h4>
                        <span className="text-xs text-slate-400 font-medium">{cat.slug}</span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-bold">
                          <span className="material-symbols-outlined text-lg text-slate-400">group</span>
                          {cat.usageCount || 0} Registered
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                          cat.isActive 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {cat.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button onClick={() => handleDeleteCategory(cat._id)} className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
