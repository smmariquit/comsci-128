export interface User {
    id: string;
    name: string;
    email: string;
}

const MOCK_DATA: User[] = [
    {id: "1", name: "Mahoraga", email: "nahidadapt@mappa.com"}
];

export const getProfile = async (userId: string): Promise<User | null> => {
    const user = MOCK_DATA.find((u) => u.id === userId);

    if (!user) {
        return null;
    }
    return user;
}

getProfile("1").then(user => console.log("User Profile Found: ", user));