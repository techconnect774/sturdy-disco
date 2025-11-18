import { supabase } from '../lib/supabase';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export interface MediaItem {
  id: string;
  article_id: string;
  type: 'image' | 'video';
  url: string;
  source: 'upload' | 'url';
  caption?: string;
  order_index: number;
  created_at: string;
}

export interface ArticleWithMedia extends Article {
  media: MediaItem[];
}

export interface ArticleWithDetails extends ArticleWithMedia {
  comments: any[];
}

export const articleService = {
  /**
   * Fetch all published articles with their media
   */
  async getPublishedArticles(): Promise<ArticleWithMedia[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*, media(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data as ArticleWithMedia[];
  },

  /**
   * Fetch all articles (published and drafts) for admin
   */
  async getAllArticles(): Promise<ArticleWithMedia[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*, media(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ArticleWithMedia[];
  },

  /**
   * Fetch single article by ID with media and comments
   */
  async getArticleById(id: string): Promise<ArticleWithDetails> {
    const { data, error } = await supabase
      .from('articles')
      .select('*, media(*), comments(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as ArticleWithDetails;
  },

  /**
   * Create new article (admin only)
   */
  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    
    if (error) throw error;
    return data as Article;
  },

  /**
   * Update article (admin only)
   */
  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Article;
  },

  /**
   * Delete article (admin only)
   */
  async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  /**
   * Upload media file to Supabase storage
   */
  async uploadMedia(file: File, articleId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${articleId}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  /**
   * Add media reference to article
   */
  async addMediaToArticle(mediaData: Partial<MediaItem>): Promise<MediaItem> {
    const { data, error } = await supabase
      .from('media')
      .insert([mediaData])
      .select()
      .single();
    
    if (error) throw error;
    return data as MediaItem;
  }
};
