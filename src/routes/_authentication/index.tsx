import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Flex, StackDivider, VStack } from '@chakra-ui/react';
import { getMemes, getUserById } from '../../api';
import { useAuthToken } from '../../contexts/authentication';
import { Loader } from '../../components/loader';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { MemeCard } from '../../components/meme-card';
import { MemesFeedPage } from '../../types/MemesFeed';

export const MemeFeedPage: React.FC = () => {
  const token = useAuthToken();

  const {
    data: memes,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery<MemesFeedPage>({
    getNextPageParam: (page) => {
      return page.nextPage;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const memesData = await getMemes(token, pageParam as number);

      const data = memesData.results.map(async (meme) => {
        const author = await getUserById(token, meme.authorId);

        return {
          meme,
          author,
        };
      });

      return {
        nextPage:
          memesData.results.length === memesData.pageSize
            ? (pageParam as number) + 1
            : undefined,
        data: await Promise.all(data),
      };
    },
    queryKey: ['memes'],
  });

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: isLoading,
    rootMargin: '0px 0px 400px 0px',
  });

  const onNewCommentAdded = (memeId: string) => {
    memes?.pages.forEach((page) => {
      page.data.forEach((memeData) => {
        if (memeData.meme.id === memeId) {
          memeData.meme.commentsCount += 1;
        }
      });
    })
  };

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes?.pages.map((page) =>
          page.data.map((memeData) => (
            <MemeCard
              key={memeData.meme.id}
              meme={memeData.meme}
              author={memeData.author}
              token={token}
              onNewCommentAdded={() => onNewCommentAdded(memeData.meme.id)}
            />
          ))
        )}

        {(isFetching || hasNextPage) && (
          <span ref={sentryRef}>
            <Loader />{' '}
          </span>
        )}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute('/_authentication/')({
  component: MemeFeedPage,
});
