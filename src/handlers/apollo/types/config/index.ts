export interface Config {
  apiBaseURL: string;
  stage: string;
  isLocal: boolean;
}
  
export function getConfig(): Config {
  const newConfig: Config = {
    apiBaseURL: process.env.API_URL as string,
    stage: process.env.STAGE as string,
    isLocal: !!process.env.IS_LOCAL as boolean
  }
  return newConfig
}