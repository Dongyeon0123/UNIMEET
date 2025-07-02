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
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import java.net.URI;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse signup(UserSignupRequest request) {
        // 이메일 도메인 체크
        if (!request.getEmail().toLowerCase().endsWith("@kku.ac.kr")) {
            throw new CustomException(400, "이메일은 반드시 @kku.ac.kr로 끝나야 합니다.");
        }
        // 대학 이메일 인증
        if (!verifyUnivEmail("a11b1cdc-c5ff-433d-9ae2-7b5ba3789b46", request.getEmail(), request.getUnivName())) {
            throw new CustomException(400, "대학교 이메일 인증에 실패했습니다.");
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
        return toResponse(user);
    }

    private boolean verifyUnivEmail(String apiKey, String email, String univName) {
        try {
            URL url = URI.create("https://api.univcert.com/v1/certify").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            Map<String, Object> body = new HashMap<>();
            body.put("key", apiKey);
            body.put("email", email);
            body.put("univ", univName);
            body.put("univ_check", true);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(body);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                InputStream is = conn.getInputStream();
                String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                Map<String, Object> json = objectMapper.readValue(response, new TypeReference<Map<String, Object>>() {});
                Object successObj = json.get("success");
                if (successObj instanceof Boolean) {
                    return (Boolean) successObj;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
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