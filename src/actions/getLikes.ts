import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { createClient, type MicroCMSContentId, type MicroCMSDate } from "microcms-js-sdk"
import type { Blog } from "../lib/microcms"

// いいね処理の成功・失敗レスポンスの型定義
type Success = {
    success: true
    likes: number
}

type Error = {
    success: false
    error: string
}

type GetLikesResponse = Success | Error

// microCMSのクライアントを作成（環境変数から認証情報を取得）
const client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: import.meta.env.MICROCMS_API_KEY,
})

export const getLikes = defineAction({
    input: z.object({
        blogId: z.string(),
    }),
    handler: async (input): Promise<GetLikesResponse> => {
        const { blogId } = input

        try {
            const response = await client.get<Blog & MicroCMSDate & MicroCMSContentId>({
                endpoint: "blogs",
                contentId: blogId,
            })
            return { success: true, likes: response.likes }
        } catch (error) {
            console.error("getLikes error:", error)
            return { success: false, error: "いいね数の取得に失敗しました" }
        }
    },
})
