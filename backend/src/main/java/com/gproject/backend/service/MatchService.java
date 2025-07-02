package com.gproject.backend.service;

import com.gproject.backend.domain.Match;
import com.gproject.backend.dto.match.MatchRequest;
import com.gproject.backend.dto.match.MatchResponse;
import com.gproject.backend.exception.CustomException;
import com.gproject.backend.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.core.ParameterizedTypeReference;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final WebClient.Builder webClientBuilder;
    @Value("${ai.url}")
    private String aiUrl;

    public List<MatchResponse> getUserMatches(String userId) {
        return matchRepository.findByUserAOrUserB(userId, userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MatchResponse createMatch(MatchRequest request) {
        // AI 서버에 추천 요청
        try {
            Mono<List<String>> resultMono = webClientBuilder.build()
                    .post()
                    .uri(aiUrl)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<String>>() {});
            List<String> recommended = resultMono.block();
            if (recommended == null || recommended.isEmpty()) {
                throw new CustomException(400, "추천 결과가 없습니다.");
            }
            String userB = recommended.get(0);
            Match match = Match.builder()
                    .userA(request.getUserA())
                    .userB(userB)
                    .score(0.0) // 실제 점수는 AI 서버에서 받아올 수 있으면 반영
                    .matchedAt(LocalDateTime.now())
                    .status(Match.Status.WAITING)
                    .build();
            matchRepository.save(match);
            return toResponse(match);
        } catch (Exception e) {
            throw new CustomException(500, "AI 매칭 서버 연동 실패: " + e.getMessage());
        }
    }

    public MatchResponse updateStatus(String matchId, Match.Status status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new CustomException(404, "매칭 정보를 찾을 수 없습니다."));
        match.setStatus(status);
        matchRepository.save(match);
        return toResponse(match);
    }

    private MatchResponse toResponse(Match match) {
        return MatchResponse.builder()
                .id(match.getId())
                .userA(match.getUserA())
                .userB(match.getUserB())
                .score(match.getScore())
                .matchedAt(match.getMatchedAt())
                .status(match.getStatus())
                .build();
    }
} 