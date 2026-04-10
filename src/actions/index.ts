"use server";

import { z } from "zod";
import { Deployment, Incident } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Validation schemas
const DeploymentSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  branch: z.string().min(1, "Branch name is required"),
  environment: z.enum(["production", "staging", "development", "preview"]),
});

const AcknowledgeSchema = z.object({
  incident_id: z.string().min(1, "Incident ID is required"),
  acknowledged_by: z.string().min(1, "User ID is required"),
});

export interface DeploymentInput {
  serviceId: string;
  branch: string;
  environment: string;
}

export async function deployService(
  data: DeploymentInput
): Promise<{ data?: Deployment; error?: string; fieldErrors?: Record<string, string[]>; inputs?: DeploymentInput }> {
  try {
    const validated = DeploymentSchema.safeParse(data);

    if (!validated.success) {
      return {
        error: "Validation failed",
        fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
        inputs: data,
      };
    }

    const response = await fetch(`${BASE_URL}/api/deployments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated.data),
    });

    if (!response.ok) {
      throw new Error("Failed to trigger deployment");
    }

    const result = await response.json();
    return { data: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      inputs: data,
    };
  }
}

export async function acknowledgeIncident(
  formData: unknown
): Promise<{ data?: Incident; error?: string }> {
  try {
    const validated = AcknowledgeSchema.parse(formData);

    const response = await fetch(
      `${BASE_URL}/api/incidents/${validated.incident_id}/acknowledge`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acknowledged_by: validated.acknowledged_by,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to acknowledge incident");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
