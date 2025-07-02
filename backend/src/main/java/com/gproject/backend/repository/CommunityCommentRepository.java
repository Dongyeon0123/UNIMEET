package com.gproject.backend.repository;

import com.gproject.backend.domain.CommunityComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityCommentRepository extends MongoRepository<CommunityComment, String> {
    List<CommunityComment> findByPostId(String postId);
} 