package com.gproject.backend.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "matches")
public class Match {
    @Id
    private String id;
    private String userA;
    private String userB;
    private double score;
    private LocalDateTime matchedAt;
    private Status status;

    public enum Status {
        WAITING, ACCEPTED, REJECTED
    }
} 