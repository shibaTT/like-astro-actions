import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { createClient } from "microcms-js-sdk"

const client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: import.meta.env.MICROCMS_API_KEY,
})

const ipCache = new Map<string, number>()

export const like = {
    like: defineAction({
        input: z.object({
            blogId: z.string(),
            likes: z.number(),
        }),
        handler: async (input, ctx) => {
            try {
                const { blogId, likes } = input
                const { request } = ctx
                const clientIp = request.headers.get("x-forwarded-for") || "unknown"
                const now = Date.now()
                const lastLike = ipCache.get(clientIp)

                if (lastLike && now - lastLike < 5000) {
                    return { success: false, error: "5秒間待ってからいいねしてください" }
                }

                await client.update({
                    endpoint: "blogs",
                    contentId: blogId,
                    content: {
                        likes: likes + 1,
                    },
                })

                ipCache.set(clientIp, now)
                return { success: true, likes: likes + 1 }
            } catch (error) {
                console.error("Like error:", error)
                return { success: false, error: "いいねの更新に失敗しました" }
            }
        },
    }),
}
