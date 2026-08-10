package com.springboot.ams.config;

import com.springboot.ams.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private static final String ADMIN = "ADMIN";
    private static final String EMPLOYEE = "EMPLOYEE";

    private final UserService userService;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // AUTH
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/profile").authenticated()

                        // USER
                        .requestMatchers(HttpMethod.POST, "/api/users/add").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/all").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/users/update/{id}").hasAuthority(ADMIN)

                        // CATEGORY
                        .requestMatchers(HttpMethod.POST, "/api/categories/add").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/categories/all").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/categories/update/{id}").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/delete/{id}").hasAuthority(ADMIN)

                        // CATEGORY - v2
                        .requestMatchers(HttpMethod.GET, "/api/v2/categories/get/{id}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v2/categories/search").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v2/categories/all-with-count").hasAuthority(ADMIN)

                        // ASSET
                        .requestMatchers(HttpMethod.POST, "/api/assets/add/{categoryId}").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/assets/all").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/assets/get-one/{id}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/assets/available").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/assets/update/{id}/{categoryId}").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/assets/delete/{id}").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/assets/{assetId}/upload-image").hasAuthority(ADMIN)

                        // ASSET REQUEST
                        .requestMatchers(HttpMethod.POST, "/api/asset-requests/add/{assetId}").hasAuthority(EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, "/api/asset-requests/my").hasAuthority(EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, "/api/asset-requests/all").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/asset-requests/{id}/approve").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/asset-requests/{id}/reject").hasAuthority(ADMIN)

                        // ALLOCATION
                        .requestMatchers(HttpMethod.GET, "/api/asset-allocations/all").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/asset-allocations/my").hasAuthority(EMPLOYEE)
                        .requestMatchers(HttpMethod.PUT, "/api/asset-allocations/{id}/return").hasAuthority(EMPLOYEE)

                        // SERVICE REQUEST
                        .requestMatchers(HttpMethod.POST, "/api/service-requests/add/{assetId}").hasAuthority(EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, "/api/service-requests/my").hasAuthority(EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, "/api/service-requests/all").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/service-requests/{id}/update-status").hasAuthority(ADMIN)

                        // DASHBOARD
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/admin-stats").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/employee-stats").hasAuthority(EMPLOYEE)

                        .anyRequest().authenticated()
                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider dao = new DaoAuthenticationProvider(userService);
        dao.setPasswordEncoder(passwordEncoder());
        return dao;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}