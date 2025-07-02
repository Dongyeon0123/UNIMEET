package com.gproject.backend.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {
    @Id
    private String id;
    private String reporterId;
    private String targetUserId;
    private String reason;
    private Status status;
    private LocalDateTime reportedAt;

    public enum Status {
        PROCESSING, DONE, REJECTED
    }
} 