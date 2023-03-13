import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Messages } from './entities/messages.entity';
import { MessagesService } from './messages.service';
import { AddMessageInput } from './dto/addmessage.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Messages)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Messages)
  async addMessage(@Args('addMessageInput') addMessageInput: AddMessageInput): Promise<Messages> {
    const newMessage = await this.messagesService.addMessage(addMessageInput);
    pubSub.publish('messageAdded', { messageAdded: newMessage });
    return newMessage;
  }

  @Query(() => [Messages], { name: 'getMessages' })
  async findChatLogsFromChat(@Args('uuid', { type: () => String }) uuid: string): Promise<Messages[]> {
    return this.messagesService.getMessages(uuid);
  }

  @Query(() => [Messages], { name: 'getAllMessages' })
  async findAll(): Promise<Messages[]> {
    return this.messagesService.findAll();
  }

  @Subscription(() => Messages, {
    filter: (payload, variables) => {
      return payload.messageAdded.chatId === variables.chatId;
    },
  })
  messageAdded(@Args('chatId') chatId: string) {
    return pubSub.asyncIterator('messageAdded');
  }
}
