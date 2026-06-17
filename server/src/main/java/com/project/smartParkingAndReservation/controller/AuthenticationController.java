package com.project.smartParkingAndReservation.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.smartParkingAndReservation.dto.LoginDto;
import com.project.smartParkingAndReservation.entity.Lender;
import com.project.smartParkingAndReservation.entity.User;
import com.project.smartParkingAndReservation.service.ILenderService;
import com.project.smartParkingAndReservation.service.IUserService;

@RestController
@RequestMapping("/login")
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private IUserService userService;

    @Autowired
    private ILenderService lenderService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // ==========================
    // USER LOGIN
    // ==========================
    @PostMapping("/user")
    public ResponseEntity<?> userLogin(
            @RequestBody LoginDto loginDto) {

        HashMap<String, Object> res =
                new HashMap<>();

        try {

            String email =
                    loginDto.getEmail();

            String password =
                    loginDto.getPassword();

            if (email == null ||
                    password == null ||
                    email.isEmpty() ||
                    password.isEmpty()) {

                res.put("success", false);
                res.put("msg",
                        "Please fill required fields to login");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(res);
            }

            User authenticatedUser =
                    userService.findByEmail(email);

            if (authenticatedUser == null ||
                    !passwordEncoder.matches(
                            password,
                            authenticatedUser.getPassword())) {

                res.put("success", false);
                res.put("msg",
                        "Invalid email or password");

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(res);
            }

            authenticatedUser.setPassword(null);

            res.put("success", true);
            res.put("msg", "Login successful");
            res.put("user", authenticatedUser);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(res);

        } catch (Exception e) {

            e.printStackTrace();

            res.put("success", false);
            res.put("msg",
                    "An error occurred during login");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(res);
        }
    }

    // ==========================
    // LENDER LOGIN
    // ==========================
    @PostMapping("/lender")
    public ResponseEntity<?> lenderLogin(
            @RequestBody LoginDto loginDto) {

        HashMap<String, Object> res =
                new HashMap<>();

        try {

            String email =
                    loginDto.getEmail();

            String password =
                    loginDto.getPassword();

            if (email == null ||
                    password == null ||
                    email.isEmpty() ||
                    password.isEmpty()) {

                res.put("success", false);
                res.put("msg",
                        "Please fill required fields to login");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(res);
            }

            Lender authenticatedLender =
                    lenderService.findByEmail(email);

            if (authenticatedLender == null ||
                    !passwordEncoder.matches(
                            password,
                            authenticatedLender.getPassword())) {

                res.put("success", false);
                res.put("msg",
                        "Invalid email or password");

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(res);
            }

            authenticatedLender.setPassword(null);

            res.put("success", true);
            res.put("msg", "Login successful");
            res.put("lender", authenticatedLender);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(res);

        } catch (Exception e) {

            e.printStackTrace();

            res.put("success", false);
            res.put("msg",
                    "An error occurred during login");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(res);
        }
    }
}