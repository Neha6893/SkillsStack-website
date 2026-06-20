package com.backend.backend_connectivity.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
@Configuration
public class SecurityConfig {
    @Deprecated
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())//Cross Site Request Forgery
                    .cors(cors -> {})//cross Origine Resource Sharing
                    //into a full working CORS setup that allows a frontend
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/verify-otp","/auth/request-otp","/api/notes/home/all").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
