import React, { useEffect, useState } from 'react';

import './Dashboard.css';
import NavigationBar from '../../components/navigation-bar/NavigationBar';

export default function Dashboard() {
    const [totalStudents, setTotalStudents] = useState(0);
    const [vaccinatedCount, setVaccinatedCount] = useState(0);
    const [vaccinatedPercentage, setVaccinatedPercentage] = useState(0);
    const [upcomingDrives, setUpcomingDrives] = useState([]);

    useEffect(() => {

        fetch('http://localhost:8081/dashboard/students-count')
            .then(res => res.json())
            .then(data => {
                setTotalStudents(data);
            })
            .catch(err => {
                console.error('Error fetching student count:', err);
            });

        fetch('http://localhost:8081/dashboard/vaccinated-count')
            .then(res => res.json())
                .then(data => {
                setVaccinatedCount(data);
            }).catch(err => {
                console.error('Error fetching vaccinated count:', err);
            });

        fetch('http://localhost:8081/dashboard/upcoming-drives')
            .then(res => res.json())
            .then(data => {
                setUpcomingDrives(data);
            })
            .catch(err => {
            console.error('Error fetching upcoming drives:', err);
            });

        fetch('http://localhost:8081/dashboard/vaccinated-percentage')
        .then(res => res.json())
        .then(data => {
            setVaccinatedPercentage(data);
        })
        .catch(err => {
        console.error('Error fetching vaccinated percentage:', err);
        });

    }, []);


    return (
        <div className="dashboard-container">
            <NavigationBar></NavigationBar>
            <p className='title'>Dashboard</p>
            <div className="card-grid">
                <div className="card">
                    <h2>Total Students</h2>
                    <p>{totalStudents}</p>
                </div>
                <div className="card">
                    <h2>Vaccinated Count</h2>
                    <p>{vaccinatedCount}</p>
                </div>
                <div className="card">
                    <h2>Vaccinated Students Percentage</h2>
                    <p>{vaccinatedPercentage} %</p>
                </div>
                <div className="card">
                    <h2>Upcoming Vaccination Drives (Next 30 Days)</h2>
                    {upcomingDrives.length > 0 ? (
                        <ul>
                        {upcomingDrives.map((drive, index) => (
                            <li key={drive.id}>{drive.vaccine_name} - Scheduled on {drive.drive_date}</li>
                        ))}
                        </ul>
                    ) : (
                        <p className="empty-state">No drives scheduled in the next 30 days.</p>
                    )}
                </div>
            </div>
        </div>
    );
}