import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { createClient } from "microcms-js-sdk"
import { LIKE_COOLDOWN } from "../lib/constants"

// いいね処理の成功・失敗レスポンスの型定義
type Success = {
    success: true
    likes: number
}

type Error = {
    success: false
    error: string
}

type LikeResponse = Success | Error

// microCMSのクライアントを作成（環境変数から認証情報を取得）
const client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: import.meta.env.MICROCMS_API_KEY,
})

// クライアントIPアドレスのキャッシュマップ（連続いいねを防ぐ）
const ipCache = new Map<string, number>()

// いいねアクションを定義
export const like = defineAction({
    // 入力データのスキーマ検証
    input: z.object({
        blogId: z.string(),
        likes: z.number(),
    }),
    // アクションのハンドラー関数
    handler: async (input, ctx): Promise<LikeResponse> => {
        try {
            // 入力データの分割代入
            const { blogId, likes } = input
            const { request } = ctx

            // 新しいlikes数
            const newLikes = likes + 1

            // クライアントのIPアドレスを取得（プロキシ環境に対応）
            const clientIp = request.headers.get("x-forwarded-for") || "unknown"
            const now = Date.now()

            // 直近のいいね時間を確認
            const lastLike = ipCache.get(clientIp)

            // 5秒以内の連続いいねを制限
            if (lastLike && now - lastLike < LIKE_COOLDOWN) {
                return { success: false, error: `${LIKE_COOLDOWN / 1000}秒間待ってからいいねしてください` }
            }

            // microCMSのブログコンテンツを更新（いいね数をインクリメント）
            await client.update({
                endpoint: "blogs",
                contentId: blogId,
                content: {
                    likes: newLikes,
                },
            })

            // IPアドレスとタイムスタンプをキャッシュに保存
            ipCache.set(clientIp, now)

            // 成功レスポンスを返却
            return { success: true, likes: newLikes }
        } catch (error) {
            // エラーハンドリング
            console.error("Like error:", error)
            return { success: false, error: "いいねの更新に失敗しました" }
        }
    },
})
