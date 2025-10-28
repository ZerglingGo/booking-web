type Article = {
  id: number;
  category: string;
  title: string;
  content: string;
  image: string | null;
  image_url: string | null;
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
  description: string;
  cover_image: string | null;
  map_image: string | null;
  cover_image_url: string | null;
  map_image_url: string | null;
  price: number;
  additional_person_price: number;
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

type Reservation = {
  id: number;
  site_id: number;
  zone_name: string;
  site_name: string;
  name: string;
  contact: string;
  additional_person: number;
  price: number;
  refunded_price: number;
  pay_id: string;
  pay_tid: string | null;
  pay_status: string;
  reservation_at: Date;
  canceled_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
