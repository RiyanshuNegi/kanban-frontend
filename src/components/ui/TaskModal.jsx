import { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSubmit, users = [], initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);

  // When the modal opens, check if we are editing. If yes, pre-fill the form.
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || ''
      });
    } else {
      setFormData({ title: '', description: '', priority: 'medium', assignedTo: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData };
    if (!payload.assignedTo) delete payload.assignedTo;

    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-gray-900 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] my-8">
        <div className="flex justify-between items-center bg-gray-900 text-white p-3 sm:p-4">
          <h3 className="font-black uppercase text-lg sm:text-xl">
            {initialData ? 'Edit Operation' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="font-bold hover:text-red-400 transition-colors px-2">[X]</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4 font-mono">
          <div className="flex flex-col">
            <label className="font-bold mb-1 uppercase text-sm">Task Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100" required />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-1 uppercase text-sm">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100 resize-none" required></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-bold mb-1 uppercase text-sm">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="border-2 border-gray-900 p-2 bg-white focus:outline-none cursor-pointer">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-bold mb-1 uppercase text-sm">Assign To</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="border-2 border-gray-900 p-2 bg-white focus:outline-none cursor-pointer">
                <option value="">-- Unassigned --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold uppercase text-gray-600 hover:text-gray-900 w-full sm:w-auto">Cancel</button>
            <button type="submit" disabled={loading} className="bg-gray-900 text-white px-6 py-2 font-bold uppercase border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 w-full sm:w-auto">
              {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Deploy Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}