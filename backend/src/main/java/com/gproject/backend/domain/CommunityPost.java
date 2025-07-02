package com.gproject.backend.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "community_posts")
public class CommunityPost {
    @Id
    private String id;
    private String author;
    private String title;
    private String content;
    private List<String> tags;
    private LocalDateTime createdAt;
    private List<String> commentIds;
} 