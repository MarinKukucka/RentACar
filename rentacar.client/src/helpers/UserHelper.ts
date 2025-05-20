import { AuthClient } from "../api/api";

export const ADMIN = 'Admin';
export const AGENT = 'Agent';

export const checkUserInRole = async (roles: string[]) => {
    const user = await new AuthClient().me();

    return roles.some(role => user.roles?.includes(role));
}

export const isAuthenticated = async () => {
    try {
        const user = await new AuthClient().me();
        return !!user?.id;
    } catch {
        return false;
    }
}