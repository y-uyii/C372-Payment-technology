const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

const SUCCESS_MESSAGE =
  'Booking created. Payment is pending; no payment has been processed.';
const VALIDATION_MESSAGE = 'Choose a pet, service, and valid booking date.';
const UNAVAILABLE_MESSAGE = 'That pet or service is unavailable for booking.';
const SAVE_ERROR_MESSAGE = 'Unable to create the booking. Please try again.';

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parsePositiveId(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isValidBookingDate(value, today) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    year >= 1000 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isRealDate && value >= today;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;

  petModel.getPetsByOwner(ownerId, (petError, pets) => {
    if (petError) {
      console.error(petError);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceError, services) => {
      if (serviceError) {
        console.error(serviceError);
        return res.status(500).send('Unable to load services.');
      }

      const requestedPetId = req.query.petId;
      const selectedPet = pets.find(
        pet => String(pet.id) === String(requestedPetId)
      );

      return res.render('services', {
        pets,
        services,
        selectedPetId: selectedPet ? String(selectedPet.id) : '',
        today: getToday(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const petId = parsePositiveId(req.body.petId);
  const serviceId = parsePositiveId(req.body.serviceId);
  const bookingDate = req.body.bookingDate;

  if (!petId || !serviceId || !isValidBookingDate(bookingDate, getToday())) {
    req.flash('error', VALIDATION_MESSAGE);
    return res.redirect('/services');
  }

  const ownerId = req.session.user.id;
  serviceBookingModel.createPendingBooking(
    ownerId,
    petId,
    serviceId,
    bookingDate,
    (error, booking) => {
      if (error) {
        console.error(error);
        req.flash('error', SAVE_ERROR_MESSAGE);
        return res.redirect(`/services?petId=${encodeURIComponent(String(petId))}`);
      }

      if (!booking) {
        req.flash('error', UNAVAILABLE_MESSAGE);
        return res.redirect('/services');
      }

      req.flash('success', SUCCESS_MESSAGE);
      return res.redirect('/bookings');
    }
  );
}

function listBookings(req, res) {
  const ownerId = req.session.user.id;
  serviceBookingModel.getBookingsByOwner(ownerId, (error, bookings) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = { listServices, createBooking, listBookings };
