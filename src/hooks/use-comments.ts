/**
 * import type { CommentAgregated } from "@/db/schemas";
 * import { CommentService } from "@/db/services/comment.service";
 * import { useState, useEffect, useCallback } from "react";
 *
 * export function useComments(project_id: string, taskId: string) {
 *   const [comments, setComments] = useState<CommentAgregated[]>([]);
 *   const [loading, setLoading] = useState<boolean>(true);
 *   const [submitting, setSubmitting] = useState<boolean>(false);
 *   const [error, setError] = useState<Error | null>(null);
 *
 *   const fetchComments = useCallback(async () => {
 *     if (!taskId) return;
 *
 *     try {
 *       setLoading(true);
 *       setError(null);
 *       const data = await CommentService.getComments(taskId);
 *       setComments(data);
 *     } catch (err) {
 *       console.error("Erro ao buscar comentários:", err);
 *       setError(err instanceof Error ? err : new Error("Erro ao buscar"));
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [taskId]);
 *
 *   useEffect(() => {
 *     fetchComments();
 *   }, [fetchComments]);
 *
 *   const addComment = async (
 *     content: string,
 *     user_id: string,
 *     attachments?: string[],
 *   ) => {
 *     if (!content.trim()) return;
 *
 *     try {
 *       setSubmitting(true);
 *
 *       await CommentService.createComment({
 *         project_id,
 *         taskId,
 *         createdBy: user_id,
 *         attachments: attachments || [],
 *         created_at: new Date().toISOString(),
 *         content,
 *       });
 *
 *       await fetchComments();
 *     } catch (err) {
 *       console.error("Erro ao adicionar comentário:", err);
 *       throw err;
 *     } finally {
 *       setSubmitting(false);
 *     }
 *   };
 *
 *   return {
 *     comments,
 *     loading,
 *     submitting,
 *     error,
 *     addComment,
 *     refetch: fetchComments,
 *   };
 * }
 *
 * @format
 */
