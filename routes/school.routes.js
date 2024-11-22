const express = require('express');
const { body, query } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { addSchool, listSchools } = require('../controllers/school.controller');

const router = express.Router();

// Add School Route
router.post(
    '/addSchool',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('latitude')
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be a valid float between -90 and 90'),
        body('longitude')
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be a valid float between -180 and 180'),
    ],
    asyncHandler(addSchool)
);

// List Schools Route
router.get(
    '/listSchools',
    [
        query('latitude')
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be a valid float between -90 and 90'),
        query('longitude')
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be a valid float between -180 and 180'),
    ],
    asyncHandler(listSchools)
);

module.exports = router;
