export interface Story {
  avatar: string;
  id: string;
  story: string;
  username: string;
}

export interface Comment {
  id: string;
  username: string;
  comment: string;
}

export interface TimeStamp {
  nanoseconds: number;
  seconds: number;
}

export interface Post {
  id: string;
  avatar: string;
  likeCount: number;
  commentCount: number;
  postImg: string;
  username: string;
  dateCreated: TimeStamp;
  isLiked: boolean;
}
