const connection = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  connection.getConnection((connectionError, transaction) => {
    if (connectionError) return callback(connectionError);

    transaction.beginTransaction((beginError) => {
      if (beginError) {
        transaction.release();
        return callback(beginError);
      }

      const rollbackAndFinish = (error, result) => {
        transaction.rollback((rollbackError) => {
          transaction.release();
          if (rollbackError) {
            if (error) error.rollbackError = rollbackError;
            return callback(error || rollbackError);
          }
          callback(error, result);
        });
      };

      const bookingSql = `
        INSERT INTO service_bookings
          (pet_id, service_id, booking_date, booked_price, booking_status)
        SELECT pets.id, services.id, ?, services.price, 'pending'
        FROM pets
        INNER JOIN services
          ON services.id = ? AND services.is_active = 1
        WHERE pets.id = ? AND pets.owner_id = ?
      `;

      transaction.query(
        bookingSql,
        [bookingDate, serviceId, petId, ownerId],
        (bookingError, bookingResult) => {
          if (bookingError) return rollbackAndFinish(bookingError);
          if (bookingResult.affectedRows !== 1) {
            return rollbackAndFinish(null, null);
          }

          const bookingId = bookingResult.insertId;
          const paymentSql = `
            INSERT INTO payments
              (booking_id, amount, payment_status, payment_reference)
            SELECT id, booked_price, 'pending', NULL
            FROM service_bookings
            WHERE id = ?
          `;

          transaction.query(paymentSql, [bookingId], (paymentError, paymentResult) => {
            if (paymentError) return rollbackAndFinish(paymentError);
            if (paymentResult.affectedRows !== 1) {
              return rollbackAndFinish(new Error('Payment record was not created.'));
            }

            transaction.commit((commitError) => {
              if (commitError) return rollbackAndFinish(commitError);

              transaction.release();
              callback(null, {
                bookingId,
                paymentId: paymentResult.insertId
              });
            });
          });
        }
      );
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      service_bookings.id AS booking_id,
      DATE_FORMAT(service_bookings.booking_date, '%Y-%m-%d') AS booking_date,
      pets.name AS pet_name,
      services.name AS service_name,
      service_bookings.booked_price,
      service_bookings.booking_status,
      payments.payment_status,
      service_bookings.created_at
    FROM service_bookings
    INNER JOIN pets ON pets.id = service_bookings.pet_id
    INNER JOIN services ON services.id = service_bookings.service_id
    LEFT JOIN payments ON payments.booking_id = service_bookings.id
    WHERE pets.owner_id = ?
    ORDER BY service_bookings.created_at DESC, service_bookings.id DESC
  `;
  connection.query(sql, [ownerId], callback);
}

module.exports = { createPendingBooking, getBookingsByOwner };
