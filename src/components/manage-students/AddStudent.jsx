import React, { useState } from 'react';

export default function AddStudent({ fetchStudents, students, setStudents }) {
    const [newStudent, setNewStudent] = useState({ name: '', gender: '', grade: '' });
    const [isAdding, setIsAdding] = useState(false);
    const handleAddStudent = (e) => {
        e.preventDefault();
        fetch('http://localhost:8081/students', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            })
        .then((response) =>  {
            if (response.ok) {
                alert('Student added successfully!');
                setStudents([...students, newStudent]);
                setNewStudent({ name: '', age: '', grade: '' });
                setIsAdding(false);
            }
        })
        .catch((err) => alert(err));
    };

    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setUploadStatus('');
        } else {
            setFile(null);
            setUploadStatus('Please upload a valid CSV file.');
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('No file selected.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
        const response = await fetch('http://localhost:8081/students/bulk', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            setUploadStatus('Bulk list of students uploaded successfully!');
            fetchStudents();
        } else {
            const error = await response.text();
            setUploadStatus(`Upload failed: ${error}`);
        }
        } catch (err) {
            setUploadStatus('Error during bulk upload.');
        }
    };
      

    return(
        <>
            <button onClick={() => setIsAdding(true)}>Add Student</button>

            {isAdding && (
                <div>
                    <div className="bulk-upload-container">
                        <input type="file" accept=".csv" onChange={handleFileChange} />
                        <button onClick={handleUpload} disabled={!file}>Bulk Import Students</button>
                        {uploadStatus && <p>{uploadStatus}</p>}
                    </div>
                    <form onSubmit={handleAddStudent}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Gender"
                        value={newStudent.gender}
                        onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Grade"
                        value={newStudent.grade}
                        onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                        required
                    />
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                </form>
                </div>
            )}
        </>
    );
}