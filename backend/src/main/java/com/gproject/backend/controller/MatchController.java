package com.gproject.backend.controller;

import com.gproject.backend.domain.Match;
import com.gproject.backend.dto.match.MatchRequest;
import com.gproject.backend.dto.match.MatchResponse;
import com.gproject.backend.service.MatchService;
import com.gproject.backend.util.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    /**
     * 내 매칭 리스트 조회
     * GET /api/match/list
     * Authorization: Bearer {accessToken}
     * 응답: { "code":200, "message":"success", "data": [ ...MatchResponse ] }
     */
    @GetMapping("/list")
    public ResultResponse<List<MatchResponse>> getMyMatches(@AuthenticationPrincipal UserDetails userDetails) {
        return ResultResponse.success(matchService.getUserMatches(userDetails.getUsername()));
    }

    /**
     * 매칭 생성 (AI 서버 연동)
     * POST /api/match
     * {
     *   "userA": "userId",
     *   "userVector": [0.1, 0.2, ...],
     *   "candidates": ["userId1", "userId2", ...]
     * }
     * 응답: { "code":200, "message":"success", "data": { ...MatchResponse } }
     */
    @PostMapping
    public ResultResponse<MatchResponse> createMatch(@RequestBody MatchRequest request) {
        return ResultResponse.success(matchService.createMatch(request));
    }

    /**
     * 매칭 상태 변경
     * PUT /api/match/{matchId}/status
     * {
     *   "status": "ACCEPTED" // 또는 REJECTED
     * }
     * 응답: { "code":200, "message":"success", "data": { ...MatchResponse } }
     */
    @PutMapping("/{matchId}/status")
    public ResultResponse<MatchResponse> updateStatus(@PathVariable String matchId, @RequestParam Match.Status status) {
        return ResultResponse.success(matchService.updateStatus(matchId, status));
    }
} 