const express = require("express");
const router = express.Router();
const {verify, verifyAdmin} = require("../auth.js");
const {
    getAllHospitals,
    getHospitalById,
    searchHospitalsByLocation,
    createHospital,
    updateHospital,
    deleteHospital,
    getHospitalStatistics
} = require("../controller/hospital.js");

// [ROUTE] GET /api/hospitals - Get all hospitals (Public)
router.get("/", getAllHospitals);

// [ROUTE] GET /api/hospitals/search/location - Search hospitals by location (Public)
router.get("/search/location", searchHospitalsByLocation);

// [ROUTE] GET /api/hospitals/statistics - Get hospital statistics (Admin only)
router.get("/statistics", verify, verifyAdmin, getHospitalStatistics);

// [ROUTE] GET /api/hospitals/:id - Get hospital by ID (Public)
router.get("/:id", getHospitalById);

// [ROUTE] POST /api/hospitals - Create new hospital (Admin only)
router.post("/", verify, verifyAdmin, createHospital);

// [ROUTE] PUT /api/hospitals/:id - Update hospital (Admin only)
router.put("/:id", verify, verifyAdmin, updateHospital);

// [ROUTE] DELETE /api/hospitals/:id - Delete hospital (Admin only)
router.delete("/:id", verify, verifyAdmin, deleteHospital);

module.exports = router;