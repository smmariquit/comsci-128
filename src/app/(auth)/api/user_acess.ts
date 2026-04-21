import { NextResponse } from "next/server";

// MOCK INTERFACE & DATA FOR FUNCTION TESTING. WILL BE FIXED ONCE OTHER DEPENDENCIES ARE MERGED
export interface User {
  id: string;
  name: string;
  email: string;
  user_type: string;
}

const MOCK_DATA: User[] = [
  {
    id: "1",
    name: "Mahoraga",
    email: "nahidadapt@mappa.com",
    user_type: "admin",
  },
  {
    id: "2",
    name: "Gojo",
    email: "hotdogcheesecake@gmail.com",
    user_type: "student",
  },
  {
    id: "3",
    name: "Robert",
    email: "marhabadorm@gmail.com",
    user_type: "landlord",
  },
];

// checkUserAccess - INPUT: user, allowedRole | OUTPUT: go next (if allowed), 403 (if not)
export const checkUserAccess = (
  user: User | undefined,
  allowedRole: string,
) => {
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.user_type !== allowedRole) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return null; // go next
};

// console testing
const mockAdmin = MOCK_DATA.find((u) => u.id === "1"); // admin
const mockStudent = MOCK_DATA.find((u) => u.id === "2"); // student
const mockLandlord = MOCK_DATA.find((u) => u.id === "3"); // landlord

const run = (user: User | undefined, role: string) => {
  const result = checkUserAccess(user, role);
  if (result === null) {
    console.log("access granted");
  } else {
    console.log("blocked");
  }
};

// --- ADMIN TESTS ---
console.log("=== ADMIN TESTS ===");

console.log("Test 1 - Admin accessing admin route (correct):");
run(mockAdmin, "admin");

console.log("Test 2 - Student accessing admin route (wrong):");
run(mockStudent, "admin");

console.log("Test 3 - Landlord accessing admin route (wrong):");
run(mockLandlord, "admin");

// --- STUDENT TESTS ---
console.log("\n=== STUDENT TESTS ===");

console.log("Test 4 - Student accessing student route (correct):");
run(mockStudent, "student");

console.log("Test 5 - Admin accessing student route (wrong):");
run(mockAdmin, "student");

console.log("Test 6 - Landlord accessing student route (wrong):");
run(mockLandlord, "student");

// --- LANDLORD TESTS ---
console.log("\n=== LANDLORD TESTS ===");

console.log("Test 7 - Landlord accessing landlord route (correct):");
run(mockLandlord, "landlord");

console.log("Test 8 - Admin accessing landlord route (wrong):");
run(mockAdmin, "landlord");

console.log("Test 9 - Student accessing landlord route (wrong):");
run(mockStudent, "landlord");
