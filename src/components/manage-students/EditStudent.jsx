import React, { useState, useEffect } from 'react';

export default function EditStudent({ students, setStudents, setEditingStudent, editingStudent }) {
    const handleUpdateStudent = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/students/${editingStudent.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingStudent),
        }).then((response) =>  {
            if (response.ok) {
                alert('Student updated successfully!');
                setStudents(students.map((student) => (student.id === editingStudent.id ? editingStudent : student)));
            }
            setEditingStudent(null);
        }).catch((err) => alert(err));
    };

    return(
        <>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent}>
                    <input
                        type="text"
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        value={editingStudent.gender}
                        onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        value={editingStudent.grade}
                        onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                        required
                    />
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
                </form>
            )}
        </>
    );
}