/** https://developers.mattermost.com/integrate/slash-commands/#basic-usage */
export interface SlashCommandRequest {
  channel_id: string;
  channel_name: string;
  command: string;
  response_url: string;
  team_domain: string;
  team_id: string;
  text: string;
  token: string;
  trigger_id: string;
  user_id: string;
  user_name: string
}

/** https://developers.mattermost.com/integrate/slash-commands/#parameters */
export interface SlashCommandResponse {
  text?: string;
  response_type?: 'ephemeral' | 'in_channel';  // default 'ephemeral'
  username?: string;
  channel_id?: string;
  icon_url?: string;
  goto_location?: string;
  attachments?: Attachment[];
  type?: string;
  extra_responses: SlashCommandResponse[];
  props?: { [key: string]: any };
}

/** https://docs.mattermost.com/developer/message-attachments.html#example-message-attachment */
export interface Attachment {
  fallback?: string;
  color?: string;
  text?: string;
  author_name?: string;
  author_icon?: string;
  author_link?: string;
  title?: string;
  title_link?: string;
  fields?: AttachmentField[];
  image_url?: string;
}

export interface AttachmentField {
  short?: boolean;
  title?: string;
  value?: string;
}
