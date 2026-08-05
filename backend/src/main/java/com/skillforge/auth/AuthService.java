package com.skillforge.auth;

import com.skillforge.auth.dto.AuthResponse;
import com.skillforge.auth.dto.LoginRequest;
import com.skillforge.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email is already registered: " + req.email());
        }

        // Hash raw password using BCrypt PasswordEncoder
        String encodedPassword = passwordEncoder.encode(req.password());

        User user = new User(
                req.email(),
                encodedPassword,
                req.name(),
                req.role()
        );

        User savedUser = userRepository.save(user);
        return AuthResponse.fromUser(savedUser, "User registered successfully");
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return AuthResponse.fromUser(user, "Login successful");
    }
}
