import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/navigation-bar/NavigationBar';
import './VaccinationRecords.css';

export default function VaccinationRecords() {  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/vaccination-drives')
      .then((res) => res.json()).then(setDrives)
      .catch((err) => alert('Error fetching students data:', err));
  }, []);

  const handleDriveChange = (e) => {
    const driveId = e.target.value;
    setSelectedDriveId(driveId);
    const drive = drives.find((d) => d.id.toString() === driveId);
    setSelectedDrive(drive);

    fetch(`http://localhost:8081/vaccination-drives/${driveId}/applicable-students`)
      .then((res) => res.json()).then(setStudents)
      .catch((err) => alert('Error fetching students data:', err));
  };

  const handleMarkVaccinated = (studentId) => {
    fetch(`http://localhost:8081/students/${studentId}/vaccinate?driveId=${selectedDriveId}`, {
      method: 'PUT',
    }).then(() => {
        setStudents((prev) =>
          prev.map((s) =>
            s.studentId === studentId ? { ...s, vaccinated: true } : s
          )
        );
      }).catch((err) => alert('Error fetching students data:', err));
  };

  const handleDownload = () => {
    const csv = [
      ['ID', 'Student Name', 'Student Grade', 'Drive Name', 'Vaccinated'],
      ...students.map((s) => [
        s.studentId,
        s.studentName,
        s.studentGrade,
        selectedDrive.vaccine_name,
        s.vaccinated ? 'Yes' : 'No',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaccination_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
        <NavigationBar/>
        <div className="vaccination-manager">
            <h2>Vaccination Records</h2>

            <div className="drive-selector">
                <label>Select Vaccination Drive:</label>
                <select value={selectedDriveId} onChange={handleDriveChange}>
                <option value="">-- Select --</option>
                {drives.map((drive) => (
                    <option key={drive.id} value={drive.id}>
                    {drive.vaccine_name} - {new Date(drive.drive_date).toLocaleDateString()}
                    </option>
                ))}
                </select>
            </div>

            {selectedDrive && (
                <div className="drive-info">
                    <span><strong>Grade:</strong> {selectedDrive.applicable_grades.join(', ')}</span>
                </div>
            )}

            {students.length > 0 ? (
                <>
                <table className="student-table">
                    <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.studentId}>
                        <td>{student.studentId}</td>
                        <td>{student.studentName}</td>
                        <td>{student.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</td>
                        <td>
                            {!student.vaccinated && (
                            <button onClick={() => handleMarkVaccinated(student.studentId)}>
                                Mark as Vaccinated
                            </button>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button className="download-btn" onClick={handleDownload}>
                    Download Report
                </button>
                </>
            ) : selectedDriveId ? (
                <p>No applicable students found for this drive.</p>
            ) : null}
        </div>
    </>
  );
}