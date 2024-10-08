import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react';
import { format } from 'timeago.js';
import { MemeComments } from './meme-comments';
import { MemePicture } from './meme-picture';
import React from 'react';
import { GetUserByIdResponse, MemeResponseData } from '../types/ApiTypes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export type MemeCardProps = {
  meme: MemeResponseData;
  author: GetUserByIdResponse;
  token: string;
  onNewCommentAdded: () => void;
};

export const MemeCard: React.FC<MemeCardProps> = ({
  meme,
  author,
  token,
  onNewCommentAdded,
}) => {
  return (
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            size="xs"
            name={author.username}
            src={author.pictureUrl}
          />
          <Text ml={2} data-testid={`meme-author-${meme.id}`}>
            {author.username}
          </Text>
        </Flex>
        <Text fontStyle="italic" color="gray.500" fontSize="small">
          {format(meme.createdAt)}
        </Text>
      </Flex>

      <DndProvider backend={HTML5Backend}>
        <MemePicture
          pictureUrl={meme.pictureUrl}
          texts={meme.texts}
          dataTestId={`meme-picture-${meme.id}`}
        />
      </DndProvider>

      <Box>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:{' '}
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text
            color="gray.500"
            whiteSpace="pre-line"
            data-testid={`meme-description-${meme.id}`}
          >
            {meme.description}
          </Text>
        </Box>
      </Box>
      <MemeComments
        meme={meme}
        author={author}
        token={token}
        onNewCommentAdded={onNewCommentAdded}
      />
    </VStack>
  );
};
