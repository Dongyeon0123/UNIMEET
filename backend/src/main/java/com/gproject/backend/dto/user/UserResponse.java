package com.gproject.backend.dto.user;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String nickname;
    private String mbti;
    private List<String> interests;
    private List<String> personalityTags;
    private String bio;
    private IdealType idealType;

    @Data
    @Builder
    public static class IdealType {
        private String mbti;
        private List<Integer> ageRange;
        private List<String> personalityTags;
    }
} 