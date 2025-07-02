package com.gproject.backend.dto.match;

import com.gproject.backend.domain.Match;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchResponse {
    private String id;
    private String userA;
    private String userB;
    private double score;
    private LocalDateTime matchedAt;
    private Match.Status status;
} 