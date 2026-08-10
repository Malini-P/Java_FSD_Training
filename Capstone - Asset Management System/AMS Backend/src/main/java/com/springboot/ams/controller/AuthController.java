package com.springboot.ams.controller;

import com.springboot.ams.dto.request.ChangePasswordDto;
import com.springboot.ams.dto.response.TokenDto;
import com.springboot.ams.dto.response.UserRespDto;
import com.springboot.ams.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    /*
     * .requestMatchers(HttpMethod.POST, "/api/auth/login").authenticated()
     *
     * This ensures that if user request comes to this login() method,
     * Spring already has checked username/password and they are right,
     * so we can ask for username from Spring's Principal
     * */
    @PostMapping("/login")
    public TokenDto login(Principal principal) {
        String username = principal.getName();
        return authService.login(username);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ChangePasswordDto dto) {
        return authService.forgotPassword(dto);
    }

    @GetMapping("/profile")
    public UserRespDto profile(Principal principal) {
        return authService.profile(principal.getName());
    }
}
