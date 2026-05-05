package com.parking.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.config.JwtUtil;
import com.parking.dto.LoginRequestDTO;
import com.parking.dto.LoginResponseDTO;
import com.parking.dto.MeResponseDTO;
import com.parking.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion", description = "Retorna un JWT para autenticacion en endpoints protegidos.")
    @SecurityRequirements
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil autenticado", description = "Obtiene el usuario actual desde el token JWT.")
    public ResponseEntity<MeResponseDTO> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        String nombre = jwtUtil.extractNombre(token);
        String rol = jwtUtil.extractRole(token);

        return ResponseEntity.ok(new MeResponseDTO(username, nombre, rol));
    }
}
