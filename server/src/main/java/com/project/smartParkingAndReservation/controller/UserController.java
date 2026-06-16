package com.project.smartParkingAndReservation.controller;

import com.project.smartParkingAndReservation.dto.ApiResponse;
import com.project.smartParkingAndReservation.dto.UserUpdateDto;
import com.project.smartParkingAndReservation.entity.User;
import com.project.smartParkingAndReservation.service.IUserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController
{
    @Autowired
    private IUserService service;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> userSignUp(
            @RequestParam("name") @Valid @NotBlank(message = "Name is mandatory") String name,
            @RequestParam("email") @Valid @Email(message = "Email should be valid") String email,
            @RequestParam("password") @Valid @Size(min = 8, message = "Password must be at least 8 characters") String password,
            @RequestParam(value = "mobileNumber", required = false) String mobileNumber,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        ApiResponse response = new ApiResponse();

        try {
            service.userSignUp(name, email, password, mobileNumber, address, image);
            response.setSuccess(true);
            response.setMessage("User Registration Successful");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            response.setSuccess(false);
            response.setMessage(ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception ex) {
            response.setSuccess(false);
            response.setMessage("An error occurred during registration.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse> updateUser(
            @PathVariable Long userId,
            @ModelAttribute @Valid UserUpdateDto userUpdateDTO) {
        ApiResponse response = new ApiResponse();

        try {
            service.updateUserById(
                    userId,
                    userUpdateDTO.getName(),
                    userUpdateDTO.getEmail(),
                    userUpdateDTO.getPassword(),
                    userUpdateDTO.getMobileNumber(),
                    userUpdateDTO.getAddress(),
                    userUpdateDTO.getImage()
            );
            response.setSuccess(true);
            response.setMessage("User updated successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            response.setSuccess(false);
            response.setMessage(ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            response.setSuccess(false);
            response.setMessage("An error occurred during the update.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    private ResponseEntity<?> getAllUsers()
    {
        HashMap<String,Object> res = new HashMap<>();
        try
        {
            List<User> users = service.getAllUsers();
            res.put("success",true);
            res.put("user",users);
            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
        catch (Exception e)
        {
            res.put("success",false);
            res.put("msg","Failed to fetch the available users");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping("/{id}")
    private ResponseEntity<?> getUserById(@PathVariable Long id)
    {
        HashMap<String,Object> res = new HashMap<>();
        try
        {
            User user = service.getUserById(id);
            res.put("success",true);
            res.put("user",user);
            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
        catch (Exception e)
        {
            res.put("success",false);
            res.put("msg","User is not found for provided id is"+id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @DeleteMapping("/delete/{id}")
    private ResponseEntity<?> deleteUserById(@PathVariable Long id)
    {
        HashMap<String,Object> res = new HashMap<>();
        try
        {
            service.deleteUserById(id);
            res.put("success",true);
            res.put("msg","User Deleted Successfully");
            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
        catch (Exception e)
        {
            res.put("success",false);
            res.put("msg","User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }
}
