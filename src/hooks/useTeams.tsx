import { useState, useEffect } from 'react';
import { getTeams } from '@/services/teams/teams';
import { teamsData } from '@/types';

export function useTeamsData(email: string | undefined | null, typeTask: string) {
  const [teams, setTeams] = useState([] as teamsData[]);

  useEffect(() => {
    if (!email || typeTask !== "teams") {
      setTeams([]);
      return;
    }

    const unsubscribe = getTeams(email, (updatedTeams) => {
      setTeams(updatedTeams);
    });

    return () => {
      unsubscribe();
    };
  }, [email, typeTask]);

  return teams;
}