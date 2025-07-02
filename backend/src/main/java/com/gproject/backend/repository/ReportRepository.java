package com.gproject.backend.repository;

import com.gproject.backend.domain.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByReporterId(String reporterId);
    List<Report> findByTargetUserId(String targetUserId);
} 