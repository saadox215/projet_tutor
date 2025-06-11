package org.example.projet_tuto.Service;

import jakarta.transaction.Transactional;
import org.example.projet_tuto.entities.*;
import org.example.projet_tuto.Repository.*;
import org.example.projet_tuto.DTOS.*;
import org.slf4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final UtilisateurRepository userRepository;
    private final ClasseRepository classRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;

    public AdminService(UtilisateurRepository userRepository,
                        ClasseRepository classRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder, UtilisateurRepository utilisateurRepository) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.utilisateurRepository = utilisateurRepository;
    }

    // ==================== STATISTICS ====================
    public AdminStatsDTO getPlatformStatistics() {
        return AdminStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalStudents(userRepository.countByRoleName(RoleType.ETUDIANT))
                .totalProfessors(userRepository.countByRoleName(RoleType.PROFESSEUR))
                .totalClasses(classRepository.count())
                .build();
    }

    // ==================== USER MANAGEMENT ====================
    public UserDTO createUser(UserCreationDTO userDTO) {
        Logger logger = org.slf4j.LoggerFactory.getLogger(AdminService.class);

        try {
            logger.info("Attempting to create user: {}", userDTO.getEmail());

            if (userDTO.getEmail() == null || userDTO.getEmail().isBlank()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (userDTO.getName() == null || userDTO.getName().isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (userDTO.getRole() == null || userDTO.getRole().isBlank()) {
                throw new IllegalArgumentException("Role is required");
            }

            logger.info("User details - Name: {}, Email: {}, Role: {}, Prenom: {}",
                    userDTO.getName(), userDTO.getEmail(), userDTO.getRole(), userDTO.getPrenom());

            if (userRepository.findByEmail(userDTO.getEmail()) != null){
                throw new IllegalArgumentException("Email already exists");
            }

            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setEmail(userDTO.getEmail());
            utilisateur.setName(userDTO.getName());

            if (userDTO.getPrenom() != null) {
                utilisateur.setPrenom(userDTO.getPrenom());
            }

            utilisateur.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            utilisateur.setActif(true);

            RoleType roleType;
            try {
                logger.info("Converting role string to enum: {}", userDTO.getRole());
                roleType = RoleType.valueOf(userDTO.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid role: {}", userDTO.getRole());
                throw new IllegalArgumentException("Invalid role: " + userDTO.getRole());
            }

            logger.info("Looking for role: {}", roleType);
            Role role = roleRepository.findByName(roleType)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));

            logger.info("Found role: {}", role.getName());
            utilisateur.setRoles(Set.of(role));

            logger.info("Saving user to database");
            Utilisateur savedUser = userRepository.save(utilisateur);
            logger.info("User created successfully: {}", savedUser.getEmail());

            return mapToUserDTO(savedUser);
        } catch (Exception e) {
            logger.error("Error creating user: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<UserDTO> getAllUsers(String role) {
        List<Utilisateur> users = (role != null) ?
                userRepository.findByRoles_Name(RoleType.valueOf("ROLE_" + role)) :
                userRepository.findAll();
        return users.stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }
    public UserDTO getUserById(Long id) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToUserDTO(user);
    }
    public UserDTO updateUser(Long id, UserCreationDTO userDTO) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }
        if (userDTO.getPrenom() != null) {
            user.setPrenom(userDTO.getPrenom());
        }
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        if (userDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        if (userDTO.getRole() != null) {
            RoleType roleType = RoleType.valueOf(userDTO.getRole().toUpperCase());
            Role role = roleRepository.findByName(roleType)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));
            user.setRoles(Set.of(role));
        }

        Utilisateur updatedUser = userRepository.save(user);
        return mapToUserDTO(updatedUser);
    }
    public void deleteUser(Long id) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
    }
    // ==================== CLASS MANAGEMENT ====================
    @Transactional
    public ClassDTO createClass(ClassDTO classDTO) {
        try {
            Classe classe = new Classe();
            classe.setNom(classDTO.getName());
            classe.setEnseignants(new ArrayList<>()); // Initialize the list

            // Add multiple professors if provided
            if (classDTO.getProfessorIds() != null && !classDTO.getProfessorIds().isEmpty()) {
                List<Utilisateur> enseignants = userRepository.findAllById(classDTO.getProfessorIds())
                        .stream()
                        .filter(enseignant -> enseignant != null)
                        .collect(Collectors.toList());

                if (enseignants.size() != classDTO.getProfessorIds().size()) {
                    throw new RuntimeException("One or more enseignants not found");
                }

                classe.getEnseignants().addAll(enseignants);
            }

            Classe savedClasse = classRepository.save(classe);
            return mapToClassDTO(savedClasse);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create class", e);
        }
    }
