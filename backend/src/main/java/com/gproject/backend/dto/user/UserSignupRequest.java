package com.gproject.backend.dto.user;

import lombok.Data;
import java.util.List;

@Data
public class UserSignupRequest {
    private String email;
    private String nickname;
    private String password;
    private String mbti;
    private List<String> interests;
    private List<String> personalityTags;
    private String bio;
    private IdealType idealType;
    private String univName;

    @Data
    public static class IdealType {
        private String mbti;
        private List<Integer> ageRange;
        private List<String> personalityTags;
    }
} 