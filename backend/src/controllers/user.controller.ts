import { Request as ExpressRequest, Response } from "express";
import { AuthenticatedRequest } from "../../types";
import * as userService from "../services/user.service";
import { AppError } from "../utils/app-error";

export const getUsersByOrgId = async (req: ExpressRequest, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const users = await userService.getUsersByOrg(orgId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, email, password, teamId, roleId, isEmailVerified, isActive, signupSource } = req.body;
    const orgId = req.params.orgId;

    if (!req.user?.id || !req.user.fullName || !req.user.orgId) {
      throw new AppError("Invalid or missing user context", 400);
    }

    const newUser = await userService.createUser({
      fullName,
      email,
      password,
      teamId,
      roleId,
      isEmailVerified,
      isActive,
      orgId,
      signupSource
    }, {
      id: req.user.id,
      fullName: req.user.fullName,
      orgId: req.user.orgId
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;
    const updatedUser = await userService.updateUser(userId, updates, { user: req.user });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    await userService.deleteUser(userId, { user: req.user });
    res.status(200).json({ message: "User deleted successfully" });
   } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete user" });
  }
};


export const getUserRolesByOrgId = async (req: ExpressRequest, res: Response) => {
  
  const orgId = req.params.orgId;

  try {
    const roles = await userService.getUserRolesByOrg(orgId);
 
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user roles" });
  }
};
