package org.example.projet_tuto.Controllers;

import org.example.projet_tuto.DTOS.AdminStatsDTO;
import org.example.projet_tuto.DTOS.ClassDTO;
import org.example.projet_tuto.DTOS.UserCreationDTO;
import org.example.projet_tuto.DTOS.UserDTO;
import org.example.projet_tuto.Service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // enpoints
        // ==================== STATISTICS ====================
        @GetMapping("/stats")
        public ResponseEntity<AdminStatsDTO> getPlatformStatistics() {
            return ResponseEntity.ok(adminService.getPlatformStatistics());
        }

        // ==================== USER MANAGEMENT ====================
        @PostMapping("/users")
        public ResponseEntity<?> createUser(@RequestBody UserCreationDTO userDTO) {
            try {
                UserDTO createdUser = adminService.createUser(userDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", e.getMessage()));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
            }
        }

        @GetMapping("/users")
        public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) String role) {
            return ResponseEntity.ok(adminService.getAllUsers(role));
        }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = adminService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserCreationDTO userDTO) {
        try {
            UserDTO updatedUser = adminService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    // ==================== CLASS MANAGEMENT ====================
        @PostMapping("/classes")
        public ResponseEntity<ClassDTO> createClass(@RequestBody ClassDTO classDTO) {
            try {
                ClassDTO createdClass = adminService.createClass(classDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdClass);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }

        @PutMapping("/classes/{id}")
        public ResponseEntity<ClassDTO> updateClass(@PathVariable Long id, @RequestBody ClassDTO classDTO) {
            try {
                ClassDTO updatedClass = adminService.updateClass(id, classDTO);
                return ResponseEntity.ok(updatedClass);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<String> deleteClass(@PathVariable Long id) {
        try {
            adminService.deleteClass(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping("/classes")
        public ResponseEntity<List<ClassDTO>> getAllClasses() {
            return ResponseEntity.ok(adminService.getAllClasses());
        }

    @PostMapping("/classes/add-student")
    public ResponseEntity<?> addStudentToClass(@RequestParam Long studentId, @RequestParam Long classId) {
            try{
                adminService.studentToClass(studentId, classId);
                return ResponseEntity.ok("Student added to class successfully");
            }catch(RuntimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
    @PutMapping("/students/{id}/removeFromClass")
    public ResponseEntity<Void> removeStudentFromClass(@PathVariable Long id) {
        try {
            adminService.removeStudentFromClass(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
