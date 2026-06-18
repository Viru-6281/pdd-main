package com.project.smartParkingAndReservation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parking_place_id")
    @JsonIgnoreProperties({"bookings"})
    private ParkingPlace parkingPlace;

    @ManyToOne
    @JsonIgnoreProperties({"password"})
    private User user;

    private String status;

    private LocalDateTime reservationTime;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(startTime)
                && now.isBefore(endTime);
    }
}