package com.gproject.backend.service;

import com.gproject.backend.domain.User;
import com.gproject.backend.dto.user.UserSignupRequest;
import com.gproject.backend.dto.user.UserResponse;
import com.gproject.backend.exception.CustomException;
import com.gproject.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.net.URI;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String EMAIL_AUTH_PREFIX = "email_auth_";
    private static final long EMAIL_AUTH_EXPIRE_MINUTES = 10;
    private static final String UNIVCERT_API_KEY = "a11b1cdc-c5ff-433d-9ae2-7b5ba3789b46";
    private static final String UNIVCERT_SEND_URL = "https://api.univcert.com/v1/send";
    private static final String UNIVCERT_CERTIFY_URL = "https://api.univcert.com/v1/certify";

    // 인증코드 발송 (HTTP 직접 요청)
    public void sendUnivEmailCode(String email, String univName) {
        try {
            URL url = URI.create(UNIVCERT_SEND_URL).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            Map<String, Object> body = new HashMap<>();
            body.put("key", UNIVCERT_API_KEY);
            body.put("email", email);
            body.put("univ", univName);
            body.put("univ_check", true);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(body);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                throw new CustomException(400, "인증코드 발송에 실패했습니다.");
            }
            InputStream is = conn.getInputStream();
            String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            Map<String, Object> json = objectMapper.readValue(response, new TypeReference<Map<String, Object>>() {});
            Object successObj = json.get("success");
            if (!(successObj instanceof Boolean) || !((Boolean) successObj)) {
                throw new CustomException(400, "인증코드 발송에 실패했습니다: " + json.getOrDefault("message", ""));
            }
        } catch (Exception e) {
            e.printStackTrace(); // 예외 로그를 콘솔에 출력
            throw new CustomException(400, "인증코드 발송 중 오류가 발생했습니다.");
        }
    }

    // 인증코드 검증 (HTTP 직접 요청)
    public boolean verifyUnivEmailCode(String email, String code) {
        try {
            URL url = URI.create(UNIVCERT_CERTIFY_URL).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            Map<String, Object> body = new HashMap<>();
            body.put("key", UNIVCERT_API_KEY);
            body.put("email", email);
            body.put("code", code);
            body.put("univ", "건국대학교");
            body.put("univ_check", true);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(body);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                return false;
            }
            InputStream is = conn.getInputStream();
            String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            Map<String, Object> json = objectMapper.readValue(response, new TypeReference<Map<String, Object>>() {});
            Object successObj = json.get("success");
            if (successObj instanceof Boolean && (Boolean) successObj) {
                // 인증 성공 시 인증 완료 플래그 저장
                redisTemplate.opsForValue().set(EMAIL_AUTH_PREFIX + email + "_verified", true, EMAIL_AUTH_EXPIRE_MINUTES, TimeUnit.MINUTES);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isEmailVerified(String email) {
        Object verified = redisTemplate.opsForValue().get(EMAIL_AUTH_PREFIX + email + "_verified");
        return verified != null && Boolean.TRUE.equals(verified);
    }

    @Transactional
    public UserResponse signup(UserSignupRequest request) {
        if (!request.getEmail().toLowerCase().endsWith("@kku.ac.kr")) {
            throw new CustomException(400, "이메일은 반드시 @kku.ac.kr로 끝나야 합니다.");
        }
        // 이메일 인증 플래그 확인
        if (!isEmailVerified(request.getEmail())) {
            throw new CustomException(400, "대학교 이메일 인증에 실패했습니다. (인증 절차를 완료하세요)");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(409, "이미 사용 중인 이메일입니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .nickname(request.getNickname())
                .password(passwordEncoder.encode(request.getPassword()))
                .mbti(request.getMbti())
                .interests(request.getInterests())
                .personalityTags(request.getPersonalityTags())
                .bio(request.getBio())
                .idealType(User.IdealType.builder()
                        .mbti(request.getIdealType().getMbti())
                        .ageRange(request.getIdealType().getAgeRange())
                        .personalityTags(request.getIdealType().getPersonalityTags())
                        .build())
                .build();
        userRepository.save(user);
        // 회원가입 후 인증 플래그 삭제
        redisTemplate.delete(EMAIL_AUTH_PREFIX + request.getEmail() + "_verified");
        return toResponse(user);
    }

    public boolean checkEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserResponse getUserInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(404, "사용자를 찾을 수 없습니다."));
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateUserInfo(String userId, UserSignupRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(404, "사용자를 찾을 수 없습니다."));
        user.setNickname(request.getNickname());
        user.setMbti(request.getMbti());
        user.setInterests(request.getInterests());
        user.setPersonalityTags(request.getPersonalityTags());
        user.setBio(request.getBio());
        user.setIdealType(User.IdealType.builder()
                .mbti(request.getIdealType().getMbti())
                .ageRange(request.getIdealType().getAgeRange())
                .personalityTags(request.getIdealType().getPersonalityTags())
                .build());
        userRepository.save(user);
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .mbti(user.getMbti())
                .interests(user.getInterests())
                .personalityTags(user.getPersonalityTags())
                .bio(user.getBio())
                .idealType(UserResponse.IdealType.builder()
                        .mbti(user.getIdealType().getMbti())
                        .ageRange(user.getIdealType().getAgeRange())
                        .personalityTags(user.getIdealType().getPersonalityTags())
                        .build())
                .build();
    }
} 