package com.project.smartParkingAndReservation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String placeName;

    private String latitude;

    private String longitude;

    private String areaName;

    private boolean isAvailable;

    private String description;

    private String image;

    @ManyToOne(fetch = FetchType.EAGER)
    private Lender lender;

    @OneToMany(
            mappedBy = "parkingPlace",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany
    private List<Rating> ratings = new ArrayList<>();
}