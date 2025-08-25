import { Request, Response } from "express";
import * as teamService from "../services/team.service";

export const getTeamsByOrgId = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const teams = await teamService.getTeamsByOrg(orgId);
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { teamName } = req.body;
    const orgId = req.params.orgId;
    const newTeam = await teamService.createTeam(teamName, orgId);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const { teamName, isActive } = req.body;
    const updatedTeam = await teamService.updateTeam(teamId, { teamName, isActive });
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Failed to update team", error });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;
    await teamService.deleteTeam(teamId);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team", error });
  }
};