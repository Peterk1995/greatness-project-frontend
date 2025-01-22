// Editor/TaskForm.jsx
import React from 'react';

const TaskForm = ({ data, setData }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Title of Engagement</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., War Council, Battle Strategy, Training"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Commencement</label>
          <input
            type="time"
            value={data.startTime}
            onChange={(e) => setData({ ...data, startTime: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Conclusion</label>
          <input
            type="time"
            value={data.endTime}
            onChange={(e) => setData({ ...data, endTime: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Strategic Details</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Detail your strategy, objectives, and considerations..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Required Resources</label>
          <textarea
            value={data.resources_needed}
            onChange={(e) => setData({ ...data, resources_needed: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Men, supplies, allies needed..."
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Outcome</label>
          <textarea
            value={data.expected_outcome}
            onChange={(e) => setData({ ...data, expected_outcome: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Victory conditions, strategic gains..."
            rows={3}
          />
        </div>
      </div>
    </>
  );
};

export default TaskForm;
