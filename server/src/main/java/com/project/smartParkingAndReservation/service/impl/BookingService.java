package com.project.smartParkingAndReservation.service.impl;

import com.project.smartParkingAndReservation.entity.Booking;
import com.project.smartParkingAndReservation.entity.ParkingPlace;
import com.project.smartParkingAndReservation.entity.User;
import com.project.smartParkingAndReservation.repository.IBookingRepository;
import com.project.smartParkingAndReservation.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private IBookingRepository bookingRepository;

    @Override
    public Booking bookParkingPlace(
            ParkingPlace parkingPlace,
            User user,
            LocalDateTime startTime,
            LocalDateTime endTime) {

        if (startTime == null || endTime == null) {
            throw new IllegalStateException("Start time and End time are required.");
        }

        if (endTime.isBefore(startTime)) {
            throw new IllegalStateException(
                    "End time must be after start time.");
        }

        List<Booking> existingBookings =
                bookingRepository.findByParkingPlaceId(parkingPlace.getId());

        for (Booking booking : existingBookings) {

            if ("Released".equalsIgnoreCase(booking.getStatus())) {
                continue;
            }

            boolean overlap =
                    startTime.isBefore(booking.getEndTime())
                            && endTime.isAfter(booking.getStartTime());

            if (overlap) {
                throw new IllegalStateException(
                        "Parking place already booked for selected time.");
            }
        }

        Booking booking = new Booking();

        booking.setParkingPlace(parkingPlace);
        booking.setUser(user);
        booking.setStatus("Pending");
        booking.setReservationTime(LocalDateTime.now());
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);

        return bookingRepository.save(booking);
    }

    @Override
    public void releaseParkingPlace(Booking booking) {

        booking.setStatus("Released");

        bookingRepository.save(booking);
    }

    @Override
    public void updateBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    @Override
    public List<Booking> findByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public void deleteBookingById(Long id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found"));
    }

    @Override
    public List<Booking> getBookingByLenderId(Long lenderId) {
        return bookingRepository.findByParkingPlace_Lender_Id(lenderId);
    }
}