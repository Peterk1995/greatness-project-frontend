import React from 'react';
import { TimeTable } from './components/timetable/TimeTable';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Class Schedule</h1>
      <TimeTable />
    </div>
  );
}

export default App;