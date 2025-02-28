export enum MessageEvent {
  /** The `OnMessageSent` event is emitted when a message is sent. */
  OnMessageSent = 'OnMessageSent',
  /** The `OnMessageResponse` event is emitted when a message is received. */
  OnMessageResponse = 'OnMessageResponse',
  /** The `OnMessageUpdate` event is emitted when a message is updated. */
  OnMessageUpdate = 'OnMessageUpdate',
  /** The `OnWorkspaceOperationRequest` event is emitted when a workspace operation is requested. */
  OnWorkspaceOperationRequest = 'message.workspace.operation',
  /** The `OnWorkspaceUpdated` event is emitted when a workspace is updated. */
  OnWorkspaceUpdated = 'message.workspace.updated',
}
