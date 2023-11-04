export default interface UpdateUserResponse {
    id: number;
    email: string;
    name: string;
    role: string;
    access_token?: string | null;
}
