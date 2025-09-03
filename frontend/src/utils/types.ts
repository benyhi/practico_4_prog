export type Usuario = {
  id?: number;
  username: string;
  email: string;
  role: "user" | "admin" | "moderator";
};

export type Producto = {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

