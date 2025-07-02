package com.gproject.backend.controller;

import com.gproject.backend.domain.CommunityComment;
import com.gproject.backend.domain.CommunityPost;
import com.gproject.backend.service.CommunityService;
import com.gproject.backend.util.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
    private final CommunityService communityService;

    /**
     * 게시글 전체 조회
     * GET /api/community/posts
     */
    @GetMapping("/posts")
    public ResultResponse<List<CommunityPost>> getAllPosts() {
        return ResultResponse.success(communityService.getAllPosts());
    }

    /**
     * 게시글 작성
     * POST /api/community/post
     */
    @PostMapping("/post")
    public ResultResponse<CommunityPost> createPost(@RequestBody CommunityPost post) {
        return ResultResponse.success(communityService.createPost(post));
    }

    /**
     * 게시글 수정
     * PUT /api/community/post/{postId}
     */
    @PutMapping("/post/{postId}")
    public ResultResponse<CommunityPost> updatePost(@PathVariable String postId, @RequestBody CommunityPost post) {
        return ResultResponse.success(communityService.updatePost(postId, post));
    }

    /**
     * 게시글 삭제
     * DELETE /api/community/post/{postId}
     */
    @DeleteMapping("/post/{postId}")
    public ResultResponse<?> deletePost(@PathVariable String postId) {
        communityService.deletePost(postId);
        return ResultResponse.success(null);
    }

    /**
     * 댓글 작성
     * POST /api/community/post/{postId}/comment
     */
    @PostMapping("/post/{postId}/comment")
    public ResultResponse<CommunityComment> addComment(@PathVariable String postId, @RequestBody CommunityComment comment) {
        return ResultResponse.success(communityService.addComment(postId, comment));
    }

    /**
     * 댓글 삭제
     * DELETE /api/community/comment/{commentId}
     */
    @DeleteMapping("/comment/{commentId}")
    public ResultResponse<?> deleteComment(@PathVariable String commentId) {
        communityService.deleteComment(commentId);
        return ResultResponse.success(null);
    }

    /**
     * 게시글의 댓글 전체 조회
     * GET /api/community/post/{postId}/comments
     */
    @GetMapping("/post/{postId}/comments")
    public ResultResponse<List<CommunityComment>> getComments(@PathVariable String postId) {
        return ResultResponse.success(communityService.getComments(postId));
    }
} 