package com.gproject.backend.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "community_comments")
public class CommunityComment {
    @Id
    private String id;
    private String postId;
    private String author;
    private String content;
    private LocalDateTime createdAt;
} 