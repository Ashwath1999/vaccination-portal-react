import './ManageStudents.css';
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/navigation-bar/NavigationBar';
import EditStudent from './EditStudent';
import AddStudent from './AddStudent';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState({
    name: '',
    grade: '',
    id: '',
    vaccinated: ''
  });

  const fetchStudents = () => {
    fetch('http://localhost:8081/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((err) => alert('Error fetching students data:', err));
  };

  useEffect(() => {
    const query = new URLSearchParams(search).toString();
    fetch(`http://localhost:8081/students/search?${query}`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((err) => alert('Error fetching students data:', err));
  }, [search]); 

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditStudent = (id) => {
    const studentToEdit = students.find((student) => student.id === id);
    setEditingStudent(studentToEdit);
  };

  const handleDeleteStudent = (id) => {
    fetch(`http://localhost:8081/students/${id}`, {
            method: 'DELETE'
    }).then((response) =>  {
        if (response.ok) {
            alert('Student deleted successfully!');
            setStudents((prevStudents) =>
              prevStudents.filter((student) => student.id !== id)
            );
        }
        setEditingStudent(null);
    }).catch((err) => alert(err));
  };

  const handleSearch = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <NavigationBar></NavigationBar>
      <p>Manage Students</p>

      <AddStudent
        fetchStudents={fetchStudents}
        students={students}
        setStudents={setStudents}
      />

      <EditStudent
        students={students}
        setStudents={setStudents}
        setEditingStudent={setEditingStudent}
        editingStudent={editingStudent}>
      </EditStudent>

      <div className="search-bar">
        <label className='search-by'>Search By</label>
        <input name="id" placeholder="ID" onChange={handleSearch} />
        <input name="name" placeholder="Name" onChange={handleSearch} />
        <input name="grade" placeholder="Grade" onChange={handleSearch} />
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.length ? students.map((student) => (
            <tr key={student.id}>
              <td>
                <button className="edit-student-button" onClick={() => handleEditStudent(student.id)}>Edit</button>
                <button className="delete-student-button" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
              </td>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.gender}</td>
              <td>{student.grade}</td>
            </tr>
          )) : (
            <tr><td colSpan="5">No students found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;
