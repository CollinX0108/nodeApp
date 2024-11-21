import gql from "graphql-tag";

export const COMMENT_FRAGMENTS = {
    BASIC: gql`
        fragment BasicCommentFields on CommentType {
            id
            content
            userId
            createdAt
            updatedAt
        }
    `,

    REACTION: gql`
        fragment ReactionFields on ReactionType {
            userId
            type
        }
    `,

    FULL: gql`
        fragment FullCommentFields on CommentType {
            id
            content
            userId
            createdAt
            updatedAt
            parentId
            reactions {
                userId
                type
            }
            replies {
                id
                content
                userId
                createdAt
                reactions {
                    userId
                    type
                }
            }
        }
    `
};