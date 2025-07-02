package com.gproject.backend.repository;

import com.gproject.backend.domain.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityPostRepository extends MongoRepository<CommunityPost, String> {
    List<CommunityPost> findByTagsContaining(String tag);
} 