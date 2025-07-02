package com.gproject.backend.service;

import com.gproject.backend.domain.Report;
import com.gproject.backend.exception.CustomException;
import com.gproject.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;

    public Report saveReport(Report report) {
        report.setStatus(Report.Status.PROCESSING);
        report.setReportedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public List<Report> getReportsByReporter(String reporterId) {
        return reportRepository.findByReporterId(reporterId);
    }

    public List<Report> getReportsByTarget(String targetUserId) {
        return reportRepository.findByTargetUserId(targetUserId);
    }

    public Report updateStatus(String reportId, Report.Status status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CustomException(404, "신고 내역을 찾을 수 없습니다."));
        report.setStatus(status);
        return reportRepository.save(report);
    }
} 