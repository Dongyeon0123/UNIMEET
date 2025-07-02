package com.gproject.backend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ResultResponse<T> success(T data) {
        return ResultResponse.<T>builder()
                .code(200)
                .message("success")
                .data(data)
                .build();
    }

    public static ResultResponse<?> fail(int code, String message) {
        return ResultResponse.builder()
                .code(code)
                .message(message)
                .data(null)
                .build();
    }
} 