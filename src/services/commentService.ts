import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

export interface CommentWithArticle extends Comment {
  articles: {
    title: string;
  };
}

export const commentService = {
  /**
   * Get comments for a specific article
   */
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Comment[];
  },

  /**
   * Create new comment with auto-approval
   */
  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...commentData, is_approved: true }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Comment;
  },

  /**
   * Delete comment (admin only)
   */
  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  /**
   * Get all comments for admin moderation
   */
  async getAllComments(): Promise<CommentWithArticle[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, articles(title)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CommentWithArticle[];
  }
};
