import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Messages } from './entities/messages.entity';
import { MessagesService } from './messages.service';
import { AddMessageInput } from './dto/addmessage.input';
import { PubSubProvider } from '../pub-sub/pub-sub.provider';

@Resolver(() => Messages)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly pubSubProvider: PubSubProvider,
    ) {}

    @Mutation(() => Messages)
    addMessage(@Args('addMessageInput') addMessageInput: AddMessageInput) {
      const newMsg = this.messagesService.addMessage(addMessageInput);
      this.pubSubProvider.getPubSub().publish('chatMsgAdded', { chatLogAdded: newMsg });
      return newMsg;
    }

    @Query(() => [Messages], { name: 'getMessages' })
    getMessages(@Args('uuid', { type: () => String }) uuid: string) {
      return this.messagesService.getMessages(uuid);
    }

    @Query(() => [Messages], { name: 'getAllMessages' })
    getAllMessages() {
      return this.messagesService.findAll();
    }

  
    // @Mutation(() => Messages)
    // removeChat(@Args('uuid', { type: () => String }) uuid: string) {
    //   return this.chatsService.remove(uuid);
    // }
  
    // @Query(() => Boolean, { name: 'checkChatPassword' })
    // checkPassword(
    //   @Args('uuid', { type: () => String }) uuid: string,
    //   @Args('password', { type: () => String }) password: string,
    // ) {
    //   return this.chatsService.checkPassword(uuid, password);
    // }
  

    @Subscription(() => Messages, {
      filter: (payload, variables) => {
        return payload.chatLogAdded.chatUUID === variables.uuid;
      },
    })
    chatLogAdded(@Args('uuid') uuid: string) {
      uuid;
      return this.pubSubProvider.getPubSub().asyncIterator('chatMsgAdded');
    }

}