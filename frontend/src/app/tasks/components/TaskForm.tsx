import React, { useState, useEffect } from "react";
import { getUsers } from "@/core/users";


export default function TaskForm({ initial, onSave, onCancel }: any) {
  const [title, setTitle] = useState(initial?.title || "");
  const [priority, setPriority] = useState(initial?.priority || "medium");
  const [status, setStatus] = useState(initial?.status || "todo");
  const [dueDate, setDueDate] = useState(initial?.due_date || "");
  const [assignedUser, setAssignedUser] = useState(initial?.assigned_user || "");
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    setUsersLoading(true);
    getUsers()
      .then(res => setUsers(res.data))
      .catch(() => setUsersError("Failed to load users"))
      .finally(() => setUsersLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...initial, title, priority, status, due_date: dueDate, assigned_user: assignedUser });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6 bg-gray-200 dark:bg-gray-900 rounded shadow-lg">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        required
      />
      <select
        value={assignedUser}
        onChange={e => setAssignedUser(e.target.value)}
        className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        required
      >
        <option value="">Assign to user...</option>
        {usersLoading && <option disabled>Loading users...</option>}
        {usersError && <option disabled>{usersError}</option>}
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username} ({u.email}){u.role === "admin" ? " [admin]" : ""}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-1">Save</button>
        <button type="button" className="bg-gray-400 dark:bg-gray-700 text-white rounded px-3 py-1" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
