/** https://api.mattermost.com/#tag/reactions%2Fpaths%2F~1posts~1%7Bpost_id%7D~1reactions%2Fget */
export interface Reaction {
  user_id: string;
  post_id: string;
  emoji_name: string;
  create_at: number;
}

export type PostReactionsResponse = Reaction[];


/** https://api.mattermost.com/#tag/users%2Fpaths%2F~1users~1%7Buser_id%7D%2Fget */
export interface UserById {
  id: string,
  create_at: number,
  update_at: number,
  delete_at: number,
  username: string,
  first_name: string,
  last_name: string,
  nickname: string,
  email: string,
  email_verified: true,
  auth_service: string,
  roles: string,
  locale: string,
  notify_props: {
    email: string,
    push: string,
    desktop: string,
    desktop_sound: string,
    mention_keys: string,
    channel: string,
    first_name: string
  },
  props: { [key: string]: any },
  last_password_update: number,
  last_picture_update: number,
  failed_attempts: number,
  mfa_active: true,
  timezone: {
    useAutomaticTimezone: string,
    manualTimezone: string,
    automaticTimezone: string
  },
  terms_of_service_id: string,
  terms_of_service_create_at: number
}
