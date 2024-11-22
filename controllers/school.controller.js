const { validationResult } = require('express-validator');
const db = require('../config/db');
const geolib = require('geolib');


// Calculate distance using geolib
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    return geolib.getDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 }
    ) / 1000; // Convert meters to kilometers
};


// Add School Controller
const addSchool = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, latitude, longitude } = req.body;

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.execute(query, [name, address, latitude, longitude], (err) => {
        if (err) {
            console.error(err);
            throw new Error('Database insertion failed');
        }
        res.status(201).json({ message: 'School added successfully.' });
    });
};

// List Schools Controller
const listSchools = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude } = req.query;

    const query = 'SELECT * FROM schools';
    db.execute(query, (err, results) => {
        if (err) {
            console.error(err);
            throw new Error('Database query failed');
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        // Calculate distances and sort
        const sortedSchools = results.map((school) => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
};

module.exports = {
    addSchool,
    listSchools,
};
