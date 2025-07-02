package com.gproject.backend.service;

import com.gproject.backend.domain.CommunityComment;
import com.gproject.backend.domain.CommunityPost;
import com.gproject.backend.exception.CustomException;
import com.gproject.backend.repository.CommunityCommentRepository;
import com.gproject.backend.repository.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityPostRepository postRepository;
    private final CommunityCommentRepository commentRepository;

    public CommunityPost createPost(CommunityPost post) {
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);
        return post;
    }

    public CommunityPost updatePost(String postId, CommunityPost update) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(404, "게시글을 찾을 수 없습니다."));
        post.setTitle(update.getTitle());
        post.setContent(update.getContent());
        post.setTags(update.getTags());
        postRepository.save(post);
        return post;
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    public List<CommunityPost> getAllPosts() {
        return postRepository.findAll();
    }

    public CommunityComment addComment(String postId, CommunityComment comment) {
        comment.setPostId(postId);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(404, "게시글을 찾을 수 없습니다."));
        post.getCommentIds().add(comment.getId());
        postRepository.save(post);
        return comment;
    }

    public void deleteComment(String commentId) {
        commentRepository.deleteById(commentId);
    }

    public List<CommunityComment> getComments(String postId) {
        return commentRepository.findByPostId(postId);
    }
} 