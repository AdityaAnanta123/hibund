const Doctor = require('../models/doctor');

// Endpoint untuk membuat data dokter
exports.createDoctor = async (req, res) => {
  const { name, specialist, location, ratings, imageUrl, url } = req.body;

  try {
    const newDoctor = new Doctor({ name, specialist, location, ratings, imageUrl, url });
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error creating doctor:', error.message);
    res.status(500).json({ error: 'Error creating doctor' });
  }
};

// Endpoint untuk mendapatkan semua data dokter
exports.getAll = async (req, res) => {
    try {
      const doctors = await Doctor.find();
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
      res.status(500).json({ error: 'Error fetching doctors' });
    }
};

//endpoint untuk mendapatkan data berdasarkan beberapa parameter
exports.getDoctors = async (req, res) => {
    const { name, location, ratings, specialist } = req.query;
  
    const query = {};
  
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // i untuk case-insensitive
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (ratings) {
      query.ratings = { $gte: ratings }; // mencari dokter dengan rating >= yang diberikan
    }
    if (specialist) {
      query.specialist = { $regex: specialist, $options: 'i' };
    }
  
    try {
      const doctors = await Doctor.find(query);
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
      res.status(500).json({ error: 'Error fetching doctors' });
    }
  };
