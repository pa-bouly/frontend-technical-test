import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  Input,
  VStack,
  Button,
} from '@chakra-ui/react';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createMemeComment, getMemeComments, getUserById } from '../api';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CommentsFeedPage } from '../types/MemesFeed';
import { MemeComment } from './meme-comment';
import {
  GetMemeCommentsResponse,
  GetUserByIdResponse,
  MemeResponseData,
} from '../types/ApiTypes';
import { Loader } from './loader';

export type MemeCommentsProps = {
  meme: MemeResponseData;
  author: GetUserByIdResponse;
  token: string;
  onNewCommentAdded: () => void;
};

export const MemeComments: React.FC<MemeCommentsProps> = ({
  meme,
  author,
  token,
  onNewCommentAdded
}) => {
  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery<CommentsFeedPage>({
    getNextPageParam: (page) => {
      return page.nextPage;
    },
    enabled: !!openedCommentSection,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const comments: GetMemeCommentsResponse['results'] = [];

      const memeComments = await getMemeComments(
        token,
        meme.id,
        pageParam as number
      );
      comments.push(...memeComments.results);

      const commentsWithAuthor: (GetMemeCommentsResponse['results'][0] & {
        author: GetUserByIdResponse;
      })[] = [];
      for (const comment of comments) {
        const author = await getUserById(token, comment.authorId);
        commentsWithAuthor.push({ ...comment, author });
      }

      return {
        nextPage:
          memeComments.results.length === memeComments.pageSize
            ? (pageParam as number) + 1
            : undefined,
        data: commentsWithAuthor,
      };
    },
    queryKey: ['comments', meme.id],
  });

  const [commentContent, setCommentContent] = useState('');
  const [isNewCommentLoading, setIsNewCommentLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      setIsNewCommentLoading(true);
      await createMemeComment(token, data.memeId, data.content);

      setCommentContent('');
      await refetch();
      setIsNewCommentLoading(false);
      onNewCommentAdded();
    },
  });

  return (
    <React.Fragment>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${meme.id}`}
              cursor="pointer"
              onClick={() =>
                setOpenedCommentSection(
                  openedCommentSection === meme.id ? null : meme.id
                )
              }
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>
                {meme.commentsCount} comments
              </Text>
            </LinkOverlay>
            <Icon
              as={openedCommentSection !== meme.id ? CaretDown : CaretUp}
              ml={2}
              mt={1}
            />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={openedCommentSection === meme.id} animateOpacity>
        <Box mb={6}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (commentContent) {
                mutate({
                  memeId: meme.id,
                  content: commentContent,
                });
              }
            }}
          >
            <Flex alignItems="center">
              <Avatar
                borderWidth="1px"
                borderColor="gray.300"
                name={author?.username}
                src={author?.pictureUrl}
                size="sm"
                mr={2}
              />
              <Input
                placeholder="Type your comment here..."
                onChange={(event) => {
                  setCommentContent(event.target.value);
                }}
                data-testid={`meme-comment-input-${meme.id}`}
                value={commentContent}
              />
            </Flex>
            {isNewCommentLoading ? (
              <Flex justifyContent={'center'} mt={2}>
                <Loader data-testid="new-comment-loader" />
              </Flex>
            ) : null}
          </form>
        </Box>
        <VStack
          align="stretch"
          spacing={4}
          data-testid={`meme-comments-list-${meme.id}`}
        >
          {comments?.pages.map((page) =>
            page.data.map((comment) => (
              <MemeComment
                key={comment.id}
                memeId={meme.id}
                comment={comment}
              />
            ))
          )}

          {hasNextPage && (
            <Button
              isLoading={isLoading || isFetching}
              onClick={() => fetchNextPage()}
              variant="link"
            >
              Load more comments
            </Button>
          )}
        </VStack>
      </Collapse>
    </React.Fragment>
  );
};
