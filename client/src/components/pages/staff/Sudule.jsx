import React, { useState } from 'react';

const Schedule = ({ onSelectTask }) => {
  const [scheduleData] = useState({
    date: '2026-08-17',
    schedule: [
      {
        time: '10:30 AM',
        taskId: 'MT1026',
        title: 'Water Pump Inspection',
        location: 'Basement Mechanical Room',
        duration: '1 Hour',
        status: 'UPCOMING',
      },
      {
        time: '12:00 PM',
        taskId: 'MT1001',
        title: 'Water Leakage Repair',
        location: 'Building B - B204',
        duration: '2 Hours',
        status: 'IN_PROGRESS',
      },
      {
        time: '03:30 PM',
        taskId: 'MT1042',
        title: 'Elevator Emergency Call Button Test',
        location: 'Tower A Elevator Shaft',
        duration: '45 Mins',
        status: 'UPCOMING',
      },
    ],
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Daily Schedule</h1>
          <p style={styles.subtitle}>Time-blocked itinerary for {scheduleData.date}</p>
        </div>
      </header>

      <div style={styles.card}>
        <div style={styles.timelineList}>
          {scheduleData.schedule.map((item, index) => (
            <div key={item.taskId} style={styles.timelineItem}>
              <div style={styles.timeBadge}>{item.time}</div>
              <div style={styles.timelineConnector}>
                <div style={styles.timelineDot(item.status)} />
                {index !== scheduleData.schedule.length - 1 && <div style={styles.timelineLine} />}
              </div>
              <div style={styles.timelineContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <span style={styles.durationTag}>⏱️ {item.duration}</span>
                </div>
                <p style={styles.itemSubtext}>📍 {item.location} | Task ID: <strong>{item.taskId}</strong></p>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => onSelectTask(item.taskId)} style={styles.actionBtn}>
                    Open Work Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;