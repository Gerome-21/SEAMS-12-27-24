import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StudentEventList.css';
import axios from 'axios';
import Notification from '../Notification/Notification';

const StudentEventList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  useEffect(() => {
    if (event?.id) {
      axios
        .get(`http://localhost:8081/events/${event.id}/attendees`)
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => {
          console.error('Error fetching attendees:', err);
          setError('Failed to fetch attendees.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [event]);

  const handleAction = (studentId, action) => {
    const message = action === 'approve' ? 'Approved' : 'Declined';

    // Update the student's status
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status: action === 'approve' ? 'Approved' : 'Declined' } : student
      )
    );

    // Trigger Notification
    setNotification({ message, isVisible: true });

    // Hide Notification after 2 seconds
    setTimeout(() => {
      setNotification({ message: '', isVisible: false });
    }, 2000);
  };

  const getButtonClass = (status, action) => {
    if (action === 'approve' && status === 'Approved') {
      return 'approve-btn approved';
    }
    if (action === 'decline' && status === 'Declined') {
      return 'decline-btn declined';
    }
    return action === 'approve' ? 'approve-btn' : 'decline-btn';
  };

  return (
    <div className="stdntElist-mainbox">
      {/* Sidebar Section */}
      <div className="stdntElist-sidebar">
        <div className="stdntElist-logo">
          <div className="stdntElist-seamslogo"></div>
          <h2 className="stdntElist-seams-txt">SEAMS</h2>
        </div>

        <div className="stdntElist-adminbox">
          <div className="stdntElist-adminimage"></div>
          <h2 className="stdntElist-adminNameH2">Jerryl Perez</h2>
        </div>

        <div className="stdntElist-menu">
          <button>COURSE</button>
          <button>EVENT</button>
          <button>SANCTION</button>
          <button>DATABASE</button>
        </div>
        <div className="stdntElist-exit">
          <button>EXIT</button>
        </div>
      </div>

      {/* Content Section */}
      <div className="stdntElist-leftcont-box">
        <div className="stdntElist-lccBlogo"></div>
        <div className="stdntElist-backevent-btnbox">
          <div className="stdntElist-order1">
            <div className="stdntElist-arrowimg"></div>
            <button className="stdntElist-backevent-btn" onClick={() => navigate('/eventlist')}>Back to events</button>
          </div>
          <h4 className="stdntElist-backbtnh4">Press to return to the events page</h4>
        </div>

        <div className="stdntElist-addeventForm">
          <h2 className="stdntElist-addeventformH2">{event?.eventName}</h2>
          <div className="stdntElist-eventDetails-box">
            <h4 className="stdntElist-addeventformH4">Venue: {event?.venue}</h4>
            <h4 className="stdntElist-addeventformH4">Date: {event?.eventDate}</h4>
            <h4 className="stdntElist-addeventformH4">Time: {event?.eventTime} - {event?.eventTimeEnd}</h4>
            <h4 className="stdntElist-addeventformH4">Year Level: {event?.yearlevel}</h4>
            <h4 className="stdntElist-addeventformH4">Course: {event?.course}</h4>
            <h4 className="stdntElist-addeventformH4">Attendees: {event?.attendees}</h4>
          </div>

          {/* Attendee Table */}
          {loading ? (
            <p>Loading attendees...</p>
          ) : error ? (
            <p>{error}</p>
          ) : students.length === 0 ? (
            <p>No attendees found.</p>
          ) : (
            <table className="stdntElist-attendee-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th>Proof</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.attendance_id}>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.gender}</td>
                    <td>{student.course}</td>
                    <td>
                      {student.proof_file ? (
                        <a
                          href={`http://localhost:8081/uploads/${student.proof_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://localhost:8081/uploads/${student.proof_file}`}
                            alt="Proof"
                            onError={(e) => (e.target.src = '/path/to/default-image.png')}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                            }}
                          />
                        </a>
                      ) : (
                        'No proof uploaded'
                      )}
                    </td>
                    <td>{student.reason}</td>
                    <td>
                      <button
                        className={getButtonClass(student.status, 'approve')}
                        onClick={() => handleAction(student.id, 'approve')}
                        disabled={student.status === 'Approved'}
                      >
                        Approve
                      </button>
                      <button
                        className={getButtonClass(student.status, 'decline')}
                        onClick={() => handleAction(student.id, 'decline')}
                        disabled={student.status === 'Declined'}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEventList;