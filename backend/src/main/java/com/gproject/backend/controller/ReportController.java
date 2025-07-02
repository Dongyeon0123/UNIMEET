package com.gproject.backend.controller;

import com.gproject.backend.domain.Report;
import com.gproject.backend.service.ReportService;
import com.gproject.backend.util.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    /**
     * 신고 저장
     * POST /api/report
     * {
     *   "reporterId": "userId",
     *   "targetUserId": "userId",
     *   "reason": "신고 사유"
     * }
     */
    @PostMapping
    public ResultResponse<Report> saveReport(@RequestBody Report report) {
        return ResultResponse.success(reportService.saveReport(report));
    }

    /**
     * 내가 한 신고 내역 조회
     * GET /api/report/reporter/{reporterId}
     */
    @GetMapping("/reporter/{reporterId}")
    public ResultResponse<List<Report>> getReportsByReporter(@PathVariable String reporterId) {
        return ResultResponse.success(reportService.getReportsByReporter(reporterId));
    }

    /**
     * 내가 받은 신고 내역 조회
     * GET /api/report/target/{targetUserId}
     */
    @GetMapping("/target/{targetUserId}")
    public ResultResponse<List<Report>> getReportsByTarget(@PathVariable String targetUserId) {
        return ResultResponse.success(reportService.getReportsByTarget(targetUserId));
    }

    /**
     * 신고 상태 변경
     * PUT /api/report/{reportId}/status?status=DONE
     */
    @PutMapping("/{reportId}/status")
    public ResultResponse<Report> updateStatus(@PathVariable String reportId, @RequestParam Report.Status status) {
        return ResultResponse.success(reportService.updateStatus(reportId, status));
    }
} 