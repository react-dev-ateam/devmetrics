import React from "react";
import { ActivityFeed } from "./activity-feed";

import { ActivityFeedEvent } from "@/types";

export async function ActivityFeedServer() {
  // Simulate an async data fetch for initial events if needed
  const initialEvents: ActivityFeedEvent[] = []; 
  
  // Wait a bit to show off the Suspense boundary
  await new Promise(resolve => setTimeout(resolve, 800));

  return (
    <ActivityFeed 
      initialEvents={initialEvents} 
      streamUrl="/api/metrics/stream" 
    />
  );
}
