package com.gproject.backend.controller;

import com.gproject.backend.dto.user.UserResponse;
import com.gproject.backend.dto.user.UserSignupRequest;
import com.gproject.backend.service.UserService;
import com.gproject.backend.util.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * 내 정보 조회
     * GET /api/user/me
     * Authorization: Bearer {accessToken}
     * 응답: { "code":200, "message":"success", "data": { ...UserResponse } }
     */
    @GetMapping("/me")
    public ResultResponse<UserResponse> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        return ResultResponse.success(userService.getUserInfo(userDetails.getUsername()));
    }

    /**
     * 내 정보 수정
     * PUT /api/user/me
     * Authorization: Bearer {accessToken}
     * {
     *   "nickname": "새닉네임",
     *   ...
     * }
     * 응답: { "code":200, "message":"success", "data": { ...UserResponse } }
     */
    @PutMapping("/me")
    public ResultResponse<UserResponse> updateMyInfo(@AuthenticationPrincipal UserDetails userDetails,
                                                     @RequestBody UserSignupRequest request) {
        return ResultResponse.success(userService.updateUserInfo(userDetails.getUsername(), request));
    }
} 