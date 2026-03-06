import React from 'react';

const AcademicPrograms = () => {
    const programs = [
        { id: 1, name: 'Bachelor of Science in Computer Science' },
        { id: 2, name: 'Bachelor of Arts in Psychology' },
        { id: 3, name: 'Bachelor of Commerce in Business Administration' },
        // Add more programs as necessary
    ];

    return (
        <div>
            <h1>Academic Programs</h1>
            <ul>
                {programs.map(program => (
                    <li key={program.id}>{program.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default AcademicPrograms;