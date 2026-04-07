import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NewUser, User } from "@/models/user";

const { mockUserData, mockBcrypt } = vi.hoisted(() => ({
  mockUserData: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    update: vi.fn(),
    deactivateById: vi.fn(),
  },
  mockBcrypt: {
    genSalt: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("@/app/lib/data/user-data", () => ({
  userData: mockUserData,
}));

vi.mock("bcrypt", () => ({
  default: mockBcrypt,
}));

import { userService } from "@/services/user-service";

const baseUser: User = {
  account_number: 1,
  account_email: "student@up.edu.ph",
  first_name: "Alex",
  last_name: "Reyes",
  password: "hashed-password",
  user_type: "Student",
  sex: "Male",
  birthday: null,
  contact_email: null,
  home_address: null,
  is_deleted: false,
  middle_name: null,
  phone_number: null,
};

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addUser", () => {
    it("creates a user with a hashed password and default Student type", async () => {
      const input: NewUser = {
        account_email: "new@up.edu.ph",
        first_name: "New",
        last_name: "User",
        password: "plain-password",
      };

      mockUserData.findByEmail.mockResolvedValue(null);
      mockBcrypt.genSalt.mockResolvedValue("salt");
      mockBcrypt.hash.mockResolvedValue("hashed-password");
      mockUserData.create.mockResolvedValue({ ...baseUser, account_email: input.account_email });

      const created = await userService.addUser(input);

      expect(mockUserData.findByEmail).toHaveBeenCalledWith("new@up.edu.ph");
      expect(mockBcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(mockBcrypt.hash).toHaveBeenCalledWith("plain-password", "salt");
      expect(mockUserData.create).toHaveBeenCalledWith(
        expect.objectContaining({
          account_email: "new@up.edu.ph",
          first_name: "New",
          last_name: "User",
          user_type: "Student",
          password: "hashed-password",
        }),
      );
      expect(created.account_email).toBe("new@up.edu.ph");
    });

    it("throws when email is already in use", async () => {
      const input: NewUser = {
        account_email: "student@up.edu.ph",
        first_name: "Alex",
        last_name: "Reyes",
        password: "plain-password",
      };

      mockUserData.findByEmail.mockResolvedValue(baseUser);

      await expect(userService.addUser(input)).rejects.toThrow("Email already in use.");
      expect(mockUserData.create).not.toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it("returns null when user does not exist", async () => {
      mockUserData.findById.mockResolvedValue(null);

      const user = await userService.getUser(999);

      expect(user).toBeNull();
    });

    it("removes sensitive fields from the returned user", async () => {
      mockUserData.findById.mockResolvedValue(baseUser);

      const user = await userService.getUser(1);

      expect(user).toEqual(expect.objectContaining({
        account_email: "student@up.edu.ph",
        first_name: "Alex",
        last_name: "Reyes",
      }));
      expect(user).not.toHaveProperty("account_number");
      expect(user).not.toHaveProperty("password");
    });
  });

  describe("getAllUser", () => {
    it("returns an empty array when data layer returns null", async () => {
      mockUserData.findAll.mockResolvedValue(null);

      const users = await userService.getAllUser();

      expect(users).toEqual([]);
    });

    it("returns only non-sensitive fields for each user", async () => {
      mockUserData.findAll.mockResolvedValue([
        baseUser,
        { ...baseUser, account_number: 2, account_email: "other@up.edu.ph" },
      ]);

      const users = await userService.getAllUser();

      expect(users).toHaveLength(2);
      users?.forEach((user) => {
        expect(user).not.toHaveProperty("account_number");
        expect(user).not.toHaveProperty("password");
      });
    });
  });

  describe("updateUser", () => {
    it("strips disallowed update fields and returns non-sensitive data", async () => {
      const updates: NewUser = {
        account_email: "ignored@up.edu.ph",
        first_name: "Updated",
        last_name: "Name",
        password: "new-pass",
        is_deleted: true,
      };

      mockUserData.update.mockResolvedValue({
        ...baseUser,
        first_name: "Updated",
        last_name: "Name",
      });

      const result = await userService.updateUser(1, updates);

      expect(mockUserData.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          first_name: "Updated",
          last_name: "Name",
          password: "new-pass",
        }),
      );
      expect(mockUserData.update).toHaveBeenCalledWith(
        1,
        expect.not.objectContaining({
          account_email: expect.anything(),
          is_deleted: expect.anything(),
        }),
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(expect.objectContaining({
        first_name: "Updated",
        last_name: "Name",
      }));
      expect(result.data).not.toHaveProperty("account_number");
      expect(result.data).not.toHaveProperty("password");
    });

    it("returns an error object when user does not exist", async () => {
      mockUserData.update.mockResolvedValue(null);

      const result = await userService.updateUser(999, {
        first_name: "Missing",
      } as NewUser);

      expect(result).toEqual({ error: "User not found" });
    });
  });

  describe("deactivateUser", () => {
    it("returns null when the user cannot be deactivated", async () => {
      mockUserData.deactivateById.mockResolvedValue(null);

      const result = await userService.deactivateUser(999);

      expect(result).toBeNull();
    });

    it("returns non-sensitive data when deactivation succeeds", async () => {
      mockUserData.deactivateById.mockResolvedValue(baseUser);

      const result = await userService.deactivateUser(1);

      expect(mockUserData.deactivateById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expect.objectContaining({
        account_email: "student@up.edu.ph",
      }));
      expect(result).not.toHaveProperty("account_number");
      expect(result).not.toHaveProperty("password");
    });
  });
});
