import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/navigation-bar/NavigationBar';
import './ManageVaccinationDrives.css';

const VaccinationDrives = () => {
    
  const [drives, setDrives] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [form, setForm] = useState({
    vaccine_name: '',
    drive_date: '',
    available_doses: '',
    applicable_grades: '',
  });

  const fetchDrives = () => {
    fetch('http://localhost:8081/vaccination-drives')
      .then(res => res.json())
      .then(data => setDrives(data))
      .catch(err => console.error('Error fetching drives:', err));
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const today = new Date();

  const isFutureDate = (date) => {
    return new Date(date) >= today;
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive.id);
    setForm({
      vaccine_name: drive.vaccine_name,
      drive_date: drive.drive_date,
      available_doses: drive.available_doses,
      applicable_grades: drive.applicable_grades.join(','),
    });
  };

  const handleDelete = (drive) => {
    fetch(`http://localhost:8081/vaccination-drives/${drive.id}`, {
            method: 'DELETE'
    }).then((response) =>  {
        if (response.ok) {
            alert('Vaccine Drive deleted successfully!');
            setDrives((prevDrives) =>
              prevDrives.filter((prevDrive) => prevDrive.id !== drive.id)
            );
        }
    }).catch((err) => alert(err));
  };

  const resetForm = () => {
    setForm({ vaccine_name: '', drive_date: '', available_doses: '', applicable_grades: '' });
    setIsAdding(false);
    setEditingDrive(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
      e.preventDefault();
      const payload = {
          vaccine_name: form.vaccine_name,
          drive_date: form.drive_date,
          available_doses: Number(form.available_doses),
          applicable_grades: form.applicable_grades.split(',').map(Number),
      };

      fetch('http://localhost:8081/vaccination-drives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      }).then(response => {
          if (response.ok) {
              alert('Vaccination Drive added successfully!');
              fetchDrives();
              resetForm();
          } else {
              response.text().then(bodyText => {
                  alert(bodyText);
              })
          }
      }).catch((err) => alert(err));
  };

  const handleUpdate = (e) => {
      e.preventDefault();
      const payload = {
          vaccine_name: form.vaccine_name,
          drive_date: form.drive_date,
          available_doses: Number(form.available_doses),
          applicable_grades: form.applicable_grades.split(',').map(Number),
      };

      fetch(`http://localhost:8081/vaccination-drives/${editingDrive}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      }).then(response => {
          if (response.ok) {
              alert('Vaccination Drive updated successfully!');
              fetchDrives();
              resetForm();
          } else {
              response.text().then(bodyText => {
                  alert(bodyText);
              })
          }
      }).catch((err) => alert(err));
  };

  return (
    <div>
      <NavigationBar></NavigationBar>
      <h2>Vaccination Drives</h2>
      <button onClick={() => setIsAdding(true)}>Add Drive</button>
      {(isAdding || editingDrive) && (
        <form onSubmit={editingDrive ? handleUpdate : handleAdd}>
          <input
              name="vaccine_name"
              placeholder="Vaccine Name"
              value={form.vaccine_name}
              onChange={handleFormChange}
              required
          />
          <input
              name="drive_date"
              type="date"
              value={form.drive_date}
              onChange={handleFormChange}
              required
          />
          <input
              name="available_doses"
              type="number"
              placeholder="Available Doses"
              value={form.available_doses}
              onChange={handleFormChange}
              required
          />
          <input
              name="applicable_grades"
              placeholder="Applicable Grades (e.g., 5,6,7)"
              value={form.applicable_grades}
              onChange={handleFormChange}
              required
          />
          <button type="submit">{editingDrive ? 'Update' : 'Add'}</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </form>   
      )}
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Doses</th>
            <th>Grades</th>
          </tr>
        </thead>
        <tbody>
          {drives.map((drive) => (
            <tr key={drive.id}>
              <td>
                {isFutureDate(drive.drive_date) ? (
                  <div>
                    <button className="edit-vaccine-button" onClick={() => handleEdit(drive)}>Edit</button>
                    <button className="delete-vaccine-button" onClick={() => handleDelete(drive)}>Delete</button>
                  </div>
                ) : (
                    <span>Drive has already expired</span>
                )}
              </td>
              <td>{drive.id}</td>
              <td>{drive.vaccine_name}</td>
              <td>{drive.drive_date}</td>
              <td>{drive.available_doses}</td>
              <td>{drive.applicable_grades.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaccinationDrives;
