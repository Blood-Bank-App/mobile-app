import { CommentAPI } from '@/services/api';
import { Comment } from './types';

export async function addComment(requestId: string, uid: string, text: string): Promise<string> {
  try {
    const comment = await CommentAPI.createComment(requestId, text);
    return comment.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function listComments(requestId: string): Promise<Comment[]> {
  try {
    const comments = await CommentAPI.listRequestComments(requestId);
    return comments;
  } catch (error) {
    console.error('Error listing comments:', error);
    return [];
  }
}

export async function deleteComment(requestId: string, commentId: string): Promise<void> {
  try {
    await CommentAPI.deleteComment(commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function updateComment(commentId: string, text: string): Promise<Comment> {
  try {
    const updatedComment = await CommentAPI.updateComment(commentId, text);
    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}