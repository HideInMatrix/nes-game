export interface Game {
  id: number | string;
  title: string;
  image: string;
  url: string;
  comment: string;
  publisher: string;
  source: string;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  games?: Game[];
}
