package org.example.projet_tuto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ProjetTutoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetTutoApplication.class, args);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawPassword = passwordEncoder.encode("1234");
        System.out.println("Encoded password: " + rawPassword);
    }

}