@Transactional
    public ClassDTO updateClass(Long id, ClassDTO classDTO) {
        try {
            Classe classe = classRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

            if (classDTO.getName() != null) {
                classe.setNom(classDTO.getName());
            }

            // Update professors if provided
            if (classDTO.getProfessorIds() != null) {
                // Clear existing professors and add new ones
                classe.getEnseignants().clear();
                if (!classDTO.getProfessorIds().isEmpty()) {
                    List<Utilisateur> enseignants = userRepository.findAllById(classDTO.getProfessorIds())
                            .stream()
                            .filter(enseignant -> enseignant != null)
                            .collect(Collectors.toList());

                        if (enseignants.size() != classDTO.getProfessorIds().size()) {
                        throw new RuntimeException("One or more enseignants not found");
                    }

                    classe.getEnseignants().addAll(enseignants);
                }
            }

            Classe updatedClasse = classRepository.save(classe);
            return mapToClassDTO(updatedClasse);
        } catch (Exception e) {;
            throw new RuntimeException("Failed to update class", e);
        }
    }

    @Transactional
    public void deleteClass(Long id) {
        try {
            Classe classe = classRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée avec l'ID: " + id));

            // Initialize collections to avoid LazyInitializationException
            classe.getEtudiants().size();
            classe.getAnnonces().size();
            classe.getExercices().size();


            if (!classe.getEtudiants().isEmpty() || !classe.getAnnonces().isEmpty() || !classe.getExercices().isEmpty()) {
                throw new RuntimeException("Impossible de supprimer : la classe contient des étudiants, annonces ou exercices");
            }

            classRepository.delete(classe);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete class", e);
        }
    }


@Transactional
    public List<ClassDTO> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToClassDTO)
                .collect(Collectors.toList());
    }
    // ==================== Student affectation to classes ==================
    public void studentToClass(Long id_student, Long id_class)
    {
        Utilisateur student = utilisateurRepository.findById(id_student).orElseThrow(() -> new RuntimeException("student non trouvee"));
        Classe classe = classRepository.findById(id_class).orElseThrow(()-> new RuntimeException("classe non trouvee"));
        if (student.getClasse() != null) {
            throw new RuntimeException("L'étudiant est déjà affecté à une classe");
        }
        if (student.getRoles().stream().noneMatch(role -> role.getName() == RoleType.ETUDIANT)) {
            throw new RuntimeException("L'utilisateur n'est pas un étudiant");
        }
        student.setClasse(classe);
        userRepository.save(student);

    }
    @Transactional
    public void removeStudentFromClass(Long studentId) {
        Utilisateur student = utilisateurRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getClasse() == null) {
            throw new RuntimeException("Student is not assigned to any class");
        }

        student.setClasse(null);
        utilisateurRepository.save(student);
    }
    // ==================== DTO MAPPERS ====================
    private UserDTO mapToUserDTO(Utilisateur user) {
        Logger logger = org.slf4j.LoggerFactory.getLogger(AdminService.class);
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("");

        UserDTO.Builder builder = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .password("")
                .role(role);

        if (user.getClasse() != null) {
            builder.classId(user.getClasse().getId());
            builder.classe(user.getClasse());
        }

        return builder.build();
    }

    private ClassDTO mapToClassDTO(Classe classe) {
        List<Utilisateur> students = userRepository.findByClasse(classe);
        List<UserDTO> studentDTOs = students.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        int studentCount = studentDTOs.size();

        List<String> professorNames = classe.getEnseignants() != null
                ? classe.getEnseignants().stream()
                .map(enseignant -> enseignant.getName() + " " + enseignant.getPrenom())
                .collect(Collectors.toList())
                : Collections.singletonList("Not Assigned");


        return ClassDTO.builder()
                .id(classe.getId())
                .name(classe.getNom())
                .professorIds(classe.getEnseignants() != null
                        ? classe.getEnseignants().stream()
                        .map(Utilisateur::getId)
                        .collect(Collectors.toList())
                        : Collections.emptyList())
                .professorName(professorNames)
                .students(studentDTOs)
                .studentCount(studentCount)
                .build();
    }
}