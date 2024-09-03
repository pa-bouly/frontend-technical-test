import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'timeago.js';
import React from 'react';
import { CommentWithAuthor } from '../types/MemesFeed';

export type MemeCommentProps = {
  memeId: string;
  comment: CommentWithAuthor;
};

export const MemeComment: React.FC<MemeCommentProps> = ({
  memeId,
  comment,
}) => {
  return (
    <Flex key={comment.id}>
      <Avatar
        borderWidth="1px"
        borderColor="gray.300"
        size="sm"
        name={comment.author.username}
        src={comment.author.pictureUrl}
        mr={2}
      />
      <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <Text data-testid={`meme-comment-author-${memeId}-${comment.id}`}>
              {comment.author.username}
            </Text>
          </Flex>
          <Text fontStyle="italic" color="gray.500" fontSize="small">
            {format(comment.createdAt)}
          </Text>
        </Flex>
        <Text
          color="gray.500"
          whiteSpace="pre-line"
          data-testid={`meme-comment-content-${memeId}-${comment.id}`}
        >
          {comment.content}
        </Text>
      </Box>
    </Flex>
  );
};
