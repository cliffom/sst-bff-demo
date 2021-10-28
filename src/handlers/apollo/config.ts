interface Config {
  usersAPIBaseURL: string;
  stage: string;
  isLocal: boolean;
}

function getConfig(): Config {
  const newConfig: Config = {
    usersAPIBaseURL: process.env.USERS_API_URL as string,
    stage: process.env.STAGE as string,
    isLocal: !!process.env.IS_LOCAL as boolean,
  };

  return newConfig;
}

export {Config, getConfig};
