const express = require('express')
const router = express.Router()
require("dotenv").config();

// Middleware 
const errorMiddleware = require('../middleware/error-middleware')
const authorizationMiddleware = require('../middleware/authorization-middleware')
const uploadsMiddleware = require('../middleware/upload-middleware')

// Controller Functions
const {createUser, authenticateUser } = require('../controller/auth')
const { getProfile, editMyProfile, deleteMyProfile, addNowEntry, getNowEntries, editNowEntry, deleteNowEntry, deleteAllNowEntries, addProfilePicture, getProfilePicture, deleteProfilePicture } = require('../controller/user-profile')
const { getGallery } = require('../controller/gallery')

// Authentication 
router.post('/sign-up', createUser)
router.post('/login', authenticateUser)

// AUTHORIZATON MIDDLEWARE 
router.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// User Profile 
router.get('/my-profile', getProfile);
router.put('/edit-profile', editMyProfile)
router.delete('/delete-profile', deleteMyProfile)

router.post('/add-entry', addNowEntry);
router.get('/my-entries', getNowEntries);
router.put('/edit-entry/:entryId', editNowEntry)
router.delete('/delete-entry/:entryId', deleteNowEntry);
router.delete('/delete-all-entries', deleteAllNowEntries)

// router.post('/upload-profile-picture', addProfilePicture)
router.post('/upload-profile-picture', uploadsMiddleware, addProfilePicture)
router.get('/profile-picture', getProfilePicture)
router.delete('/delete-profile-picture', deleteProfilePicture)

router.get('/user/:userId', getProfile);
router.get('/user/:userId/entries', getNowEntries);
router.get('/profile-picture/user/:userId', getProfilePicture)

// Gallery 
router.get('/gallery', getGallery)

router.use(errorMiddleware);

module.exports = router