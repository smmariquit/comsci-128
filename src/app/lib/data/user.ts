


export type User = {
    id: string
    name: string
    email: string
    //timeCreated , ...
}                           //temporary user schema

const MOCK_USERS: User[] = [
    {id: "1", name: "Mahoraga", email:"nahidadapt@mappa.com"},          //This serves as the mock 'Database' to test functions
    {id: "2", name: "John", email:"johnkaisen@mappa.com"},
    {id: "3", name: "Susan", email:"susangrotto@mgmail.com"},
    {id: "4", name: "Bruce Wayne", email:"alfredbuttler@wayne.com"},
    {id: "5", name: "Allan", email:"allancruz@gov.ph"},
]

export async function getUserById(userId:string): Promise<User | null>{ //This function takes a USERID of type STRING.
                                                                        // RETURNS a USER object when found in the DB, otherwise return null.

    //TODO: replace with actual Supabase queries when available
    
    const user = MOCK_USERS.find((u) => u.id === userId)
    return user ?? null
}
