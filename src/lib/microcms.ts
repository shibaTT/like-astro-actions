import { createClient } from "microcms-js-sdk"
import type { MicroCMSQueries, MicroCMSImage, MicroCMSListResponse, MicroCMSDate } from "microcms-js-sdk"

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN
const apiKey = import.meta.env.MICROCMS_API_KEY

if (!serviceDomain || !apiKey) {
    throw new Error(
        "Required environment variables are not set: MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be defined",
    )
}

// console.log("microCMS service domain:", serviceDomain)
// console.log("microCMS API key:", apiKey)

export const client = createClient({
    serviceDomain,
    apiKey,
})

export type Blog = {
    id: string
    title: string
    content: string
    eyecatch?: MicroCMSImage
    likes: number
}

export type BlogResponse = {
    contents: Blog[]
    totalCount: number
    offset: number
    limit: number
}

export const getBlogs = async (queries?: MicroCMSQueries) => {
    try {
        const response = await client.get<MicroCMSListResponse<Blog & MicroCMSDate>>({
            endpoint: "blogs",
            queries,
        })

        return {
            contents: response.contents,
            totalCount: response.totalCount,
            offset: response.offset,
            limit: response.limit,
        }
    } catch (error) {
        console.error("Error fetching blogs:", error)
        throw new Error("Failed to fetch blogs from microCMS")
    }
}

export const getBlogDetail = async (contentId: string, queries?: MicroCMSQueries): Promise<Blog & MicroCMSDate> => {
    if (!contentId) {
        throw new Error("contentId is required")
    }

    try {
        return await client.get<Blog & MicroCMSDate>({
            endpoint: "blogs",
            contentId,
            queries,
        })
    } catch (error) {
        console.error("Error fetching blog detail:", error)
        throw new Error("Failed to fetch blog detail from microCMS")
    }
}
