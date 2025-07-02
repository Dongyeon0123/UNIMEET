package com.gproject.backend.repository;

import com.gproject.backend.domain.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByUserAOrUserB(String userA, String userB);
} 