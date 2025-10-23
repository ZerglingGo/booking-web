type Article = {
  id: number;
  category: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

type Question = {
  id: number;
  question: string;
  answer: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

type Zone = {
  id: number;
  name: string;
  person_capacity: number;
  additional_person_capacity: number;
  check_in_time: string;
  check_out_time: string;
  is_active: boolean;
  order: number;
  cover_image: string | null;
  map_image: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

type Site = {
  id: number;
  zone_id: number;
  name: string;
  person_capacity: number; // nullable in DB but treated as number in app
  additional_person_capacity: number; // nullable in DB but treated as number in app
  is_active: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
