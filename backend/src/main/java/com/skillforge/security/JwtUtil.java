package com.skillforge.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final Key signingKey;
    private final long accessTokenValidityMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiry-minutes:15}") long accessTokenExpiryMinutes) {
        // The secret is expected as a plain string; we derive an HMAC SHA key.
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValidityMs = accessTokenExpiryMinutes * 60 * 1000;
    }

    /**
     * Generate a signed JWT for the given user id and role.
     */
    public String generateToken(UUID userId, String role) {
        long now = System.currentTimeMillis();
        Date expiry = new Date(now + accessTokenValidityMs);
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("role", role)
                .setIssuedAt(new Date(now))
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate the token and return the user id if valid; otherwise throws.
     */
    public UUID validateAndGetUserId(String token) {
        return UUID.fromString(Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject());
    }

    /**
     * Extract the role claim from a valid token.
     */
    public String extractRole(String token) {
        return (String) Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .get("role");
    }
}
