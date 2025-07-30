import React from "react";

export default function TableView({ tasks, onTaskUpdate, onTaskDelete }: any) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Title</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Status</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Priority</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Due Date</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: any) => (
            <tr key={task.id} className="bg-white dark:bg-gray-900">
              <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{task.title}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700 capitalize text-gray-900 dark:text-gray-100">{task.status.replace('_', ' ')}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700 capitalize text-gray-900 dark:text-gray-100">{task.priority}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{task.due_date}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">
                <button className="text-blue-600 dark:text-blue-400 mr-2" onClick={() => onTaskUpdate(task)}>Edit</button>
                <button className="text-red-600 dark:text-red-400" onClick={() => onTaskDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
