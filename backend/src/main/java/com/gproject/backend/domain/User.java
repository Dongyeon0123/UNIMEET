package com.gproject.backend.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String nickname;
    private String password;
    private String mbti;
    private List<String> interests;
    private List<String> personalityTags;
    private String bio;
    private IdealType idealType;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IdealType {
        private String mbti;
        private List<Integer> ageRange; // [min, max]
        private List<String> personalityTags;
    }
} 