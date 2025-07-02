package com.gproject.backend.dto.match;

import lombok.Data;
import java.util.List;

@Data
public class MatchRequest {
    private String userA;
    private List<Double> userVector;
    private List<String> candidates;
} 