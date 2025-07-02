package com.gproject.backend.controller;

import com.gproject.backend.dto.user.UserLoginRequest;
import com.gproject.backend.dto.user.UserSignupRequest;
import com.gproject.backend.service.AuthService;
import com.gproject.backend.service.UserService;
import com.gproject.backend.util.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    /**
     * 회원가입
     * POST /api/auth/signup
     * {
     *   "email": "test@univ.ac.kr",
     *   "nickname": "테스터",
     *   "password": "1234",
     *   "mbti": "INTJ",
     *   "interests": ["음악", "운동"],
     *   "personalityTags": ["외향적", "계획적"],
     *   "bio": "자기소개입니다.",
     *   "idealType": { "mbti": "ENFP", "ageRange": [20, 25], "personalityTags": ["유머러스"] }
     * }
     */
    @PostMapping("/signup")
    public ResultResponse<?> signup(@RequestBody UserSignupRequest request) {
        return ResultResponse.success(userService.signup(request));
    }

    /**
     * 로그인
     * POST /api/auth/login
     * {
     *   "email": "test@univ.ac.kr",
     *   "password": "1234"
     * }
     * 응답: { "code":200, "message":"success", "data": { "accessToken": "...", "refreshToken": "..." } }
     */
    @PostMapping("/login")
    public ResultResponse<?> login(@RequestBody UserLoginRequest request) {
        Map<String, String> tokens = authService.login(request);
        return ResultResponse.success(tokens);
    }

    /**
     * 이메일 중복 체크
     * GET /api/auth/check-email?email=test@univ.ac.kr
     * 응답: { "code":200, "message":"success", "data": true/false }
     */
    @GetMapping("/check-email")
    public ResultResponse<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkEmailDuplicate(email);
        return ResultResponse.success(exists);
    }
} 