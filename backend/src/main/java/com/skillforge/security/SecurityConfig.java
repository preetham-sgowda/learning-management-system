package com.skillforge.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Backend Security & API Standards v1 (Avani):
 * - Stateless JWT auth, no server-side session.
 * - @PreAuthorize("hasRole('ADMIN')") enforced on every admin-only endpoint
 *   (see CourseController / ModuleController / ArticleController).
 *
 * TODO (Monica): implement JwtAuthenticationFilter per the security architecture
 * doc (HS256, 15 min access / 7 day rotating refresh) and register it below in
 * place of the addFilterBefore(...) placeholder. Until then all requests are
 * treated as unauthenticated, so @PreAuthorize("hasRole('ADMIN')") will reject
 * everything - that's expected until the filter is wired in.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // stateless JWT API, no cookies/CSRF exposure
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/api-docs/**", "/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                );
                // .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // ^ Monica: uncomment once JwtAuthenticationFilter exists in com.skillforge.security

        return http.build();
    }
}
