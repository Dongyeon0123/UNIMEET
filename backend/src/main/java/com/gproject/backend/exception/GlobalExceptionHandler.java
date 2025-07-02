package com.gproject.backend.exception;

import com.gproject.backend.util.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResultResponse<?>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(ResultResponse.fail(400, e.getMessage()));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResultResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity.status(e.getStatus()).body(ResultResponse.fail(e.getStatus(), e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResultResponse<?>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResultResponse.fail(500, e.getMessage()));
    }
} 