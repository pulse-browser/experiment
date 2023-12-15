export class MessageReviver<
  Cb extends (argument: ReceiveMessageArgument) => unknown,
> implements MessageListener
{
  receiveMessage: Cb

  constructor(callback: Cb) {
    this.receiveMessage = callback
  }
}
