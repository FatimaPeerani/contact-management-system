package com.fatima.backend;

import com.fatima.backend.dto.*;
import com.fatima.backend.model.User;
import com.fatima.backend.repository.UserRepository;
import com.fatima.backend.security.JwtUtil;
import com.fatima.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@mail.com");
        request.setPassword("123456");
        request.setFirstName("Ali");
        request.setLastName("Khan");

        when(userRepository.existsByEmail("test@mail.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(jwtUtil.generateToken(any())).thenReturn("token");
        when(userRepository.save(any())).thenReturn(new User());

        AuthResponse res = authService.register(request);

        assertNotNull(res);
        assertEquals("token", res.getToken());
    }

    @Test
    void testRegisterEmailExists() {
        when(userRepository.existsByEmail(any())).thenReturn(true);

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@mail.com");

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setFirstName("Ali");
        user.setLastName("Khan");

        when(authenticationManager.authenticate(any())).thenReturn(null); // ✅ fixed
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(any())).thenReturn("token");

        LoginRequest request = new LoginRequest();
        request.setEmail("test@mail.com");
        request.setPassword("123456");

        AuthResponse res = authService.login(request);

        assertNotNull(res);
        assertEquals("token", res.getToken());
    }

    @Test
    void testLoginUserNotFound() {
        when(authenticationManager.authenticate(any())).thenReturn(null); // ✅ fixed
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@mail.com");
        request.setPassword("123456");

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void testChangePasswordSuccess() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encodedOld");

        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("oldPass", "encodedOld")).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNew");

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPass");
        request.setNewPassword("newPass");

        authService.changePassword("test@mail.com", request);

        verify(userRepository, times(1)).save(user);
        assertEquals("encodedNew", user.getPassword());
    }

    @Test
    void testChangePasswordWrongOldPassword() {
        User user = new User();
        user.setPassword("encodedOld");

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrongPass");
        request.setNewPassword("newPass");

        assertThrows(RuntimeException.class, () -> authService.changePassword("test@mail.com", request));
    }

    @Test
    void testChangePasswordUserNotFound() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        ChangePasswordRequest request = new ChangePasswordRequest();
        assertThrows(RuntimeException.class, () -> authService.changePassword("none@mail.com", request));
    }
}