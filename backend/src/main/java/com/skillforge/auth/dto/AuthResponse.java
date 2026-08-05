package com.skillforge.auth.dto;

import com.skillforge.auth.User;
import java.util.UUID;

public record AuthResponse(
        UUID id,
        String email,
        String name,
        String role,
        String message
) {
    public static AuthResponse fromUser(User user, String message) {
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                message
        );
    }
}
